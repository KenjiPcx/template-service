import { NextRequest, NextResponse } from 'next/server';
import { db, templates } from '@/lib/db';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function GET() {
  try {
    const allTemplates = await db.select().from(templates);
    return NextResponse.json(allTemplates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, bestUseCase, type = 'starter', libraryTags, architectureTags, githubUrl, notes } = body;

    if (!title || !description || !bestUseCase || !githubUrl) {
      return NextResponse.json(
        { error: 'Title, description, best use case, and GitHub URL are required' },
        { status: 400 }
      );
    }

    // Create embedding with bestUseCase as the primary focus
    const textToEmbed = `Title: ${title}
      Description: ${description}
      Best Use Case: ${bestUseCase}
      Type: ${type}
      Library Tags: ${(libraryTags && libraryTags.length > 0) ? libraryTags.join(', ') : ''}
      Architecture Tags: ${(architectureTags && architectureTags.length > 0) ? architectureTags.join(', ') : ''}
      GitHub URL: ${githubUrl}`;
    
    try {
      const { embedding } = await embed({
        model: openai.textEmbeddingModel('text-embedding-3-small'),
        value: textToEmbed,
      });
      
      const [newTemplate] = await db.insert(templates).values({
        title,
        description,
        bestUseCase,
        type,
        libraryTags: libraryTags || [],
        architectureTags: architectureTags || [],
        githubUrl,
        notes,
        embedding: embedding as any,
      }).returning();
      
      return NextResponse.json(newTemplate, { status: 201 });
    } catch (embeddingError) {
      console.error('Failed to generate embedding, saving template without it:', embeddingError);
      return NextResponse.json(
        { error: 'Failed to generate embedding for template' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}