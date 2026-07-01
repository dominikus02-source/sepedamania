import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { getMockOrder, updateMockOrderPayment } from '@/lib/mock-orders';
import { verifySignatureKey, mapMidtransStatus } from '@/lib/midtrans';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const notification = body;

    if (!notification.order_id || !notification.transaction_status) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!verifySignatureKey(notification)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const order = getMockOrder(notification.order_id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { paymentStatus, orderStatus } = mapMidtransStatus(
      notification.transaction_status,
      notification.fraud_status || 'accept',
    );

    updateMockOrderPayment(notification.order_id, paymentStatus, orderStatus);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
