-- Adds video URLs to products. Additive and backfilled with an empty array,
-- so existing rows and running code are unaffected.
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "videoUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
