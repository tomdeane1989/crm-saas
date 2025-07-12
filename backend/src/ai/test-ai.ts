// Simple test script to verify AI service integration
// Run with: npx ts-node src/ai/test-ai.ts

import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';

async function testAiService() {
  console.log('Testing AI Service...');

  const prisma = new PrismaService();
  const aiService = new AiService(prisma);

  try {
    // Test embedding (this will fail without OpenAI API key)
    console.log('Testing embedding...');
    const embedding = await aiService.embedText('Hello world');
    console.log('Embedding length:', embedding.length);

    // Test completion (this will fail without OpenAI API key)
    console.log('Testing completion...');
    const completion = await aiService.complete('What is 2+2?');
    console.log('Completion:', completion);

    // Test CRM search (this should work even without data)
    console.log('Testing CRM search...');
    const searchResults = await aiService.searchCrmData('technology');
    console.log('Search results:', JSON.stringify(searchResults, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if called directly
if (require.main === module) {
  testAiService();
}
