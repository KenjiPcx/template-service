import 'dotenv/config';
import { db, templates } from '../lib/db';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { eq } from 'drizzle-orm';

const templateUseCases = [
  {
    title: 'Supabase SaaS',
    bestUseCase: 'Building multi-tenant SaaS applications with authentication, subscriptions, and team management'
  },
  {
    title: 'Next.js Commerce',
    bestUseCase: 'Creating modern e-commerce storefronts with product catalogs, shopping carts, and payment processing'
  },
  {
    title: 'Platforms Starter Kit',
    bestUseCase: 'Building multi-tenant platforms with custom domains, user dashboards, and admin panels'
  },
  {
    title: 'React Native AI',
    bestUseCase: 'Developing mobile AI applications with chat interfaces, image generation, and voice assistants'
  },
  {
    title: 'Precedent',
    bestUseCase: 'Quickly starting modern web applications with authentication, database, and deployment ready'
  },
  {
    title: 'Virtual Event Starter Kit',
    bestUseCase: 'Creating online conference and event platforms with live streaming, chat, and attendee management'
  }
];

async function updateTemplates() {
  try {
    console.log('Fetching existing templates...');
    const existingTemplates = await db.select().from(templates);
    
    for (const template of existingTemplates) {
      const useCase = templateUseCases.find(t => t.title === template.title);
      
      if (!useCase) {
        console.log(`No use case found for ${template.title}, skipping...`);
        continue;
      }
      
      console.log(`Updating ${template.title}...`);
      
      // Generate embedding
      const textToEmbed = `${useCase.bestUseCase} ${template.title} ${template.description} ${template.libraryTags?.join(' ') || ''} ${template.architectureTags?.join(' ') || ''}`;
      
      let embedding = null;
      try {
        const embeddingResult = await embed({
          model: openai.textEmbeddingModel('text-embedding-3-small'),
          value: textToEmbed,
        });
        embedding = embeddingResult.embedding;
        console.log(`Generated embedding for ${template.title}`);
      } catch (error) {
        console.error(`Failed to generate embedding for ${template.title}:`, error);
      }
      
      // Update template with bestUseCase and embedding
      await db
        .update(templates)
        .set({
          bestUseCase: useCase.bestUseCase,
          embedding: embedding as any,
          updatedAt: new Date()
        })
        .where(eq(templates.id, template.id));
      
      console.log(`Updated ${template.title} successfully`);
    }
    
    console.log('All templates updated successfully!');
  } catch (error) {
    console.error('Error updating templates:', error);
  } finally {
    process.exit();
  }
}

updateTemplates();