# Vector Search Template Library

A modern template discovery platform with AI-powered semantic search using pgvector and OpenAI embeddings. Search through code templates using natural language queries and find exactly what you need.

## 🚀 Features

- **Semantic Search**: Find templates using natural language queries
- **Vector Embeddings**: Powered by OpenAI's text-embedding-3-small model
- **PostgreSQL + pgvector**: Efficient similarity search at scale
- **Real-time Filtering**: Filter by template type, libraries, and architecture patterns
- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Tag Management**: Interactive tag input with badge display

## 📁 Key Files for Vector Search Implementation

### Database Setup
- **`lib/db/schema.ts`** - Defines the templates table with vector column
  ```typescript
  embedding: vector(1536)  // Stores OpenAI embeddings
  ```

- **`drizzle/0000_init_pgvector.sql`** - Enables pgvector extension
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;
  ```

### Core Search Implementation
- **`app/api/templates/search/route.ts`** - Main search endpoint
  - Generates embeddings for search queries
  - Performs cosine similarity search
  - Returns ranked results with similarity scores

### Embedding Generation
- **`app/api/templates/route.ts`** - POST endpoint
  - Generates embeddings when creating new templates
  - Combines title, description, and tags for embedding

- **`scripts/generate-embeddings.ts`** - Batch embedding generation
  - Updates existing templates with embeddings
  - Useful for migrating existing data

### Frontend Components
- **`components/SearchBar.tsx`** - Search input with debouncing
- **`components/FilterPanel.tsx`** - Filter controls for refining results
- **`components/TemplateCard.tsx`** - Display template results
- **`app/page.tsx`** - Main page orchestrating search and display

### Configuration
- **`drizzle.config.ts`** - Database configuration
- **`.env.local`** - Environment variables
  ```env
  DATABASE_URL=postgresql://...
  OPENAI_API_KEY=sk-...
  ```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL with pgvector extension
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kenjipcx-fern/template-service.git
   cd template-service
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your database URL and OpenAI API key

4. **Set up the database**
   ```bash
   # Enable pgvector extension
   psql $DATABASE_URL -f scripts/enable-pgvector.sql
   
   # Run migrations
   pnpm drizzle-kit push:pg
   ```

5. **Seed the database** (optional)
   ```bash
   pnpm tsx scripts/reseed-with-types.ts
   ```

6. **Run the development server**
   ```bash
   pnpm dev
   ```

## 🔍 How Vector Search Works

### 1. Embedding Generation
When a template is created or updated:
```typescript
const textToEmbed = `${title} ${description} ${tags.join(' ')}`;
const { embedding } = await embed({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  value: textToEmbed,
});
```

### 2. Search Query Processing
When a user searches:
```typescript
// Generate embedding for search query
const { embedding: queryEmbedding } = await embed({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  value: searchQuery,
});

// Find similar templates using cosine similarity
const results = await db.execute(sql`
  SELECT *, 
    1 - (embedding <=> ${queryEmbedding}::vector) as similarity
  FROM templates
  WHERE 1 - (embedding <=> ${queryEmbedding}::vector) > 0.3
  ORDER BY similarity DESC
  LIMIT 20
`);
```

### 3. Similarity Scoring
- Uses cosine similarity (1 = identical, 0 = orthogonal)
- Filters results with similarity > 0.3
- Returns top 20 most similar templates

## 📚 Adding Vector Search to Your Project

### Step 1: Database Setup
```sql
-- Enable pgvector
CREATE EXTENSION vector;

-- Add vector column to your table
ALTER TABLE your_table 
ADD COLUMN embedding vector(1536);
```

### Step 2: Generate Embeddings
```typescript
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

const { embedding } = await embed({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  value: yourTextContent,
});
```

### Step 3: Implement Search
```typescript
// Store embedding with your data
await db.insert(yourTable).values({
  ...data,
  embedding: embedding as any,
});

// Search by similarity
const results = await db.execute(sql`
  SELECT *, 
    1 - (embedding <=> ${queryEmbedding}::vector) as similarity
  FROM your_table
  WHERE embedding <=> ${queryEmbedding}::vector < 0.7
  ORDER BY embedding <=> ${queryEmbedding}::vector
`);
```

## 🎨 UI Components

### Tag Input System
The tag input component (`components/ui/tag-input.tsx`) provides:
- Add tags by pressing Enter
- Remove tags with X button
- Autocomplete suggestions
- Visual badge display

### Search Interface
- **Debounced search**: Prevents excessive API calls
- **Real-time results**: Updates as you type
- **Filter sidebar**: Refine by type, libraries, architecture

## 📈 Performance Considerations

1. **Index Creation**: For large datasets, create an index
   ```sql
   CREATE INDEX ON templates 
   USING ivfflat (embedding vector_cosine_ops)
   WITH (lists = 100);
   ```

2. **Embedding Caching**: Store embeddings to avoid regeneration

3. **Batch Processing**: Use `scripts/generate-embeddings.ts` for bulk updates

## 🔧 Common Issues

### pgvector not found
```bash
# macOS
brew install pgvector

# Ubuntu/Debian
sudo apt install postgresql-15-pgvector
```

### OpenAI rate limits
- Implement retry logic with exponential backoff
- Use batch embedding generation
- Consider caching embeddings

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on GitHub.