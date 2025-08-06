import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    console.log('Adding best_use_case column...');
    await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS best_use_case TEXT`;
    console.log('Column added successfully!');
    
    // Update existing templates with default best use cases
    const updates = [
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
    
    for (const update of updates) {
      console.log(`Updating ${update.title}...`);
      await sql`
        UPDATE templates 
        SET best_use_case = ${update.bestUseCase}
        WHERE title = ${update.title} AND best_use_case IS NULL
      `;
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

migrate();