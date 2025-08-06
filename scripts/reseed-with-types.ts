import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

const templatesData = [
  // Starter Templates
  {
    title: 'Next.js Boilerplate',
    description: 'A comprehensive Next.js starter with TypeScript, ESLint, Prettier, Husky, testing setup, and CI/CD pipelines.',
    bestUseCase: 'Starting enterprise-grade Next.js projects with complete tooling, testing infrastructure, and deployment pipelines',
    type: 'starter',
    libraryTags: ['nextjs', 'react', 'typescript', 'jest', 'cypress', 'eslint', 'prettier'],
    architectureTags: ['enterprise', 'boilerplate', 'ci-cd', 'testing'],
    githubUrl: 'https://github.com/ixartz/Next-js-Boilerplate'
  },
  {
    title: 'Precedent',
    description: 'An opinionated collection of components, hooks, and utilities for your Next.js project with built-in authentication.',
    bestUseCase: 'Quickly starting modern web applications with authentication, database integration, and deployment-ready configuration',
    type: 'starter',
    libraryTags: ['nextjs', 'react', 'typescript', 'tailwindcss', 'next-auth', 'prisma'],
    architectureTags: ['full-stack', 'authentication', 'starter-kit'],
    githubUrl: 'https://github.com/steven-tey/precedent'
  },
  {
    title: 'Create T3 App',
    description: 'The best way to start a full-stack, typesafe Next.js app with tRPC, Tailwind CSS, TypeScript, Prisma, and NextAuth.',
    bestUseCase: 'Building type-safe full-stack applications with end-to-end type safety, authentication, and database integration',
    type: 'starter',
    libraryTags: ['nextjs', 'react', 'trpc', 'prisma', 'typescript', 'tailwindcss', 'next-auth'],
    architectureTags: ['full-stack', 'type-safe', 'monolithic', 'authentication'],
    githubUrl: 'https://github.com/t3-oss/create-t3-app'
  },
  {
    title: 'Full Stack FastAPI',
    description: 'Modern full-stack web application template with FastAPI backend, PostgreSQL database, and React frontend.',
    bestUseCase: 'Building Python-based full-stack applications with REST APIs, async operations, and automatic API documentation',
    type: 'starter',
    libraryTags: ['fastapi', 'python', 'react', 'postgresql', 'sqlalchemy', 'typescript'],
    architectureTags: ['full-stack', 'rest-api', 'async', 'microservices'],
    githubUrl: 'https://github.com/tiangolo/full-stack-fastapi-template'
  },
  
  // MVE (Minimal Viable Example) Templates
  {
    title: 'AI Chatbot',
    description: 'A full-featured, hackable Next.js AI chatbot built by Vercel with streaming chat UI, React Server Components, and Vercel KV.',
    bestUseCase: 'Building conversational AI applications with streaming responses, chat history, and persistent storage',
    type: 'mve',
    libraryTags: ['nextjs', 'react', 'openai', 'vercel-ai-sdk', 'typescript', 'vercel-kv'],
    architectureTags: ['chatbot', 'ai', 'streaming', 'real-time'],
    githubUrl: 'https://github.com/vercel/ai-chatbot'
  },
  {
    title: 'React Native AI',
    description: 'Full stack React Native AI chatbot and image generation app with streaming responses, speech-to-text, and more.',
    bestUseCase: 'Developing mobile AI applications with chat interfaces, image generation, voice assistants, and real-time AI interactions',
    type: 'mve',
    libraryTags: ['react-native', 'expo', 'openai', 'typescript', 'nativewind'],
    architectureTags: ['mobile', 'ai', 'chatbot', 'real-time'],
    githubUrl: 'https://github.com/dabit3/react-native-ai'
  },
  {
    title: 'Gemini Fullstack LangGraph',
    description: 'A comprehensive template for building AI agents with LangGraph, featuring complex workflows and state management.',
    bestUseCase: 'Creating sophisticated AI agent applications with complex reasoning chains, state management, and workflow orchestration',
    type: 'mve',
    libraryTags: ['langgraph', 'langchain', 'python', 'gemini', 'typescript', 'react'],
    architectureTags: ['ai-agents', 'workflow', 'state-machine', 'orchestration'],
    githubUrl: 'https://github.com/langchain-ai/langgraph-example'
  },
  {
    title: 'Virtual Event Starter Kit',
    description: 'Run virtual events and conferences with Next.js, 100ms, and DatoCMS. Features registration, live stages, and networking.',
    bestUseCase: 'Creating online conference and event platforms with live streaming, chat, attendee management, and virtual networking',
    type: 'mve',
    libraryTags: ['nextjs', 'react', '100ms', 'datocms', 'typescript'],
    architectureTags: ['event-platform', 'live-streaming', 'real-time', 'conference'],
    githubUrl: 'https://github.com/vercel/virtual-event-starter-kit'
  },
  
  // Add-on Templates (Feature additions)
  {
    title: 'Supabase SaaS',
    description: 'The fastest way to build a SaaS with React, Next.js, Supabase, and Stripe. Includes authentication, subscriptions, and team management.',
    bestUseCase: 'Adding multi-tenant SaaS capabilities with authentication, subscription billing, team workspaces, and admin dashboards to existing apps',
    type: 'addon',
    libraryTags: ['nextjs', 'react', 'supabase', 'stripe', 'typescript', 'tailwindcss'],
    architectureTags: ['saas', 'multi-tenant', 'serverless', 'subscription'],
    githubUrl: 'https://github.com/vercel/nextjs-subscription-payments'
  },
  {
    title: 'Next.js Commerce',
    description: 'A Next.js 14 and App Router-ready ecommerce template featuring server components, dynamic OG images, and CSS variables.',
    bestUseCase: 'Adding e-commerce functionality with product catalogs, shopping carts, payment processing, and inventory management to applications',
    type: 'addon',
    libraryTags: ['nextjs', 'react', 'typescript', 'tailwindcss', 'vercel-commerce'],
    architectureTags: ['e-commerce', 'headless', 'jamstack', 'serverless'],
    githubUrl: 'https://github.com/vercel/commerce'
  },
  {
    title: 'Platforms Starter Kit',
    description: 'A template for building multi-tenant applications with custom domain support using Next.js, Vercel, and PlanetScale.',
    bestUseCase: 'Adding multi-tenant platform capabilities with custom domains, user dashboards, admin panels, and white-label features',
    type: 'addon',
    libraryTags: ['nextjs', 'react', 'planetscale', 'prisma', 'typescript', 'tailwindcss'],
    architectureTags: ['multi-tenant', 'platform', 'white-label', 'custom-domains'],
    githubUrl: 'https://github.com/vercel/platforms'
  },
  {
    title: 'Create T3 Turbo',
    description: 'A monorepo starter with Next.js, React Native, tRPC, Prisma, and TypeScript for building full-stack applications.',
    bestUseCase: 'Adding cross-platform capabilities with shared code between web and mobile using a monorepo architecture',
    type: 'addon',
    libraryTags: ['nextjs', 'react-native', 'expo', 'trpc', 'prisma', 'typescript', 'turborepo'],
    architectureTags: ['monorepo', 'cross-platform', 'full-stack', 'type-safe'],
    githubUrl: 'https://github.com/t3-oss/create-t3-turbo'
  },
  
  // Additional MVE examples
  {
    title: 'Next.js Auth Example',
    description: 'Minimal example showing authentication patterns with NextAuth.js including OAuth providers and database sessions.',
    bestUseCase: 'Learning and implementing authentication flows with multiple providers, session management, and protected routes',
    type: 'mve',
    libraryTags: ['nextjs', 'next-auth', 'typescript', 'prisma', 'tailwindcss'],
    architectureTags: ['authentication', 'oauth', 'session-management'],
    githubUrl: 'https://github.com/nextauthjs/next-auth-example'
  },
  {
    title: 'Realtime Chat Example',
    description: 'Simple real-time chat application using WebSockets with Next.js and Socket.io for instant messaging.',
    bestUseCase: 'Building real-time communication features like chat, notifications, or collaborative editing',
    type: 'mve',
    libraryTags: ['nextjs', 'socket.io', 'react', 'typescript'],
    architectureTags: ['real-time', 'websocket', 'chat', 'messaging'],
    githubUrl: 'https://github.com/vercel/next.js/tree/canary/examples/with-socket-io'
  },
  {
    title: 'File Upload Example',
    description: 'Demonstrates file upload patterns with Next.js including drag-and-drop, progress tracking, and cloud storage.',
    bestUseCase: 'Implementing file upload functionality with progress tracking, validation, and cloud storage integration',
    type: 'mve',
    libraryTags: ['nextjs', 'react', 'aws-s3', 'uploadthing', 'typescript'],
    architectureTags: ['file-upload', 'cloud-storage', 'media-handling'],
    githubUrl: 'https://github.com/uploadthing/uploadthing/tree/main/examples/minimal'
  }
];

