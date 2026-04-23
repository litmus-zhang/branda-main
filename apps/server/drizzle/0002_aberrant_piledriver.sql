ALTER TABLE "workspace" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_slug_unique" UNIQUE("slug");