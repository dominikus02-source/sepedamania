import { NextResponse } from 'next/server';
import { getMockOrder, updateMockOrderPayment } from '@/lib/mock-orders';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.external_id || !body.status) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (body.status === 'PAID') {
      updateMockOrderPayment(body.external_id, 'PAID', 'PROCESSING');
      const order = getMockOrder(body.external_id);
      if (order) {
        await sendOrderConfirmationEmail(order);
      }
    } else if (body.status === 'EXPIRED') {
      updateMockOrderPayment(body.external_id, 'EXPIRED', 'CANCELLED');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
