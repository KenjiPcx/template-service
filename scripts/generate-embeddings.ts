import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

async function generateEmbeddings() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    console.log('Fetching templates without embeddings...');
    const templates = await sql`
      SELECT id, title, description, best_use_case, library_tags, architecture_tags
      FROM templates
      WHERE embedding IS NULL OR best_use_case IS NOT NULL
    `;
    
    console.log(`Found ${templates.length} templates to process`);
    
    for (const template of templates) {
      console.log(`Processing ${template.title}...`);
      
      // Create text for embedding with best_use_case as primary focus
      const textToEmbed = [
        template.best_use_case || '',
        template.title,
        template.description,
        ...(template.library_tags || []),
        ...(template.architecture_tags || [])
      ].filter(Boolean).join(' ');
      
      try {
        const { embedding } = await embed({
          model: openai.textEmbeddingModel('text-embedding-3-small'),
          value: textToEmbed,
        });
        
        // Update template with embedding
        await sql`
          UPDATE templates 
          SET embedding = ${JSON.stringify(embedding)}::vector,
              updated_at = NOW()
          WHERE id = ${template.id}
        `;
        
        console.log(`✓ Generated embedding for ${template.title}`);
      } catch (error) {
        console.error(`Failed to generate embedding for ${template.title}:`, error);
      }
    }
    
    console.log('All embeddings generated successfully!');
  } catch (error) {
    console.error('Error generating embeddings:', error);
  } finally {
    process.exit();
  }
}

generateEmbeddings();