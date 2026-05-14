ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "excerpt" TEXT;

CREATE INDEX IF NOT EXISTS "Post_createdAt_id_idx" ON "Post"("createdAt", "id");
