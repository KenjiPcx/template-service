import { NextRequest, NextResponse } from 'next/server';
import { db, templates } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, parseInt(id)));

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, bestUseCase, type, libraryTags, architectureTags, githubUrl, notes } = body;

    const textToEmbed = `${title} ${description} ${bestUseCase || ''} ${type || ''} ${libraryTags?.join(' ') || ''} ${architectureTags?.join(' ') || ''}`;
    
    const { embedding } = await embed({
      model: openai.textEmbeddingModel('text-embedding-3-small'),
      value: textToEmbed,
    });

    const [updatedTemplate] = await db
      .update(templates)
      .set({
        title,
        description,
        bestUseCase,
        type,
        libraryTags: libraryTags || [],
        architectureTags: architectureTags || [],
        githubUrl,
        notes,
        embedding: embedding as any,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, parseInt(id)))
      .returning();

    if (!updatedTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deletedTemplate] = await db
      .delete(templates)
      .where(eq(templates.id, parseInt(id)))
      .returning();

    if (!deletedTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}