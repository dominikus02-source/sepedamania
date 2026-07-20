import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { applyStockForPaidOrder } from '@/lib/stock';
import { notifyOrder } from '@/lib/order-notifications';
import { auth } from '@/lib/auth';
import { validateOrigin } from '@/lib/csrf';

const patchOrderSchema = z.object({
  paymentStatus: z.enum(['UNPAID', 'PAID', 'EXPIRED', 'FAILED', 'CANCELLED', 'REFUNDED']).optional(),
  status: z.enum(['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED']).optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

const validStatusTransitions: Record<string, string[]> = {
  PENDING_PAYMENT: ['PROCESSING', 'CANCELLED'],
  PAID: ['PROCESSING'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: ['RETURN_REQUESTED'],
  CANCELLED: [],
  RETURN_REQUESTED: ['RETURNED'],
  RETURNED: ['REFUNDED'],
  REFUNDED: [],
};

const validPaymentTransitions: Record<string, string[]> = {
  UNPAID: ['PAID', 'EXPIRED', 'CANCELLED'],
  PAID: ['REFUNDED'],
  EXPIRED: [],
  FAILED: [],
  CANCELLED: [],
  REFUNDED: [],
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id },
        { orderNumber: id },
      ],
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
  }

  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === 'ADMIN';
  const isOwner = order.userId && userId && order.userId === userId;

  if (!isAdmin && !isOwner && order.guestEmail) {
    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      discount: Number(order.discount),
      total: Number(order.total),
      courier: order.courier,
      courierService: order.courierService,
      trackingNumber: order.trackingNumber,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      items: order.items.map((i) => ({
        id: i.id,
        name: i.name,
        price: Number(i.price),
        qty: i.qty,
        image: i.image,
        subtotal: Number(i.subtotal),
        selectedVariantName: i.selectedVariantName,
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      paidAt: order.paidAt?.toISOString() || null,
      cancelledAt: order.cancelledAt?.toISOString() || null,
      voucherCode: order.voucherCode,
    });
  }

  return NextResponse.json({
    id: order.id,
    orderNumber: order.orderNumber,
    userId: order.userId,
    guestName: order.guestName,
    guestEmail: order.guestEmail,
    guestPhone: order.guestPhone,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    paymentProvider: order.paymentProvider,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    discount: Number(order.discount),
    total: Number(order.total),
    courier: order.courier,
    courierService: order.courierService,
    trackingNumber: order.trackingNumber,
    shippingAddress: order.shippingAddress,
    snapToken: order.snapToken,
    redirectUrl: order.redirectUrl,
    voucherCode: order.voucherCode,
    notes: order.notes,
    items: order.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      variantId: i.variantId,
      name: i.name,
      productSlug: i.productSlug,
      price: Number(i.price),
      qty: i.qty,
      subtotal: Number(i.subtotal),
      image: i.image,
      selectedVariantName: i.selectedVariantName,
      selectedAttributes: i.selectedAttributes,
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    paidAt: order.paidAt?.toISOString() || null,
    cancelledAt: order.cancelledAt?.toISOString() || null,
    completedAt: order.completedAt?.toISOString() || null,
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id },
        { orderNumber: id },
      ],
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
  }

  const userId = session.user.id;
  const userRole = session.user.role;
  const isOwner = order.userId === userId;
  const isAdmin = userRole === 'ADMIN';

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: z.infer<typeof patchOrderSchema>;
  try {
    const parsed = patchOrderSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.issues },
        { status: 400 },
      );
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};

  if (body.status && body.status !== order.status) {
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admin can change order status' },
        { status: 403 },
      );
    }
    const allowedNext = validStatusTransitions[order.status];
    if (!allowedNext || !allowedNext.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${order.status} to ${body.status}` },
        { status: 400 },
      );
    }
    updateData.status = body.status;
  }

  if (body.paymentStatus && body.paymentStatus !== order.paymentStatus) {
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admin can change payment status' },
        { status: 403 },
      );
    }
    const allowedNext = validPaymentTransitions[order.paymentStatus];
    if (!allowedNext || !allowedNext.includes(body.paymentStatus)) {
      return NextResponse.json(
        { error: `Invalid payment transition from ${order.paymentStatus} to ${body.paymentStatus}` },
        { status: 400 },
      );
    }
    updateData.paymentStatus = body.paymentStatus;
  }

  if (body.trackingNumber !== undefined) {
    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admin can set tracking number' }, { status: 403 });
    }
    updateData.trackingNumber = body.trackingNumber;
  }

  if (body.notes !== undefined) {
    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admin can set notes' }, { status: 403 });
    }
    updateData.notes = body.notes;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: updateData,
    include: { items: true },
  });

  // An admin marking an order paid by hand must move stock the same way the
  // payment webhook does — applyStockForPaidOrder is idempotent, so if the
  // webhook already ran this is a no-op.
  if (updateData.paymentStatus === 'PAID') {
    try {
      await applyStockForPaidOrder(order.id);
    } catch (stockErr) {
      console.error('Stock update failed for order', order.id, stockErr);
    }
    await notifyOrder(order.id, 'confirmation');
  }

  if (updateData.status === 'SHIPPED') {
    await notifyOrder(order.id, 'shipped');
  } else if (updateData.status === 'DELIVERED') {
    await notifyOrder(order.id, 'delivered');
  }

  return NextResponse.json({
    ...updated,
    subtotal: Number(updated.subtotal),
    shippingCost: Number(updated.shippingCost),
    discount: Number(updated.discount),
    total: Number(updated.total),
    items: updated.items.map((i) => ({
      ...i,
      price: Number(i.price),
      subtotal: Number(i.subtotal),
    })),
  });
}
