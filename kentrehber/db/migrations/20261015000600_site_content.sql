CREATE TABLE "site_contents" (
  "vertical_slug" TEXT NOT NULL,
  "content" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "updated_by" TEXT,
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "site_contents_pkey" PRIMARY KEY ("vertical_slug")
);
