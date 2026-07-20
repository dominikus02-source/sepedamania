// Server-only: imports the Prisma client.
import { prisma } from '@/lib/prisma';

/** Marks a StockLog row as belonging to an order's paid-settlement pass. */
const PAID_REASON_PREFIX = 'SALE';

export function saleReason(orderNumber: string): string {
  return `${PAID_REASON_PREFIX} ${orderNumber}`;
}

/**
 * Applies the stock movement for an order once its payment is confirmed.
 *
 * Stock is deducted here rather than at checkout so an abandoned or expired
 * order never holds inventory hostage — there is no release path to forget.
 * The trade-off is a small oversell window between order creation and payment.
 *
 * Idempotent: re-running for the same order is a no-op, so a webhook redelivery
 * cannot double-deduct.
 */
export async function applyStockForPaidOrder(orderId: string): Promise<{
  applied: boolean;
  reason: string;
}> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      orderNumber: true,
      items: { select: { productId: true, variantId: true, qty: true } },
    },
  });

  if (!order) return { applied: false, reason: 'order not found' };

  const reason = saleReason(order.orderNumber);

  const already = await prisma.stockLog.findFirst({ where: { reason } });
  if (already) return { applied: false, reason: 'already applied' };

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (!item.productId) continue;

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.qty },
          sold: { increment: item.qty },
        },
      });

      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.qty } },
        });
      }

      await tx.stockLog.create({
        data: { productId: item.productId, change: -item.qty, reason },
      });
    }
  });

  return { applied: true, reason };
}

/**
 * Restores stock for an order that was refunded or returned after payment.
 * Idempotent in the same way as the sale pass.
 */
export async function restoreStockForOrder(
  orderId: string,
  note = 'RETURN',
): Promise<{ applied: boolean }> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      orderNumber: true,
      items: { select: { productId: true, variantId: true, qty: true } },
    },
  });

  if (!order) return { applied: false };

  const saleApplied = await prisma.stockLog.findFirst({
    where: { reason: saleReason(order.orderNumber) },
  });
  // Nothing was ever deducted, so there is nothing to give back.
  if (!saleApplied) return { applied: false };

  const reason = `${note} ${order.orderNumber}`;
  const already = await prisma.stockLog.findFirst({ where: { reason } });
  if (already) return { applied: false };

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (!item.productId) continue;

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: item.qty },
          sold: { decrement: item.qty },
        },
      });

      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.qty } },
        });
      }

      await tx.stockLog.create({
        data: { productId: item.productId, change: item.qty, reason },
      });
    }
  });

  return { applied: true };
}

/** Manual admin adjustment (restock, shrinkage, correction). */
export async function adjustStock(
  productId: string,
  change: number,
  reason: string,
): Promise<{ stock: number }> {
  if (!Number.isInteger(change) || change === 0) {
    throw new Error('Perubahan stok harus bilangan bulat bukan nol');
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });
  if (!product) throw new Error('Produk tidak ditemukan');

  if (product.stock + change < 0) {
    throw new Error(`Stok tidak boleh negatif (tersedia ${product.stock})`);
  }

  const [updated] = await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: change } },
      select: { stock: true },
    }),
    prisma.stockLog.create({
      data: { productId, change, reason: reason || 'Penyesuaian manual' },
    }),
  ]);

  return { stock: updated.stock };
}
