ALTER TABLE "templates" ADD COLUMN "type" varchar(20) DEFAULT 'starter' NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "notes" text;