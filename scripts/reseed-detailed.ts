import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

const templatesData = [
  // Starter Templates - For AI to use when starting new projects from scratch
  {
    title: 'Next.js Boilerplate',
    description: 'A comprehensive Next.js starter with TypeScript, ESLint, Prettier, Husky, testing setup, and CI/CD pipelines.',
    bestUseCase: 'Use this when: Starting a new production-grade web application that needs professional tooling, code quality enforcement, automated testing, and deployment pipelines already configured. Perfect for enterprise projects or when code quality and maintainability are critical from day one.',
    type: 'starter',
    libraryTags: ['nextjs', 'react', 'typescript', 'jest', 'cypress', 'eslint', 'prettier'],
    architectureTags: ['enterprise', 'boilerplate', 'ci-cd', 'testing'],
    githubUrl: 'https://github.com/ixartz/Next-js-Boilerplate'
  },
  {
    title: 'Precedent',
    description: 'An opinionated collection of components, hooks, and utilities for your Next.js project with built-in authentication.',
    bestUseCase: 'Use this when: Building a SaaS product or web app that needs user authentication, a marketing landing page, and database connectivity out of the box. Ideal for MVPs that need to launch quickly with professional polish.',
    type: 'starter',
    libraryTags: ['nextjs', 'react', 'typescript', 'tailwindcss', 'next-auth', 'prisma'],
    architectureTags: ['full-stack', 'authentication', 'starter-kit'],
    githubUrl: 'https://github.com/steven-tey/precedent'
  },
  {
    title: 'Create T3 App',
    description: 'The best way to start a full-stack, typesafe Next.js app with tRPC, Tailwind CSS, TypeScript, Prisma, and NextAuth.',
    bestUseCase: 'Use this when: You need end-to-end type safety between frontend and backend, want to avoid writing API boilerplate, and prioritize developer experience. Perfect for teams that value type safety and want to move fast without sacrificing code quality.',
    type: 'starter',
    libraryTags: ['nextjs', 'react', 'trpc', 'prisma', 'typescript', 'tailwindcss', 'next-auth'],
    architectureTags: ['full-stack', 'type-safe', 'monolithic', 'authentication'],
    githubUrl: 'https://github.com/t3-oss/create-t3-app'
  },
  {
    title: 'Full Stack FastAPI',
    description: 'Modern full-stack web application template with FastAPI backend, PostgreSQL database, and React frontend.',
    bestUseCase: 'Use this when: Building Python-based applications that need high-performance async APIs, automatic API documentation, or when your team has Python expertise. Excellent for data science applications, ML model serving, or when you need Python ecosystem libraries.',
    type: 'starter',
    libraryTags: ['fastapi', 'python', 'react', 'postgresql', 'sqlalchemy', 'typescript'],
    architectureTags: ['full-stack', 'rest-api', 'async', 'microservices'],
    githubUrl: 'https://github.com/tiangolo/full-stack-fastapi-template'
  },
  {
    title: 'Minimal Next.js Starter',
    description: 'Bare minimum Next.js setup with TypeScript and Tailwind CSS for maximum flexibility.',
    bestUseCase: 'Use this when: You want complete control over your architecture and dependencies, need to integrate with existing systems, or when other starters have too many opinions. Best for experienced developers who know exactly what they need.',
    type: 'starter',
    libraryTags: ['nextjs', 'react', 'typescript', 'tailwindcss'],
    architectureTags: ['minimal', 'flexible', 'customizable'],
    githubUrl: 'https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss'
  },
  
  // MVE (Minimal Viable Example) Templates - For AI to learn from and understand patterns
  {
    title: 'AI Chatbot',
    description: 'A full-featured, hackable Next.js AI chatbot built by Vercel with streaming chat UI, React Server Components, and Vercel KV.',
    bestUseCase: 'Use this when: Learning how to implement AI chat interfaces with streaming responses, managing conversation history, or understanding React Server Components with AI. Study this to understand production patterns for AI chat applications.',
    type: 'mve',
    libraryTags: ['nextjs', 'react', 'openai', 'vercel-ai-sdk', 'typescript', 'vercel-kv'],
    architectureTags: ['chatbot', 'ai', 'streaming', 'real-time'],
    githubUrl: 'https://github.com/vercel/ai-chatbot'
  },
  {
    title: 'React Native AI',
    description: 'Full stack React Native AI chatbot and image generation app with streaming responses, speech-to-text, and more.',
    bestUseCase: 'Use this when: Building mobile AI applications or learning mobile AI patterns. Shows how to implement chat interfaces, image generation, voice input, and streaming on mobile devices. Reference for React Native + AI integration.',
    type: 'mve',
    libraryTags: ['react-native', 'expo', 'openai', 'typescript', 'nativewind'],
    architectureTags: ['mobile', 'ai', 'chatbot', 'real-time'],
    githubUrl: 'https://github.com/dabit3/react-native-ai'
  },
  {
    title: 'Gemini Fullstack LangGraph',
    description: 'A comprehensive template for building AI agents with LangGraph, featuring complex workflows and state management.',
    bestUseCase: 'Use this when: Creating AI agents that need complex reasoning chains, multi-step workflows, or state machines. Learn from this to understand agent architectures, tool use patterns, and how to orchestrate complex AI behaviors.',
    type: 'mve',
    libraryTags: ['langgraph', 'langchain', 'python', 'gemini', 'typescript', 'react'],
    architectureTags: ['ai-agents', 'workflow', 'state-machine', 'orchestration'],
    githubUrl: 'https://github.com/langchain-ai/langgraph-example'
  },
  {
    title: 'Virtual Event Starter Kit',
    description: 'Run virtual events and conferences with Next.js, 100ms, and DatoCMS. Features registration, live stages, and networking.',
    bestUseCase: 'Use this when: Building online events, webinars, or virtual conference platforms. Learn how to implement live streaming, real-time chat, attendee management, and virtual networking features. Great reference for WebRTC integration.',
    type: 'mve',
    libraryTags: ['nextjs', 'react', '100ms', 'datocms', 'typescript'],
    architectureTags: ['event-platform', 'live-streaming', 'real-time', 'conference'],
    githubUrl: 'https://github.com/vercel/virtual-event-starter-kit'
  },
  {
    title: 'Next.js Auth Example',
    description: 'Minimal example showing authentication patterns with NextAuth.js including OAuth providers and database sessions.',
    bestUseCase: 'Use this when: Learning authentication patterns, implementing social login (Google, GitHub, etc.), or understanding session management. Reference this to see how to protect routes, handle user sessions, and implement various auth strategies.',
    type: 'mve',
    libraryTags: ['nextjs', 'next-auth', 'typescript', 'prisma', 'tailwindcss'],
    architectureTags: ['authentication', 'oauth', 'session-management'],
    githubUrl: 'https://github.com/nextauthjs/next-auth-example'
  },
  {
    title: 'Realtime Chat Example',
    description: 'Simple real-time chat application using WebSockets with Next.js and Socket.io for instant messaging.',
    bestUseCase: 'Use this when: Adding real-time features like chat, notifications, or live updates to your app. Learn WebSocket patterns, room management, and how to handle connection states. Minimal example to understand real-time communication.',
    type: 'mve',
    libraryTags: ['nextjs', 'socket.io', 'react', 'typescript'],
    architectureTags: ['real-time', 'websocket', 'chat', 'messaging'],
    githubUrl: 'https://github.com/vercel/next.js/tree/canary/examples/with-socket-io'
  },
  {
    title: 'File Upload Example',
    description: 'Demonstrates file upload patterns with Next.js including drag-and-drop, progress tracking, and cloud storage.',
    bestUseCase: 'Use this when: Implementing file uploads, image handling, or document management. Learn patterns for drag-and-drop, upload progress, file validation, and cloud storage integration (S3, Cloudinary). Reference for handling media in web apps.',
    type: 'mve',
    libraryTags: ['nextjs', 'react', 'aws-s3', 'uploadthing', 'typescript'],
    architectureTags: ['file-upload', 'cloud-storage', 'media-handling'],
    githubUrl: 'https://github.com/uploadthing/uploadthing/tree/main/examples/minimal'
  },
  {
    title: 'Server Actions Example',
    description: 'Demonstrates Next.js Server Actions for form handling and data mutations without API routes.',
    bestUseCase: 'Use this when: Learning the new Server Actions pattern in Next.js 14+, simplifying form submissions, or eliminating API route boilerplate. Shows progressive enhancement and how to handle forms without client-side JavaScript.',
    type: 'mve',
    libraryTags: ['nextjs', 'react', 'typescript', 'server-actions'],
    architectureTags: ['server-components', 'forms', 'progressive-enhancement'],
    githubUrl: 'https://github.com/vercel/next.js/tree/canary/examples/next-forms'
  },
  {
    title: 'Stripe Integration Example',
    description: 'Minimal example of Stripe payment integration with subscription handling and webhook processing.',
    bestUseCase: 'Use this when: Adding payment processing, subscription management, or learning Stripe integration patterns. Understand webhook handling, payment intent flows, and subscription lifecycle management.',
    type: 'mve',
    libraryTags: ['nextjs', 'stripe', 'typescript', 'react'],
    architectureTags: ['payments', 'subscriptions', 'webhooks', 'billing'],
    githubUrl: 'https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript'
  },
  
  // Add-on Templates - For AI to integrate features into existing projects
  {
    title: 'Supabase SaaS',
    description: 'The fastest way to build a SaaS with React, Next.js, Supabase, and Stripe. Includes authentication, subscriptions, and team management.',
    bestUseCase: 'Use this when: Adding complete SaaS infrastructure to an existing app - multi-tenancy, team workspaces, subscription billing, admin panels. Extract patterns for user organizations, permission systems, and billing integration. Not a starter, but a reference for SaaS features.',
    type: 'addon',
    libraryTags: ['nextjs', 'react', 'supabase', 'stripe', 'typescript', 'tailwindcss'],
    architectureTags: ['saas', 'multi-tenant', 'serverless', 'subscription'],
    githubUrl: 'https://github.com/vercel/nextjs-subscription-payments'
  },
  {
    title: 'Next.js Commerce',
    description: 'A Next.js 14 and App Router-ready ecommerce template featuring server components, dynamic OG images, and CSS variables.',
    bestUseCase: 'Use this when: Adding e-commerce capabilities to an existing site - product catalog, cart, checkout, inventory. Study this for commerce patterns like cart management, payment flows, and product variants. Extract components and logic as needed.',
    type: 'addon',
    libraryTags: ['nextjs', 'react', 'typescript', 'tailwindcss', 'vercel-commerce'],
    architectureTags: ['e-commerce', 'headless', 'jamstack', 'serverless'],
    githubUrl: 'https://github.com/vercel/commerce'
  },
  {
    title: 'Platforms Starter Kit',
    description: 'A template for building multi-tenant applications with custom domain support using Next.js, Vercel, and PlanetScale.',
    bestUseCase: 'Use this when: Adding multi-tenant capabilities with custom domains (like Substack or Hashnode). Learn patterns for domain routing, tenant isolation, and white-label features. Extract the middleware and routing logic for existing apps.',
    type: 'addon',
    libraryTags: ['nextjs', 'react', 'planetscale', 'prisma', 'typescript', 'tailwindcss'],
    architectureTags: ['multi-tenant', 'platform', 'white-label', 'custom-domains'],
    githubUrl: 'https://github.com/vercel/platforms'
  },
  {
    title: 'Create T3 Turbo',
    description: 'A monorepo starter with Next.js, React Native, tRPC, Prisma, and TypeScript for building full-stack applications.',
    bestUseCase: 'Use this when: Converting a single app into a monorepo, adding mobile app to existing web app, or sharing code between multiple platforms. Learn Turborepo patterns, shared packages, and cross-platform code reuse strategies.',
    type: 'addon',
    libraryTags: ['nextjs', 'react-native', 'expo', 'trpc', 'prisma', 'typescript', 'turborepo'],
    architectureTags: ['monorepo', 'cross-platform', 'full-stack', 'type-safe'],
    githubUrl: 'https://github.com/t3-oss/create-t3-turbo'
  },
  {
    title: 'Admin Dashboard Template',
    description: 'Feature-rich admin dashboard with charts, tables, forms, and data visualization components.',
    bestUseCase: 'Use this when: Adding admin interfaces, analytics dashboards, or data management UIs to existing apps. Extract components for charts, data tables, filters, and admin layouts. Reference for building internal tools and back-office systems.',
    type: 'addon',
    libraryTags: ['nextjs', 'react', 'recharts', 'react-table', 'typescript', 'tailwindcss'],
    architectureTags: ['admin', 'dashboard', 'analytics', 'data-visualization'],
    githubUrl: 'https://github.com/horizon-ui/horizon-tailwind-react'
  },
  {
    title: 'Email Template System',
    description: 'React Email components and sending infrastructure with preview and testing capabilities.',
    bestUseCase: 'Use this when: Adding transactional emails, email templates, or notification systems. Learn how to create responsive email templates with React, preview them, and integrate with email services (SendGrid, Resend, etc.).',
    type: 'addon',
    libraryTags: ['react-email', 'typescript', 'resend', 'sendgrid', 'postmark'],
    architectureTags: ['email', 'notifications', 'transactional', 'templates'],
    githubUrl: 'https://github.com/resendlabs/react-email-starter'
  }
];

