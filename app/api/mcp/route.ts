import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import { db, templates } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

const handler = createMcpHandler(
  (server) => {
    // General search tool for discovery
    server.tool(
      'search_templates',
      'Search for templates (both starter and add-on) based on your needs',
      { 
        query: z.string().describe('Search query describing what you want to build or add'),
        limit: z.number().optional().default(10).describe('Maximum number of results to return'),
      },
      async ({ query, limit }) => {
        try {
          // Generate embedding for the query
          const { embedding } = await embed({
            model: openai.textEmbeddingModel('text-embedding-3-small'),
            value: query,
          });

          // Perform combined vector similarity and text search across all templates
          const combinedQuery = sql`
            WITH vector_results AS (
              SELECT *, 
                     1 - (embedding <=> ${JSON.stringify(embedding)}::vector) as vector_similarity
              FROM ${templates}
              WHERE embedding IS NOT NULL
            ),
            text_results AS (
              SELECT *,
                     CASE
                       WHEN LOWER(title) LIKE LOWER('%' || ${query} || '%') THEN 0.8
                       WHEN LOWER(best_use_case) LIKE LOWER('%' || ${query} || '%') THEN 0.6  
                       WHEN LOWER(description) LIKE LOWER('%' || ${query} || '%') THEN 0.4
                       ELSE 0
                     END as text_similarity
              FROM ${templates}
              WHERE 
                LOWER(title) LIKE LOWER('%' || ${query} || '%') OR
                LOWER(description) LIKE LOWER('%' || ${query} || '%') OR
                LOWER(best_use_case) LIKE LOWER('%' || ${query} || '%')
            )
            SELECT DISTINCT ON (id) *,
                   GREATEST(
                     COALESCE((SELECT vector_similarity FROM vector_results vr WHERE vr.id = t.id), 0),
                     COALESCE((SELECT text_similarity FROM text_results tr WHERE tr.id = t.id), 0)
                   ) as combined_similarity
            FROM ${templates} t
            WHERE 
              id IN (SELECT id FROM vector_results WHERE vector_similarity > 0.2)
              OR id IN (SELECT id FROM text_results)
            ORDER BY id, combined_similarity DESC
            LIMIT ${limit}
          `;

          const results = await db.execute(combinedQuery);
          
          if (!results.rows || results.rows.length === 0) {
            return {
              content: [{
                type: 'text',
                text: `No templates found matching "${query}". Try searching with different keywords.`
              }],
            };
          }

          // Sort results by combined similarity
          const sortedResults = results.rows.sort((a: any, b: any) => 
            (b.combined_similarity || 0) - (a.combined_similarity || 0)
          );

          // Format results as a concise list
          const formattedResults = sortedResults.map((template: any, index: number) => {
            const relevance = ((template.combined_similarity || 0) * 100).toFixed(0);
            const typeLabel = template.type === 'starter' ? '🚀 Starter' : '➕ Add-on';
            
            return `${index + 1}. [${typeLabel}] **${template.title}** (${relevance}% match)
   ID: ${template.id}
   Best for: ${template.best_use_case || template.bestUseCase}
   ${template.description.substring(0, 100)}${template.description.length > 100 ? '...' : ''}`;
          }).join('\n\n');

          return {
            content: [{
              type: 'text',
              text: `# Template Search Results for "${query}"

Found ${sortedResults.length} matching templates:

${formattedResults}

---
💡 **Tip:** Use \`get_template_details\` with the ID to see full details, setup instructions, and code examples for any template.`
            }],
          };
        } catch (error) {
          console.error('Error searching templates:', error);
          return {
            content: [{
              type: 'text',
              text: `Error searching templates: ${error instanceof Error ? error.message : String(error)}`
            }],
          };
        }
      },
    );

    // Detailed fetch tool for getting full template information
    server.tool(
      'get_template_details',
      'Get detailed information about a specific template including setup instructions and code examples',
      { 
        templateId: z.number().describe('The ID of the template to fetch details for'),
      },
      async ({ templateId }) => {
        try {
          // Fetch the template by ID
          const [template] = await db
            .select()
            .from(templates)
            .where(eq(templates.id, templateId))
            .limit(1);

          if (!template) {
            return {
              content: [{
                type: 'text',
                text: `Template with ID ${templateId} not found.`
              }],
            };
          }

          // Base template information
          let responseText = `# ${template.title}

**Type:** ${template.type === 'starter' ? 'Starter Template' : 'Add-on Template (Minimal Viable Example)'}
**Best Use Case:** ${template.bestUseCase}

## Description
${template.description}

## GitHub Repository
${template.githubUrl}

## Technology Stack
- **Libraries:** ${Array.isArray(template.libraryTags) ? template.libraryTags.join(', ') : 'None specified'}
- **Architecture:** ${Array.isArray(template.architectureTags) ? template.architectureTags.join(', ') : 'None specified'}

${template.notes ? `## Additional Notes\n${template.notes}\n` : ''}`;

          // Add type-specific content
          if (template.type === 'starter') {
            responseText += `
## Usage Instructions

### Quick Start with GitHub CLI
\`\`\`bash
gh repo create my-project --template ${template.githubUrl.replace('https://github.com/', '')}
cd my-project
npm install
npm run dev
\`\`\`

### Alternative: Use GitHub Template
1. Visit ${template.githubUrl}
2. Click the "Use this template" button
3. Create a new repository from the template
4. Clone your new repository and start building

### What's Included
This starter template provides a complete foundation with:
- Pre-configured project structure
- Essential dependencies installed
- Development environment ready to go
- Best practices and conventions established`;

          } else if (template.type === 'addon') {
            // For add-on templates, fetch the diff
            const repoPath = template.githubUrl.replace('https://github.com/', '');
            
            try {
              // Fetch the latest commit information
              const commitResponse = await fetch(`https://api.github.com/repos/${repoPath}/commits?per_page=1`, {
                headers: {
                  'Accept': 'application/vnd.github.v3+json',
                }
              });
              
              if (commitResponse.ok) {
                const commits = await commitResponse.json();
                const latestCommit = commits[0];
                
                // Fetch the diff for the latest commit
                const diffResponse = await fetch(`https://api.github.com/repos/${repoPath}/commits/${latestCommit.sha}`, {
                  headers: {
                    'Accept': 'application/vnd.github.v3.diff',
                  }
                });
                
                if (diffResponse.ok) {
                  const diffText = await diffResponse.text();
                  
                  responseText += `
## Latest Changes (Diff from Base Next.js)

**Commit:** ${latestCommit.commit.message}
**Author:** ${latestCommit.commit.author.name}
**Date:** ${new Date(latestCommit.commit.author.date).toLocaleDateString()}

### Code Changes
\`\`\`diff
${diffText.substring(0, 4000)}${diffText.length > 4000 ? '\n... (truncated, see full diff on GitHub)' : ''}
\`\`\``;
                }
              }
            } catch (apiError) {
              console.error('Failed to fetch diff:', apiError);
            }

            responseText += `

## Implementation Guide

This add-on template shows the minimal changes needed to add ${template.title.toLowerCase()} to an existing Next.js project.

### Steps to Integrate
1. Review the changes in the repository or diff above
2. Identify which files need to be added or modified in your project
3. Install any additional dependencies shown in package.json
4. Apply the changes incrementally, testing as you go
5. Customize the implementation to match your specific needs

### View Full Implementation
Visit the repository for complete code and detailed instructions: ${template.githubUrl}`;
          }

          return {
            content: [{
              type: 'text',
              text: responseText
            }],
          };
        } catch (error) {
          console.error('Error fetching template details:', error);
          return {
            content: [{
              type: 'text',
              text: `Error fetching template details: ${error instanceof Error ? error.message : String(error)}`
            }],
          };
        }
      },
    );
  },
  {},
  { basePath: '/api' },
);

export { handler as GET, handler as POST, handler as DELETE };