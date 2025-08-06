import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

const templatesData = [
  {
    title: 'Supabase SaaS',
    description: 'The fastest way to build a SaaS with React, Next.js, Supabase, and Stripe. Includes authentication, subscriptions, and team management.',
    bestUseCase: 'Building multi-tenant SaaS applications with authentication, subscription billing, team workspaces, and admin dashboards',
    libraryTags: ['nextjs', 'react', 'supabase', 'stripe', 'typescript', 'tailwindcss'],
    architectureTags: ['saas', 'multi-tenant', 'serverless', 'subscription'],
    githubUrl: 'https://github.com/vercel/nextjs-subscription-payments'
  },
  {
    title: 'Next.js Commerce',
    description: 'A Next.js 14 and App Router-ready ecommerce template featuring server components, dynamic OG images, and CSS variables.',
    bestUseCase: 'Creating modern e-commerce storefronts with product catalogs, shopping carts, payment processing, and inventory management',
    libraryTags: ['nextjs', 'react', 'typescript', 'tailwindcss', 'vercel-commerce'],
    architectureTags: ['e-commerce', 'headless', 'jamstack', 'serverless'],
    githubUrl: 'https://github.com/vercel/commerce'
  },
  {
    title: 'Platforms Starter Kit',
    description: 'A template for building multi-tenant applications with custom domain support using Next.js, Vercel, and PlanetScale.',
    bestUseCase: 'Building multi-tenant platforms with custom domains, user dashboards, admin panels, and white-label capabilities',
    libraryTags: ['nextjs', 'react', 'planetscale', 'prisma', 'typescript', 'tailwindcss'],
    architectureTags: ['multi-tenant', 'platform', 'white-label', 'custom-domains'],
    githubUrl: 'https://github.com/vercel/platforms'
  },
  {
    title: 'React Native AI',
    description: 'Full stack React Native AI chatbot and image generation app with streaming responses, speech-to-text, and more.',
    bestUseCase: 'Developing mobile AI applications with chat interfaces, image generation, voice assistants, and real-time AI interactions',
    libraryTags: ['react-native', 'expo', 'openai', 'typescript', 'nativewind'],
    architectureTags: ['mobile', 'ai', 'chatbot', 'real-time'],
    githubUrl: 'https://github.com/dabit3/react-native-ai'
  },
  {
    title: 'Precedent',
    description: 'An opinionated collection of components, hooks, and utilities for your Next.js project with built-in authentication.',
    bestUseCase: 'Quickly starting modern web applications with authentication, database integration, and deployment-ready configuration',
    libraryTags: ['nextjs', 'react', 'typescript', 'tailwindcss', 'next-auth', 'prisma'],
    architectureTags: ['full-stack', 'authentication', 'starter-kit'],
    githubUrl: 'https://github.com/steven-tey/precedent'
  },
  {
    title: 'Virtual Event Starter Kit',
    description: 'Run virtual events and conferences with Next.js, 100ms, and DatoCMS. Features registration, live stages, and networking.',
    bestUseCase: 'Creating online conference and event platforms with live streaming, chat, attendee management, and virtual networking',
    libraryTags: ['nextjs', 'react', '100ms', 'datocms', 'typescript'],
    architectureTags: ['event-platform', 'live-streaming', 'real-time', 'conference'],
    githubUrl: 'https://github.com/vercel/virtual-event-starter-kit'
  },
  {
    title: 'AI Chatbot',
    description: 'A full-featured, hackable Next.js AI chatbot built by Vercel with streaming chat UI, React Server Components, and Vercel KV.',
    bestUseCase: 'Building conversational AI applications with streaming responses, chat history, and persistent storage',
    libraryTags: ['nextjs', 'react', 'openai', 'vercel-ai-sdk', 'typescript', 'vercel-kv'],
    architectureTags: ['chatbot', 'ai', 'streaming', 'real-time'],
    githubUrl: 'https://github.com/vercel/ai-chatbot'
  },
  {
    title: 'Create T3 App',
    description: 'The best way to start a full-stack, typesafe Next.js app with tRPC, Tailwind CSS, TypeScript, Prisma, and NextAuth.',
    bestUseCase: 'Building type-safe full-stack applications with end-to-end type safety, authentication, and database integration',
    libraryTags: ['nextjs', 'react', 'trpc', 'prisma', 'typescript', 'tailwindcss', 'next-auth'],
    architectureTags: ['full-stack', 'type-safe', 'monolithic', 'authentication'],
    githubUrl: 'https://github.com/t3-oss/create-t3-app'
  },
  {
    title: 'Create T3 Turbo',
    description: 'A monorepo starter with Next.js, React Native, tRPC, Prisma, and TypeScript for building full-stack applications.',
    bestUseCase: 'Building cross-platform applications with shared code between web and mobile using a monorepo architecture',
    libraryTags: ['nextjs', 'react-native', 'expo', 'trpc', 'prisma', 'typescript', 'turborepo'],
    architectureTags: ['monorepo', 'cross-platform', 'full-stack', 'type-safe'],
    githubUrl: 'https://github.com/t3-oss/create-t3-turbo'
  },
  {
    title: 'Full Stack FastAPI',
    description: 'Modern full-stack web application template with FastAPI backend, PostgreSQL database, and React frontend.',
    bestUseCase: 'Building Python-based full-stack applications with REST APIs, async operations, and automatic API documentation',
    libraryTags: ['fastapi', 'python', 'react', 'postgresql', 'sqlalchemy', 'typescript'],
    architectureTags: ['full-stack', 'rest-api', 'async', 'microservices'],
    githubUrl: 'https://github.com/tiangolo/full-stack-fastapi-template'
  },
  {
    title: 'Gemini Fullstack LangGraph',
    description: 'A comprehensive template for building AI agents with LangGraph, featuring complex workflows and state management.',
    bestUseCase: 'Creating sophisticated AI agent applications with complex reasoning chains, state management, and workflow orchestration',
    libraryTags: ['langgraph', 'langchain', 'python', 'gemini', 'typescript', 'react'],
    architectureTags: ['ai-agents', 'workflow', 'state-machine', 'orchestration'],
    githubUrl: 'https://github.com/langchain-ai/langgraph-example'
  },
  {
    title: 'Next.js Boilerplate',
    description: 'A comprehensive Next.js starter with TypeScript, ESLint, Prettier, Husky, testing setup, and CI/CD pipelines.',
    bestUseCase: 'Starting enterprise-grade Next.js projects with complete tooling, testing infrastructure, and deployment pipelines',
    libraryTags: ['nextjs', 'react', 'typescript', 'jest', 'cypress', 'eslint', 'prettier'],
    architectureTags: ['enterprise', 'boilerplate', 'ci-cd', 'testing'],
    githubUrl: 'https://github.com/ixartz/Next-js-Boilerplate'
  }
];

