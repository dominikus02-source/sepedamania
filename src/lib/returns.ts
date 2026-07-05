import { prisma } from '@/lib/prisma';
import type { ReturnStatus } from '@prisma/client';
import {
  ACTIVE_RETURN_STATUSES as _ACTIVE,
  ELIGIBLE_ORDER_STATUSES as _ELIGIBLE,
  RETURN_WINDOW_DAYS as _WINDOW,
} from './returns-shared';

export {
  RETURN_STATUS_LABELS,
  RETURN_STATUS_VARIANTS,
  RETURN_REASON_LABELS,
  RESOLUTION_LABELS,
  VALID_RETURN_TRANSITIONS,
  isValidReturnTransition,
  generateReturnNumber,
  ACTIVE_RETURN_STATUSES,
  ELIGIBLE_ORDER_STATUSES,
  RETURN_WINDOW_DAYS,
} from './returns-shared';

export interface ReturnEligibility {
  eligible: boolean;
  reason: string;
  remainingDays: number;
}

export async function checkReturnEligibility(
  order: {
    id: string;
    status: string;
    paymentStatus: string;
    paidAt?: Date | null;
    completedAt?: Date | null;
    updatedAt: Date;
    createdAt: Date;
  },
  _userId?: string | null,
): Promise<ReturnEligibility> {
  if (!_ELIGIBLE.includes(order.status)) {
    return { eligible: false, reason: 'Pengembalian hanya dapat diajukan untuk pesanan yang sudah diterima.', remainingDays: 0 };
  }

  if (order.paymentStatus !== 'PAID') {
    return { eligible: false, reason: 'Pembayaran belum lunas.', remainingDays: 0 };
  }

  const activeReturn = await prisma.returnRequest.findFirst({
    where: {
      orderId: order.id,
      status: { in: _ACTIVE as ReturnStatus[] },
    },
  });

  if (activeReturn) {
    return { eligible: false, reason: 'Sudah ada pengajuan pengembalian yang sedang diproses untuk pesanan ini.', remainingDays: 0 };
  }

  const referenceDate = order.completedAt || order.paidAt || order.updatedAt;
  const elapsed = Date.now() - referenceDate.getTime();
  const remainingMs = _WINDOW * 24 * 60 * 60 * 1000 - elapsed;
  const remainingDays = Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));

  if (remainingDays <= 0) {
    return { eligible: false, reason: `Periode pengembalian ${_WINDOW} hari telah berakhir.`, remainingDays: 0 };
  }

  return { eligible: true, reason: '', remainingDays };
}
