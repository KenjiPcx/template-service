import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import dotenv from 'dotenv';
import * as schema from '../lib/db/schema';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const seedData = [
  // Starter Templates
  {
    title: 'AI Chatbot',
    description: 'An open-source AI chatbot app template built with Next.js, the Vercel AI SDK, and Vercel KV',
    bestUseCase: 'Building conversational AI applications with real-time chat capabilities',
    type: 'starter' as const,
    libraryTags: ['nextjs', 'vercel-ai-sdk', 'react', 'typescript', 'tailwindcss'],
    architectureTags: ['serverless', 'edge-functions', 'real-time'],
    githubUrl: 'https://github.com/vercel/ai-chatbot'
  },
  {
    title: 'Gemini Fullstack LangGraph',
    description: 'Fullstack quickstart template for building AI agents with Google Gemini and LangGraph',
    bestUseCase: 'Creating complex AI agent workflows with Google Gemini integration',
    type: 'starter' as const,
    libraryTags: ['langgraph', 'google-gemini', 'typescript', 'react'],
    architectureTags: ['agent-based', 'graph-architecture', 'ai-workflow'],
    githubUrl: 'https://github.com/google-gemini/gemini-fullstack-langgraph-quickstart'
  },
  {
    title: 'Full Stack FastAPI Template',
    description: 'Full stack, modern web application template using FastAPI, React, PostgreSQL, Docker, and more',
    bestUseCase: 'Building production-ready Python web applications with modern tech stack',
    type: 'starter' as const,
    libraryTags: ['fastapi', 'react', 'postgresql', 'docker', 'python', 'typescript'],
    architectureTags: ['microservices', 'rest-api', 'container-based'],
    githubUrl: 'https://github.com/fastapi/full-stack-fastapi-template'
  },
  {
    title: 'Create T3 App',
    description: 'The best way to start a full-stack, typesafe Next.js app with tRPC, Prisma, NextAuth, and Tailwind CSS',
    bestUseCase: 'Starting typesafe full-stack applications with end-to-end type safety',
    type: 'starter' as const,
    libraryTags: ['nextjs', 'trpc', 'prisma', 'nextauth', 'tailwindcss', 'typescript'],
    architectureTags: ['monolithic', 'type-safe', 'full-stack'],
    githubUrl: 'https://github.com/t3-oss/create-t3-app'
  },
  {
    title: 'Next.js Commerce',
    description: 'A Next.js 14 and App Router-ready ecommerce template featuring server components and Tailwind CSS',
    bestUseCase: 'Building modern e-commerce applications with server-side rendering',
    type: 'starter' as const,
    libraryTags: ['nextjs', 'react', 'tailwindcss', 'typescript', 'vercel'],
    architectureTags: ['e-commerce', 'serverless', 'jamstack'],
    githubUrl: 'https://github.com/vercel/commerce'
  },
  {
    title: 'Create T3 Turbo',
    description: 'Clean and typesafe starter repo using the T3 Stack along with Expo React Native and Turborepo',
    bestUseCase: 'Creating cross-platform mobile and web applications in a monorepo setup',
    type: 'starter' as const,
    libraryTags: ['expo', 'react-native', 'nextjs', 'trpc', 'prisma', 'turborepo', 'typescript'],
    architectureTags: ['monorepo', 'mobile', 'cross-platform'],
    githubUrl: 'https://github.com/t3-oss/create-t3-turbo'
  },
  
  // Add-on Templates
  {
    title: 'Vector Search Example',
    description: 'A complete implementation of semantic search using pgvector and OpenAI embeddings. Features a clean UI for searching content with natural language queries and real-time similarity matching.',
    bestUseCase: 'Learning how to implement vector search and semantic similarity matching in your applications. Great example for adding AI-powered search to any content platform, documentation site, or knowledge base.',
    type: 'addon' as const,
    libraryTags: ['nextjs', 'react', 'typescript', 'tailwindcss', 'drizzle', 'postgresql', 'pgvector', 'openai'],
    architectureTags: ['search', 'ai', 'semantic-search', 'embeddings', 'vector-database'],
    githubUrl: 'https://github.com/kenjipcx-fern/template-service',
    notes: 'This is the same repository that powers this template discovery platform. Check the README for detailed implementation guide.'
  },
  {
    title: 'UploadThing File Upload',
    description: 'Modern file upload implementation with UploadThing. Features drag-and-drop, progress tracking, image preview, and automatic cloud storage with type-safe APIs.',
    bestUseCase: 'Quick implementation of production-ready file uploads with minimal configuration. Perfect for user avatars, document uploads, image galleries, and any file storage needs.',
    type: 'addon' as const,
    libraryTags: ['nextjs', 'react', 'typescript', 'uploadthing', 'tailwindcss'],
    architectureTags: ['file-upload', 'cloud-storage', 'media-handling', 'forms'],
    githubUrl: 'https://github.com/kenjipcx-fern/template-upload-thing',
    notes: 'Looking for more UploadThing examples? The official repository contains 20+ additional examples including: S3 uploads, multiple file handling, image optimization, video uploads, and more. Check them out at: https://github.com/pingdotgg/uploadthing/tree/main/examples'
  }
];

async function seed() {
  console.log('🌱 Starting seed...');
  
  try {
    // Clear existing data
    console.log('Clearing existing templates...');
    await db.delete(schema.templates);
    
    // Insert seed data with embeddings
    console.log('Inserting templates with embeddings...');
    for (const template of seedData) {
      const textToEmbed = `Title: ${template.title}
        Description: ${template.description}
        Best Use Case: ${template.bestUseCase}
        Type: ${template.type}
        Library Tags: ${(template.libraryTags && template.libraryTags.length > 0) ? template.libraryTags.join(', ') : ''}
        Architecture Tags: ${(template.architectureTags && template.architectureTags.length > 0) ? template.architectureTags.join(', ') : ''}
        GitHub URL: ${template.githubUrl}`;

      console.log(`Generating embedding for: ${template.title}`);
      const { embedding } = await embed({
        model: openai.textEmbeddingModel('text-embedding-3-small'),
        value: textToEmbed,
      });
      
      await db.insert(schema.templates).values({
        ...template,
        embedding: embedding as any,
      });
      
      console.log(`✅ Added: ${template.title}`);
    }
    
    console.log('🎉 Seed completed successfully!');
    console.log(`📊 Total templates added: ${seedData.length}`);
    console.log(`   • Starter templates: ${seedData.filter(t => t.type === 'starter').length}`);
    console.log(`   • Add-on templates: ${seedData.filter(t => t.type === 'addon').length}`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();