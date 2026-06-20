-- Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS "Product_brandId_idx" ON "Product" ("brandId");
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem" ("orderId");
CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem" ("productId");
