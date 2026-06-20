import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { validateOrigin } from '@/lib/csrf';
import { getMockOrder, updateMockOrderPayment } from '@/lib/mock-orders';

const patchOrderSchema = z.object({
  paymentStatus: z.string().optional(),
  status: z.string().optional(),
});

// Valid status transitions: currentStatus -> allowed next statuses (admin only)
const validStatusTransitions: Record<string, string[]> = {
  PENDING_PAYMENT: ['PROCESSING'],
  PROCESSING: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
};

// Valid payment status transitions: current -> allowed next (admin only)
const validPaymentTransitions: Record<string, string[]> = {
  UNPAID: ['PAID', 'EXPIRED'],
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getMockOrder(id);
  if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // C3: CSRF origin check
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // C1: Auth check — caller must be authenticated
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // C1: Find the order
  const order = getMockOrder(id);
  if (!order) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
  }

  // C1: Check ownership or ADMIN role
  const userId = session.user.id;
  const userRole = session.user.role;
  const isOwner = order.userId && userId && order.userId === userId;
  const isAdmin = userRole === 'ADMIN';

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // C1: Validate request body with Zod
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

  // C1: Validate status transitions (admin only)
  if (body.status && body.status !== order.status) {
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admin can change order status' },
        { status: 403 },
      );
    }
    const allowedNext = validStatusTransitions[order.status as string];
    if (!allowedNext || !allowedNext.includes(body.status)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${order.status} to ${body.status}`,
        },
        { status: 400 },
      );
    }
  }

  // C1: Validate payment status transitions (admin only)
  if (body.paymentStatus && body.paymentStatus !== order.paymentStatus) {
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admin can change payment status' },
        { status: 403 },
      );
    }
    const allowedNext = validPaymentTransitions[order.paymentStatus as string];
    if (!allowedNext || !allowedNext.includes(body.paymentStatus)) {
      return NextResponse.json(
        {
          error: `Invalid payment transition from ${order.paymentStatus} to ${body.paymentStatus}`,
        },
        { status: 400 },
      );
    }
  }

  // C1: Apply updates (keep existing values for unset fields)
  const updated = updateMockOrderPayment(
    id,
    body.paymentStatus ?? order.paymentStatus,
    body.status ?? order.status,
  );

  return NextResponse.json(updated);
}
