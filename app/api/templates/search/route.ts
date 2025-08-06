import { NextRequest, NextResponse } from 'next/server';
import { db, templates } from '@/lib/db';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { sql, ilike, or, and, eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, type, limit = 25, minSimilarity = 0.65 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const allResults: (typeof templates.$inferSelect & { 
      similarity?: number; 
      matchType?: 'vector' | 'fulltext' | 'both' 
    })[] = [];
    const seenIds = new Set<number>();

    // First, try vector search for semantic matching
    try {
      const { embedding } = await embed({
        model: openai.textEmbeddingModel('text-embedding-3-small'),
        value: query,
      });

      const vectorResults = await db.execute(
        sql`
          SELECT 
            id,
            title,
            description,
            best_use_case as "bestUseCase",
            type,
            library_tags as "libraryTags",
            architecture_tags as "architectureTags",
            github_url as "githubUrl",
            created_at as "createdAt",
            updated_at as "updatedAt",
            ROUND((1 - (embedding <=> ${JSON.stringify(embedding)}::vector))::numeric * 100, 2) as similarity
          FROM templates
          WHERE embedding IS NOT NULL
          AND (1 - (embedding <=> ${JSON.stringify(embedding)}::vector)) >= ${minSimilarity}
          ${type ? sql`AND type = ${type}` : sql``}
          ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
          LIMIT ${limit}
        `
      );

      // Add vector results with match type
      for (const result of vectorResults.rows as any[]) {
        allResults.push({
          ...result,
          matchType: 'vector'
        });
        seenIds.add(result.id);
      }

      console.log(`Vector search found ${vectorResults.rows.length} results with similarity >= ${minSimilarity * 100}%`);
    } catch (embeddingError) {
      console.error('Embedding generation failed:', embeddingError);
    }

    // Always do fulltext search to catch keyword matches
    const searchPattern = `%${query}%`;
    
    const conditions = [
      ilike(templates.title, searchPattern),
      ilike(templates.description, searchPattern),
      ilike(templates.bestUseCase, searchPattern),
      sql`array_to_string(${templates.libraryTags}, ' ') ILIKE ${searchPattern}`,
      sql`array_to_string(${templates.architectureTags}, ' ') ILIKE ${searchPattern}`
    ];

    const whereClause = type 
      ? and(or(...conditions), eq(templates.type, type))
      : or(...conditions);
    
    const fulltextResults = await db
      .select()
      .from(templates)
      .where(whereClause)
      .limit(limit);

    console.log(`Fulltext search found ${fulltextResults.length} keyword matches`);

    // Add fulltext results, marking duplicates
    for (const result of fulltextResults) {
      if (seenIds.has(result.id)) {
        // Update existing result to show it matched both
        const existingIndex = allResults.findIndex(r => r.id === result.id);
        if (existingIndex !== -1) {
          allResults[existingIndex].matchType = 'both';
        }
      } else {
        // Add new fulltext-only result
        allResults.push({
          ...result,
          similarity: 0, // No similarity score for pure fulltext matches
          matchType: 'fulltext'
        });
        seenIds.add(result.id);
      }
    }

    // Sort results: 
    // 1. First by match type (both > vector > fulltext)
    // 2. Then by similarity score for vector matches
    // 3. Then alphabetically for fulltext-only matches
    allResults.sort((a, b) => {
      // Prioritize 'both' matches
      if (a.matchType === 'both' && b.matchType !== 'both') return -1;
      if (b.matchType === 'both' && a.matchType !== 'both') return 1;
      
      // Then vector matches
      if (a.matchType === 'vector' && b.matchType === 'fulltext') return -1;
      if (b.matchType === 'vector' && a.matchType === 'fulltext') return 1;
      
      // Within same match type, sort by similarity
      if (a.similarity && b.similarity) {
        return b.similarity - a.similarity;
      }
      
      // For fulltext-only, sort alphabetically
      if (a.matchType === 'fulltext' && b.matchType === 'fulltext') {
        return a.title.localeCompare(b.title);
      }
      
      return 0;
    });

    // Limit total results
    const finalResults = allResults.slice(0, limit);

    console.log(`Returning ${finalResults.length} total results (${finalResults.filter(r => r.matchType === 'both').length} matched both, ${finalResults.filter(r => r.matchType === 'vector').length} vector-only, ${finalResults.filter(r => r.matchType === 'fulltext').length} keyword-only)`);

    return NextResponse.json(finalResults);
  } catch (error) {
    console.error('Error searching templates:', error);
    
    // Last resort: return all templates if search completely fails
    try {
      const allTemplates = await db.select().from(templates).limit(25);
      return NextResponse.json(allTemplates);
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError);
      return NextResponse.json({ error: 'Failed to search templates' }, { status: 500 });
    }
  }
}