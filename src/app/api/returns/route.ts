import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { validateOrigin } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { getMockOrder } from '@/lib/mock-orders';
import {
  getMockReturnsByUser,
  getMockReturnsByOrder,
  getActiveMockReturnForOrder,
  getAllMockReturns,
  setMockReturn,
  generateReturnNumber,
} from '@/lib/mock-returns';
import type { ReturnReason, PreferredResolution, MockReturnRequest } from '@/lib/mock-returns';

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const createReturnSchema = z.object({
  orderId: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional(),
        name: z.string().min(1),
        price: z.number().positive(),
        qty: z.number().int().positive(),
        image: z.string().optional(),
      }),
    )
    .min(1),
  reason: z.enum([
    'DAMAGED',
    'WRONG_ITEM',
    'NOT_AS_DESCRIBED',
    'SIZE_OR_VARIANT_ISSUE',
    'MISSING_PART',
    'OTHER',
  ]),
  detail: z.string().min(10, 'Jelaskan masalah minimal 10 karakter').max(2000),
  preferredResolution: z.enum(['REFUND', 'REPLACEMENT', 'STORE_CREDIT', 'ADMIN_HELP']),
  evidenceImages: z.array(z.string().url()).max(5).optional().default([]),
  confirmationAccepted: z.literal(true, {
    message:
      'Kamu harus menyetujui pernyataan bahwa informasi yang diberikan benar',
  }),
});

// ---------------------------------------------------------------------------
// GET /api/returns — List returns
// ---------------------------------------------------------------------------

export async function GET(req: Request) {
  // C1: Auth required
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');
  const orderIdFilter = url.searchParams.get('orderId');

  const userId = session.user.id;
  const userRole = session.user.role;
  const isAdmin = userRole === 'ADMIN';

  let returns: MockReturnRequest[];

  if (isAdmin) {
    returns = getAllMockReturns();
  } else {
    returns = getMockReturnsByUser(userId);
  }

  // Optional filters
  if (statusFilter) {
    returns = returns.filter((r) => r.status === statusFilter);
  }
  if (orderIdFilter) {
    returns = returns.filter((r) => r.orderId === orderIdFilter);
  }

  // Sort newest first
  returns.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return NextResponse.json({ returns });
}

// ---------------------------------------------------------------------------
// POST /api/returns — Create a return request
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  // C3: CSRF origin check
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Rate limit: 3 requests per IP per 60 seconds
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (!checkRateLimit(`return-create:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // C1: Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // C1: Parse & validate body
  let body: z.infer<typeof createReturnSchema>;
  try {
    const parsed = createReturnSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: parsed.error.issues },
        { status: 400 },
      );
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // C1: Validate order ownership
  const order = getMockOrder(body.orderId);
  if (!order) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
  }

  const userId = session.user.id;
  if (order.userId !== userId) {
    return NextResponse.json(
      { error: 'Pesanan ini bukan milik Anda' },
      { status: 403 },
    );
  }

  // Check order status — only DELIVERED or COMPLETED orders can be returned
  const allowedStatuses = ['DELIVERED', 'COMPLETED'];
  if (!allowedStatuses.includes(order.status as string)) {
    return NextResponse.json(
      {
        error:
          'Pengajuan retur hanya bisa dilakukan untuk pesanan dengan status DELIVERED atau COMPLETED',
      },
      { status: 422 },
    );
  }

  // Check return period — order must be created within last 30 days
  const orderDate = new Date(order.createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (orderDate < thirtyDaysAgo) {
    return NextResponse.json(
      { error: 'Periode pengajuan retur sudah berakhir (maksimal 30 hari sejak pesanan dibuat)' },
      { status: 422 },
    );
  }

  // Check no active return exists for this order
  const existingActive = getActiveMockReturnForOrder(body.orderId);
  if (existingActive) {
    return NextResponse.json(
      { error: 'Sudah ada pengajuan retur yang aktif untuk pesanan ini' },
      { status: 409 },
    );
  }

  // Generate return ID (similar pattern to generateOrderId)
  const returnId = `RET-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const returnNumber = generateReturnNumber();
  const now = new Date().toISOString();

  const returnRequest: MockReturnRequest = {
    id: returnId,
    returnNumber,
    orderId: body.orderId,
    userId,
    items: body.items,
    reason: body.reason as ReturnReason,
    detail: body.detail,
    preferredResolution: body.preferredResolution as PreferredResolution,
    evidenceImages: body.evidenceImages ?? [],
    status: 'REQUESTED',
    confirmationAccepted: body.confirmationAccepted as boolean,
    createdAt: now,
    updatedAt: now,
  };

  setMockReturn(returnRequest);

  return NextResponse.json({ return: returnRequest }, { status: 201 });
}
