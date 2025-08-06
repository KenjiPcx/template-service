import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function addTypeField() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    console.log('Adding type column to templates table...');
    await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'starter'`;
    console.log('✓ Type column added successfully!');
  } catch (error) {
    console.error('Error adding type column:', error);
  } finally {
    process.exit();
  }
}

addTypeField();