import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const sql = neon(process.env.DATABASE_URL!);
    
    // First, enable pgvector
    console.log('Enabling pgvector extension...');
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;
    
    // Create table
    console.log('Creating templates table...');
    await sql`
      CREATE TABLE IF NOT EXISTS templates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        library_tags TEXT[] DEFAULT '{}' NOT NULL,
        architecture_tags TEXT[] DEFAULT '{}' NOT NULL,
        github_url VARCHAR(500) NOT NULL,
        embedding vector(1536),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    
    console.log('✅ Database connection successful!');
    console.log('✅ Table created successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();