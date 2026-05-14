CREATE TABLE IF NOT EXISTS "UploadAsset" (
  "id" SERIAL PRIMARY KEY,
  "url" TEXT NOT NULL UNIQUE,
  "path" TEXT NOT NULL UNIQUE,
  "kind" TEXT NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "sizeBytes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastReferencedAt" TIMESTAMP(3)
);

CREATE INDEX IF NOT EXISTS "UploadAsset_createdAt_idx" ON "UploadAsset"("createdAt");
CREATE INDEX IF NOT EXISTS "UploadAsset_lastReferencedAt_idx" ON "UploadAsset"("lastReferencedAt");