async function reseedDetailed() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    console.log('🗑️  Clearing existing templates...');
    await sql`DELETE FROM templates`;
    
    console.log('🌱 Seeding templates with detailed use cases...\n');
    
    let starterCount = 0;
    let mveCount = 0;
    let addonCount = 0;
    
    for (const template of templatesData) {
      console.log(`📦 Processing ${template.title} (${template.type.toUpperCase()})...`);
      
      // Count types
      if (template.type === 'starter') starterCount++;
      else if (template.type === 'mve') mveCount++;
      else if (template.type === 'addon') addonCount++;
      
      // Create comprehensive embedding text
      const textToEmbed = `Title: ${template.title}
Description: ${template.description}
Best Use Case: ${template.bestUseCase}
Type: ${template.type}
When to use: ${template.type === 'starter' ? 'Starting new project from scratch' : template.type === 'mve' ? 'Learning or understanding a pattern' : 'Adding feature to existing project'}
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
        
        console.log(`   ✓ Added with detailed use case`);
      } catch (error) {
        console.error(`   ✗ Failed to add ${template.title}:`, error);
      }
    }
    
    console.log('\n✨ Database reseeded with detailed use cases!');
    console.log(`📊 Templates by type:`);
    console.log(`   • Starter templates: ${starterCount} (for starting new projects)`);
    console.log(`   • MVE templates: ${mveCount} (for learning patterns)`);
    console.log(`   • Add-on templates: ${addonCount} (for adding features)`);
    console.log(`   • Total: ${templatesData.length}`);
    
    console.log('\n💡 AI Usage Guide:');
    console.log('   • User wants to start new project → Search type:"starter"');
    console.log('   • User needs to understand how something works → Search type:"mve"');
    console.log('   • User wants to add feature to existing app → Search type:"addon"');
  } catch (error) {
    console.error('❌ Error reseeding database:', error);
  } finally {
    process.exit();
  }
}

reseedDetailed();