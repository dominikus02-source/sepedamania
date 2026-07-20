import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';

/** Unpaid orders older than this are cancelled so they stop cluttering the list. */
const EXPIRY_HOURS = 24;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  // Without a configured secret every caller would match "Bearer undefined",
  // so refuse to run at all rather than expose the endpoint.
  if (!secret) {
    console.error('CRON_SECRET is not set; refusing to run cancel-expired-orders');
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 });
  }
  if (req.headers.get('Authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - EXPIRY_HOURS * 60 * 60 * 1000);

  try {
    // Only orders that were never paid. Stock is untouched because it is
    // deducted at payment, so there is nothing to give back here.
    const expired = await prisma.order.findMany({
      where: {
        status: 'PENDING_PAYMENT',
        paymentStatus: 'UNPAID',
        createdAt: { lt: cutoff },
      },
      select: { id: true, orderNumber: true },
    });

    if (expired.length === 0) {
      return NextResponse.json({ success: true, cancelled: 0 });
    }

    const now = new Date();
    await prisma.order.updateMany({
      where: { id: { in: expired.map((o) => o.id) } },
      data: { status: 'CANCELLED', paymentStatus: 'EXPIRED', cancelledAt: now },
    });

    console.log(
      `[Cron] Cancelled ${expired.length} expired orders:`,
      expired.map((o) => o.orderNumber).join(', '),
    );

    return NextResponse.json({
      success: true,
      cancelled: expired.length,
      orderNumbers: expired.map((o) => o.orderNumber),
    });
  } catch (err) {
    console.error('GET /api/cron/cancel-expired-orders error:', err);
    return NextResponse.json({ error: 'Gagal membatalkan pesanan kadaluarsa' }, { status: 500 });
  }
}
