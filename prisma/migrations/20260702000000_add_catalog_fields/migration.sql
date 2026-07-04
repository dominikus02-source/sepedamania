-- AlterTable: Add missing fields to Category
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "brandId" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 999;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "color" TEXT NOT NULL DEFAULT '#F5A623';

-- AlterTable: Add missing fields to Brand
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 999;
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT '';

-- AddForeignKey for Category.brandId -> Brand.id
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Category_brandId_fkey'
  ) THEN
    ALTER TABLE "Category" ADD CONSTRAINT "Category_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
