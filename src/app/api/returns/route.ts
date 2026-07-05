import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateOrigin } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateReturnNumber, checkReturnEligibility, ACTIVE_RETURN_STATUSES } from '@/lib/returns';
import type { ReturnStatus } from '@prisma/client';

const createReturnSchema = z.object({
  orderId: z.string().min(1),
  reason: z.enum(['DAMAGED', 'WRONG_ITEM', 'NOT_AS_DESCRIBED', 'SIZE_OR_VARIANT_ISSUE', 'MISSING_PART', 'OTHER']),
  detail: z.string().min(10, 'Jelaskan masalah minimal 10 karakter').max(1000),
  preferredResolution: z.enum(['REFUND', 'REPLACEMENT', 'STORE_CREDIT', 'ADMIN_HELP']),
  evidenceImages: z.array(z.string().url()).max(5).optional().default([]),
  confirmationAccepted: z.literal(true, { message: 'Kamu harus menyetujui pernyataan bahwa informasi yang diberikan benar' }),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');
  const orderIdFilter = url.searchParams.get('orderId');

  const userId = session.user.id;
  const isAdmin = session.user.role === 'ADMIN';

  const where: Record<string, unknown> = {};
  if (!isAdmin) where.userId = userId;
  if (statusFilter) where.status = statusFilter;
  if (orderIdFilter) where.orderId = orderIdFilter;

  const returns = await prisma.returnRequest.findMany({
    where: where as any,
    orderBy: { createdAt: 'desc' },
    include: { order: { select: { orderNumber: true, status: true } } },
  });

  return NextResponse.json({ returns });
}

export async function POST(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(`return-create:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: z.infer<typeof createReturnSchema>;
  try {
    const parsed = createReturnSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Data tidak valid', details: parsed.error.issues }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const userId = session.user.id;

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    select: {
      id: true,
      userId: true,
      status: true,
      paymentStatus: true,
      paidAt: true,
      completedAt: true,
      updatedAt: true,
      orderNumber: true,
      createdAt: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
  }

  if (order.userId !== userId) {
    return NextResponse.json({ error: 'Pesanan ini bukan milik Anda' }, { status: 403 });
  }

  const eligibility = await checkReturnEligibility(order);
  if (!eligibility.eligible) {
    return NextResponse.json({ error: eligibility.reason }, { status: 422 });
  }

  const activeExists = await prisma.returnRequest.findFirst({
    where: {
      orderId: body.orderId,
      status: { in: ACTIVE_RETURN_STATUSES as ReturnStatus[] },
    },
  });

  if (activeExists) {
    return NextResponse.json({ error: 'Sudah ada pengajuan pengembalian yang aktif untuk pesanan ini' }, { status: 409 });
  }

  const returnNumber = generateReturnNumber();

  const returnRequest = await prisma.returnRequest.create({
    data: {
      returnNumber,
      orderId: body.orderId,
      userId,
      status: 'REQUESTED',
      reason: body.reason,
      detail: body.detail,
      preferredResolution: body.preferredResolution,
      evidenceImages: body.evidenceImages,
    },
    include: { order: { select: { orderNumber: true, status: true } } },
  });

  return NextResponse.json({ return: returnRequest }, { status: 201 });
}
