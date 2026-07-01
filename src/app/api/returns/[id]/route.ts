import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { validateOrigin } from '@/lib/csrf';
import {
  getMockReturn,
  getMockReturnByNumber,
  isValidReturnTransition,
  updateMockReturn,
} from '@/lib/mock-returns';
import type { ReturnStatus, MockReturnRequest } from '@/lib/mock-returns';

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const updateReturnSchema = z.object({
  status: z
    .enum([
      'UNDER_REVIEW',
      'APPROVED',
      'REJECTED',
      'WAITING_FOR_ITEM',
      'ITEM_RECEIVED',
      'REFUND_PROCESSING',
      'REPLACEMENT_SHIPPING',
      'COMPLETED',
      'CANCELLED',
    ])
    .optional(),
  adminNote: z.string().max(2000).optional(),
  rejectionReason: z.string().max(2000).optional(),
  refundAmount: z.number().positive().optional(),
  trackingNumber: z.string().max(100).optional(),
  returnShippingProvider: z.string().max(100).optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findReturn(id: string): MockReturnRequest | null {
  return getMockReturn(id) ?? getMockReturnByNumber(id);
}

// ---------------------------------------------------------------------------
// GET /api/returns/[id] — Get a single return
// ---------------------------------------------------------------------------

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // C1: Auth required
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const ret = findReturn(id);
  if (!ret) {
    return NextResponse.json({ error: 'Retur tidak ditemukan' }, { status: 404 });
  }

  // Ownership check
  const userId = session.user.id;
  const userRole = session.user.role;
  const isOwner = ret.userId === userId;
  const isAdmin = userRole === 'ADMIN';

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ return: ret });
}

// ---------------------------------------------------------------------------
// PATCH /api/returns/[id] — Update return status (admin) or cancel (user)
// ---------------------------------------------------------------------------

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // C3: CSRF origin check
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // C1: Auth required
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // C1: Find the return
  const ret = findReturn(id);
  if (!ret) {
    return NextResponse.json({ error: 'Retur tidak ditemukan' }, { status: 404 });
  }

  // Ownership check
  const userId = session.user.id;
  const userRole = session.user.role;
  const isOwner = ret.userId === userId;
  const isAdmin = userRole === 'ADMIN';

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // C1: Parse & validate body
  let body: z.infer<typeof updateReturnSchema>;
  try {
    const parsed = updateReturnSchema.safeParse(await req.json());
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

  const updates: Partial<MockReturnRequest> = {};

  // --- Status change logic ---
  if (body.status && body.status !== ret.status) {
    const targetStatus = body.status as ReturnStatus;

    if (isOwner && !isAdmin) {
      // Non-admin users can only cancel their own return
      if (targetStatus !== 'CANCELLED') {
        return NextResponse.json(
          { error: 'Hanya admin yang dapat mengubah status retur' },
          { status: 403 },
        );
      }

      // Can only cancel if current status is REQUESTED or UNDER_REVIEW
      const cancellableStatuses: ReturnStatus[] = ['REQUESTED', 'UNDER_REVIEW'];
      if (!cancellableStatuses.includes(ret.status as ReturnStatus)) {
        return NextResponse.json(
          {
            error:
              'Retur hanya dapat dibatalkan jika status masih REQUESTED atau UNDER_REVIEW',
          },
          { status: 400 },
        );
      }
    }

    // Admin: validate transition
    if (isAdmin) {
      if (!isValidReturnTransition(ret.status as ReturnStatus, targetStatus)) {
        return NextResponse.json(
          {
            error: `Transisi status tidak valid dari ${ret.status} ke ${targetStatus}`,
          },
          { status: 400 },
        );
      }

      // If rejecting, rejectionReason is required
      if (targetStatus === 'REJECTED' && !body.rejectionReason) {
        return NextResponse.json(
          { error: 'Alasan penolakan wajib diisi saat menolak retur' },
          { status: 400 },
        );
      }
    }

    updates.status = targetStatus;

    // Set timestamps based on target status
    const now = new Date().toISOString();
    if (targetStatus === 'UNDER_REVIEW') updates.reviewedAt = now;
    if (targetStatus === 'APPROVED') updates.approvedAt = now;
    if (targetStatus === 'ITEM_RECEIVED') updates.receivedAt = now;
    if (targetStatus === 'COMPLETED') updates.completedAt = now;
  }

  // --- Non-status fields (admin only) ---
  if (isAdmin) {
    if (body.adminNote !== undefined) updates.adminNote = body.adminNote;
    if (body.rejectionReason !== undefined)
      updates.rejectionReason = body.rejectionReason;
    if (body.refundAmount !== undefined) updates.refundAmount = body.refundAmount;
    if (body.trackingNumber !== undefined)
      updates.trackingNumber = body.trackingNumber;
    if (body.returnShippingProvider !== undefined)
      updates.returnShippingProvider = body.returnShippingProvider;
  } else {
    // Non-admin users should not be able to set these fields
    const restrictedFields = [
      'adminNote',
      'rejectionReason',
      'refundAmount',
      'trackingNumber',
      'returnShippingProvider',
    ] as const;
    for (const field of restrictedFields) {
      if (body[field] !== undefined) {
        return NextResponse.json(
          { error: `Hanya admin yang dapat mengubah field ${field}` },
          { status: 403 },
        );
      }
    }
  }

  // Apply updates
  const updated = updateMockReturn(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Retur tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({ return: updated });
}
