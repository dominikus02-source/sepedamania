import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { verifySignatureKey, mapMidtransStatus, type MidtransNotification } from '@/lib/midtrans';

export async function POST(req: Request) {
  try {
    const body = await req.json() as MidtransNotification;

    const { transaction_status, fraud_status, transaction_id, payment_type } = body;
    const midtransOrderId = body.order_id;

    if (!midtransOrderId || !transaction_status) {
      return NextResponse.json({ error: 'Invalid notification' }, { status: 400 });
    }

    if (!verifySignatureKey(body)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    let order = await prisma.order.findUnique({
      where: { midtransOrderId },
    });

    if (!order) {
      order = await prisma.order.findUnique({
        where: { orderNumber: midtransOrderId },
      });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isIdempotent = (
      (order.paymentStatus === 'PAID' && ['settlement', 'capture'].includes(transaction_status)) ||
      (order.paymentStatus === 'EXPIRED' && transaction_status === 'expire') ||
      (order.paymentStatus === 'FAILED' && ['deny', 'cancel'].includes(transaction_status))
    );

    if (isIdempotent) {
      return NextResponse.json({ status: 'ok', message: 'Already processed' });
    }

    const mapped = mapMidtransStatus(transaction_status, fraud_status || '');

    const updateData: Record<string, unknown> = {
      paymentStatus: mapped.paymentStatus,
      status: mapped.orderStatus,
    };

    if (mapped.paymentStatus === 'PAID') {
      updateData.paidAt = new Date();
    }
    if (mapped.paymentStatus === 'EXPIRED' || mapped.orderStatus === 'CANCELLED') {
      updateData.cancelledAt = new Date();
    }

    await prisma.order.update({
      where: { id: order.id },
      data: updateData as any,
    });

    await prisma.paymentLog.create({
      data: {
        orderId: order.id,
        provider: 'MIDTRANS',
        eventType: 'notification',
        transactionStatus: transaction_status,
        fraudStatus: fraud_status || null,
        rawPayload: body as object,
      },
    });

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Midtrans webhook error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
