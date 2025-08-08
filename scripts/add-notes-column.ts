import 'dotenv/config';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function addNotesColumn() {
  try {
    console.log('Adding notes column to templates table...');
    
    // Check if column already exists
    const checkColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'templates' 
      AND column_name = 'notes'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ Notes column already exists');
      process.exit(0);
    }
    
    // Add the notes column
    await db.execute(sql`
      ALTER TABLE templates 
      ADD COLUMN IF NOT EXISTS notes TEXT
    `);
    
    console.log('✅ Notes column added successfully');
  } catch (error) {
    console.error('❌ Failed to add notes column:', error);
  }
  process.exit(0);
}

addNotesColumn();