async function reseedWithTypes() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    // First add the type column if it doesn't exist
    console.log('🔧 Ensuring type column exists...');
    await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'starter'`;
    
    console.log('🗑️  Clearing existing templates...');
    await sql`DELETE FROM templates`;
    
    console.log('🌱 Seeding templates with types...\n');
    
    let starterCount = 0;
    let mveCount = 0;
    let addonCount = 0;
    
    for (const template of templatesData) {
      console.log(`📦 Processing ${template.title} (${template.type.toUpperCase()})...`);
      
      // Count types
      if (template.type === 'starter') starterCount++;
      else if (template.type === 'mve') mveCount++;
      else if (template.type === 'addon') addonCount++;
      
      // Create embedding text with all fields including type
      const textToEmbed = `Title: ${template.title}
Description: ${template.description}
Best Use Case: ${template.bestUseCase}
Type: ${template.type}
Library Tags: ${template.libraryTags.join(', ')}
Architecture Tags: ${template.architectureTags.join(', ')}`;
      
      try {
        // Generate embedding
        const { embedding } = await embed({
          model: openai.textEmbeddingModel('text-embedding-3-small'),
          value: textToEmbed,
        });
        
        // Insert template with embedding and type
        await sql`
          INSERT INTO templates (
            title,
            description,
            best_use_case,
            type,
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
            ${template.type},
            ${template.libraryTags},
            ${template.architectureTags},
            ${template.githubUrl},
            ${JSON.stringify(embedding)}::vector,
            NOW(),
            NOW()
          )
        `;
        
        console.log(`   ✓ Added ${template.title}`);
      } catch (error) {
        console.error(`   ✗ Failed to add ${template.title}:`, error);
      }
    }
    
    console.log('\n✨ Database reseeded successfully!');
    console.log(`📊 Templates added by type:`);
    console.log(`   • Starter templates: ${starterCount}`);
    console.log(`   • MVE templates: ${mveCount}`);
    console.log(`   • Add-on templates: ${addonCount}`);
    console.log(`   • Total: ${templatesData.length}`);
  } catch (error) {
    console.error('❌ Error reseeding database:', error);
  } finally {
    process.exit();
  }
}

reseedWithTypes();