import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { verifySignatureKey, mapMidtransStatus, type MidtransNotification } from '@/lib/midtrans';
import { applyStockForPaidOrder } from '@/lib/stock';

export async function POST(req: Request) {
  try {
    const body = await req.json() as MidtransNotification;

    const { transaction_status, fraud_status } = body;
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

    const updateData: Prisma.OrderUpdateInput = {
      paymentStatus: mapped.paymentStatus,
      status: mapped.orderStatus,
      ...(mapped.paymentStatus === 'PAID' && { paidAt: new Date() }),
      ...((mapped.paymentStatus === 'EXPIRED' || mapped.orderStatus === 'CANCELLED') && {
        cancelledAt: new Date(),
      }),
    };

    await prisma.order.update({
      where: { id: order.id },
      data: updateData,
    });

    // Inventory moves only once payment is confirmed. applyStockForPaidOrder is
    // idempotent, so a Midtrans redelivery cannot deduct twice.
    if (mapped.paymentStatus === 'PAID') {
      try {
        await applyStockForPaidOrder(order.id);
      } catch (stockErr) {
        // Never fail the webhook over this: Midtrans would retry and the payment
        // record matters more. Surfaced for manual reconciliation instead.
        console.error('Stock update failed for order', order.id, stockErr);
      }
    }

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