async function reseedDatabase() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    console.log('🗑️  Clearing existing templates...');
    await sql`DELETE FROM templates`;
    
    console.log('🌱 Seeding new templates...\n');
    
    for (const template of templatesData) {
      console.log(`📦 Processing ${template.title}...`);
      
      // Create embedding text with all fields
      const textToEmbed = `Title: ${template.title}
Description: ${template.description}
Best Use Case: ${template.bestUseCase}
Library Tags: ${template.libraryTags.join(', ')}
Architecture Tags: ${template.architectureTags.join(', ')}`;
      
      try {
        // Generate embedding
        const { embedding } = await embed({
          model: openai.textEmbeddingModel('text-embedding-3-small'),
          value: textToEmbed,
        });
        
        // Insert template with embedding
        await sql`
          INSERT INTO templates (
            title,
            description,
            best_use_case,
            library_tags,
            architecture_tags,
            github_url,
            embedding,
            created_at,
            updated_at
          ) VALUES (
            ${template.title},
            ${template.description},
            ${template.bestUseCase},
            ${template.libraryTags},
            ${template.architectureTags},
            ${template.githubUrl},
            ${JSON.stringify(embedding)}::vector,
            NOW(),
            NOW()
          )
        `;
        
        console.log(`   ✓ Added ${template.title} with embedding`);
      } catch (error) {
        console.error(`   ✗ Failed to add ${template.title}:`, error);
      }
    }
    
    console.log('\n✨ Database reseeded successfully!');
    console.log(`📊 Total templates added: ${templatesData.length}`);
  } catch (error) {
    console.error('❌ Error reseeding database:', error);
  } finally {
    process.exit();
  }
}

reseedDatabase();