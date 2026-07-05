-- Add new enum values to OrderStatus
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'COMPLETED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'RETURN_REQUESTED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'RETURNED';

-- Add new enum values to PaymentStatus
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'REFUNDED';

-- AlterTable: Add fields to Order
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "orderNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProvider" TEXT NOT NULL DEFAULT 'MIDTRANS';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "midtransOrderId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "snapToken" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "redirectUrl" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);

-- Backfill orderNumber (window function in subquery to avoid PostgreSQL restriction)
UPDATE "Order" SET "orderNumber" = sub.seq
FROM (
  SELECT "id", CONCAT('INV-', LPAD(CAST(ROW_NUMBER() OVER (ORDER BY "createdAt") AS TEXT), 8, '0')) AS seq
  FROM "Order"
) sub
WHERE "Order"."id" = sub."id" AND "Order"."orderNumber" IS NULL;

ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL;
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderNumber_key" UNIQUE ("orderNumber");
ALTER TABLE "Order" ADD CONSTRAINT "Order_midtransOrderId_key" UNIQUE ("midtransOrderId");

-- Add index on orderNumber
CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "Order" ("orderNumber");

-- AlterTable: Add fields to OrderItem
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "productSlug" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "subtotal" DECIMAL(65,30);
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "selectedVariantName" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "selectedAttributes" JSONB;

-- Update existing OrderItem subtotal = price * qty
UPDATE "OrderItem" SET "subtotal" = CAST(CAST("price" AS NUMERIC) * "qty" AS DECIMAL(65,30)) WHERE "subtotal" IS NULL;
ALTER TABLE "OrderItem" ALTER COLUMN "subtotal" SET NOT NULL;

-- CreateTable: PaymentLog
CREATE TABLE IF NOT EXISTS "PaymentLog" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'MIDTRANS',
    "eventType" TEXT NOT NULL,
    "transactionStatus" TEXT,
    "fraudStatus" TEXT,
    "rawPayload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PaymentLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "PaymentLog_orderId_idx" ON "PaymentLog" ("orderId");
CREATE INDEX IF NOT EXISTS "PaymentLog_createdAt_idx" ON "PaymentLog" ("createdAt");

-- AlterTable: Add fields to StoreSettings
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "midtransMerchantId" TEXT;
ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "midtransNotificationAuthKey" TEXT;

-- Move xendit value to midtrans if present
UPDATE "StoreSettings" SET "midtransMerchantId" = "xenditSecretKey" WHERE "xenditSecretKey" IS NOT NULL AND "midtransMerchantId" IS NULL;
