-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create templates table
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
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS embedding_idx ON templates 
USING hnsw (embedding vector_cosine_ops);