import { pgTable, serial, text, timestamp, varchar, vector, index } from 'drizzle-orm/pg-core';

export const templateTypes = ['starter', 'mve', 'addon'] as const;
export type TemplateType = typeof templateTypes[number];

export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  bestUseCase: text('best_use_case').notNull(),
  type: varchar('type', { length: 20 }).notNull().default('starter').$type<TemplateType>(),
  libraryTags: text('library_tags').array().notNull().default([]),
  architectureTags: text('architecture_tags').array().notNull().default([]),
  githubUrl: varchar('github_url', { length: 500 }).notNull(),
  notes: text('notes'), // Additional references, examples links, warnings, etc.
  embedding: vector('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  embeddingIdx: index('embedding_idx').using('hnsw', table.embedding.op('vector_cosine_ops'))
}));

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;