import 'dotenv/config';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Database connected successfully:', result);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
  process.exit(0);
}

testConnection();