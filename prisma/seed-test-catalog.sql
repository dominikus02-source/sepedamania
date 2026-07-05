-- Create test category
INSERT INTO "Category" ("id", "name", "slug", "description", "isActive", "sortOrder", "createdAt")
VALUES ('test-cat-001', 'Test Category', 'test-category', 'Kategori untuk QA Midtrans sandbox', true, 999, NOW())
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "isActive" = true;

-- Create test brand
INSERT INTO "Brand" ("id", "name", "slug", "description", "isActive", "sortOrder", "createdAt")
VALUES ('test-brand-001', 'Test Brand', 'test-brand', 'Brand untuk QA Midtrans sandbox', true, 999, NOW())
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "isActive" = true;

-- Create test product
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "price", "stock", "images", "categoryId", "brandId", "weight", "isActive", "createdAt", "updatedAt")
VALUES ('test-product-001', 'Test Midtrans Bike', 'test-midtrans-bike', 'TEST-MIDTRANS-001', 'Produk test untuk QA Midtrans sandbox.', 100000, 999, ARRAY['/images/placeholder.svg'], 'test-cat-001', 'test-brand-001', 1000, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "sku" = EXCLUDED."sku",
  "description" = EXCLUDED."description",
  "price" = EXCLUDED."price",
  "stock" = EXCLUDED."stock",
  "images" = EXCLUDED."images",
  "categoryId" = EXCLUDED."categoryId",
  "brandId" = EXCLUDED."brandId",
  "weight" = EXCLUDED."weight",
  "isActive" = true,
  "updatedAt" = NOW();
