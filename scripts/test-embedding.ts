import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import 'dotenv/config';

async function testEmbedding() {
  try {
    console.log('Testing OpenAI embedding generation...');
    
    const { embedding } = await embed({
      model: openai.textEmbeddingModel('text-embedding-3-small'),
      value: 'Test embedding generation',
    });
    
    console.log('✅ Embedding generated successfully');
    console.log('Embedding dimensions:', embedding.length);
    console.log('First 5 values:', embedding.slice(0, 5));
  } catch (error) {
    console.error('❌ Failed to generate embedding:', error);
  }
}

testEmbedding();