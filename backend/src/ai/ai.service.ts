import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Pinecone } from '@pinecone-database/pinecone';
import { Queue, Worker } from 'bullmq';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private pinecone: Pinecone;
  private embeddingQueue: Queue;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // init Pinecone
    this.pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

    // init BullMQ
    this.embeddingQueue = new Queue('embeddings', {
      connection: { host: 'localhost', port: 6379 },
    });

    // worker for embedding jobs
    new Worker(
      'embeddings',
      async job => {
        const { text, metadata } = job.data as {
          text: string;
          metadata: any;
        };
        const vector = await this.embedText(text);
        const id = String(job.id);

        // Upsert directly with an array of records
        const index = this.pinecone.Index(process.env.PINECONE_INDEX!);
        await index.upsert([
          { id, values: vector, metadata },
        ]);

        // Also save to your DB
        await this.prisma.embedding.create({
          data: { model: 'text-embedding-ada-002', vector, metadata },
        });
      },
      { connection: { host: 'localhost', port: 6379 } },
    );

    this.logger.log('AI service initialized');
  }

  async complete(prompt: string): Promise<string> {
    const response = await Promise.resolve('stub');
    await this.prisma.promptLog.create({
      data: { model: 'gpt-4', prompt, response, tokensUsed: 0 },
    });
    return response;
  }

  async embedText(text: string): Promise<number[]> {
    return [0, 0, 0];
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
}