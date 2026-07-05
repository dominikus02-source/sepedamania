import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateOrigin } from '@/lib/csrf';
import { isValidReturnTransition } from '@/lib/returns';

const updateReturnSchema = z.object({
  status: z.enum(['UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITING_FOR_ITEM', 'ITEM_RECEIVED', 'REFUND_PROCESSING', 'REPLACEMENT_SHIPPING', 'COMPLETED', 'CANCELLED']).optional(),
  adminNote: z.string().max(2000).optional(),
  rejectionReason: z.string().max(2000).optional(),
  refundAmount: z.number().positive().optional(),
  trackingNumber: z.string().max(100).optional(),
  returnShippingProvider: z.string().max(100).optional(),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const ret = await prisma.returnRequest.findFirst({
    where: { OR: [{ id }, { returnNumber: id }] },
    include: {
      order: {
        select: { orderNumber: true, status: true, paymentStatus: true },
      },
    },
  });

  if (!ret) {
    return NextResponse.json({ error: 'Retur tidak ditemukan' }, { status: 404 });
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === 'ADMIN';
  if (ret.userId !== userId && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ return: ret });
}

const cancellableFrom = ['REQUESTED', 'UNDER_REVIEW'];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const ret = await prisma.returnRequest.findFirst({
    where: { OR: [{ id }, { returnNumber: id }] },
  });

  if (!ret) {
    return NextResponse.json({ error: 'Retur tidak ditemukan' }, { status: 404 });
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === 'ADMIN';
  const isOwner = ret.userId === userId;

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: z.infer<typeof updateReturnSchema>;
  try {
    const parsed = updateReturnSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Data tidak valid', details: parsed.error.issues }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};

  if (body.status && body.status !== ret.status) {
    const targetStatus = body.status;

    if (isOwner && !isAdmin) {
      if (targetStatus !== 'CANCELLED') {
        return NextResponse.json({ error: 'Hanya admin yang dapat mengubah status retur' }, { status: 403 });
      }
      if (!cancellableFrom.includes(ret.status)) {
        return NextResponse.json({ error: 'Retur hanya dapat dibatalkan jika status masih REQUESTED atau UNDER_REVIEW' }, { status: 400 });
      }
    }

    if (isAdmin) {
      if (!isValidReturnTransition(ret.status, targetStatus)) {
        return NextResponse.json({ error: `Transisi status tidak valid dari ${ret.status} ke ${targetStatus}` }, { status: 400 });
      }
      if (targetStatus === 'REJECTED' && !body.rejectionReason) {
        return NextResponse.json({ error: 'Alasan penolakan wajib diisi saat menolak retur' }, { status: 400 });
      }
    }

    data.status = targetStatus;

    if (targetStatus === 'UNDER_REVIEW') data.reviewedAt = new Date();
    if (targetStatus === 'APPROVED') data.approvedAt = new Date();
    if (targetStatus === 'ITEM_RECEIVED') data.receivedAt = new Date();
    if (targetStatus === 'COMPLETED') data.completedAt = new Date();
  }

  if (isAdmin) {
    if (body.adminNote !== undefined) data.adminNote = body.adminNote;
    if (body.rejectionReason !== undefined) data.rejectionReason = body.rejectionReason;
    if (body.refundAmount !== undefined) data.refundAmount = body.refundAmount;
    if (body.trackingNumber !== undefined) data.trackingNumber = body.trackingNumber;
    if (body.returnShippingProvider !== undefined) data.returnShippingProvider = body.returnShippingProvider;
  } else {
    const restricted = ['adminNote', 'rejectionReason', 'refundAmount', 'trackingNumber', 'returnShippingProvider'];
    for (const field of restricted) {
      if ((body as any)[field] !== undefined) {
        return NextResponse.json({ error: `Hanya admin yang dapat mengubah field ${field}` }, { status: 403 });
      }
    }
  }

  const updated = await prisma.returnRequest.update({
    where: { id: ret.id },
    data,
    include: {
      order: { select: { orderNumber: true, status: true, paymentStatus: true } },
    },
  });

  return NextResponse.json({ return: updated });
}
