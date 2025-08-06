CREATE TABLE "templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"best_use_case" text NOT NULL,
	"library_tags" text[] DEFAULT '{}' NOT NULL,
	"architecture_tags" text[] DEFAULT '{}' NOT NULL,
	"github_url" varchar(500) NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "embedding_idx" ON "templates" USING hnsw ("embedding" vector_cosine_ops);