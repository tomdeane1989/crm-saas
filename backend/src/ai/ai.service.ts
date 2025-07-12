import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Pinecone } from '@pinecone-database/pinecone';
import { Queue, Worker } from 'bullmq';
import OpenAI from 'openai';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private pinecone: Pinecone;
  private embeddingQueue: Queue;
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // init OpenAI
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    // init Pinecone
    this.pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

    // init BullMQ
    this.embeddingQueue = new Queue('embeddings', {
      connection: { host: 'localhost', port: 6379 },
    });

    // worker for embedding jobs
    new Worker(
      'embeddings',
      async (job) => {
        const { text, metadata } = job.data as {
          text: string;
          metadata: any;
        };
        const vector = await this.embedText(text);
        const id = String(job.id);

        // Upsert directly with an array of records
        const index = this.pinecone.Index(process.env.PINECONE_INDEX!);
        await index.upsert([{ id, values: vector, metadata }]);

        // Also save to your DB
        await this.prisma.embedding.create({
          data: { model: 'text-embedding-3-small', vector, metadata },
        });
      },
      { connection: { host: 'localhost', port: 6379 } },
    );

    this.logger.log('AI service initialized');
  }

  async complete(prompt: string): Promise<string> {
    return this.withRetry(async () => {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || '';
      const tokensUsed = response.usage?.total_tokens || 0;

      await this.prisma.promptLog.create({
        data: {
          model: 'gpt-4o-mini',
          prompt,
          response: content,
          tokensUsed,
        },
      });

      return content;
    }, 'complete prompt');
  }

  async embedText(text: string): Promise<number[]> {
    return this.withRetry(async () => {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    }, 'generate embedding');
  }

  async enqueueEmbedding(text: string, metadata: any) {
    await this.embeddingQueue.add('embed', { text, metadata });
  }

  async semanticSearch(query: string): Promise<any> {
    const vector = await this.embedText(query);
    const index = this.pinecone.Index(process.env.PINECONE_INDEX!);
    // Query directly with vector & topK
    return index.query({ vector, topK: 10 });
  }

  async searchCrmData(query: string): Promise<any> {
    // First try semantic search if we have embeddings
    let semanticResults = null;
    try {
      semanticResults = await this.semanticSearch(query);
    } catch (error) {
      this.logger.warn(
        'Semantic search failed, falling back to database search',
      );
    }

    // Also search database directly for recent data
    const companies = await this.prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { industry: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
      include: {
        contacts: { take: 3 },
        opportunities: { take: 3 },
        activities: { take: 3, orderBy: { createdAt: 'desc' } },
      },
    });

    const opportunities = await this.prisma.opportunity.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
      include: {
        company: true,
        contact: true,
      },
    });

    return {
      semantic: semanticResults,
      companies,
      opportunities,
      query,
    };
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 3,
    delay: number = 1000,
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          this.logger.error(
            `Failed to ${operationName} after ${maxRetries} attempts:`,
            error,
          );
          throw new Error(`Failed to ${operationName}`);
        }

        this.logger.warn(
          `Attempt ${attempt} failed for ${operationName}, retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
    throw new Error(`Failed to ${operationName}`);
  }
}
