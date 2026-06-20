import { NextResponse } from 'next/server';
import { getMockOrder, updateMockOrderPayment } from '@/lib/mock-orders';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { validateOrigin } from '@/lib/csrf';

export async function POST(req: Request) {
  try {
    // C2: Verify x-callback-token header
    const callbackToken = req.headers.get('x-callback-token');
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

    if (!callbackToken || !expectedToken || callbackToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // C3: CSRF origin check (server-to-server calls without origin/referer pass through)
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    if (!body.external_id || !body.status) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // C2: Validate body.status is one of the allowed values
    if (!['PAID', 'EXPIRED'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    if (body.status === 'PAID') {
      updateMockOrderPayment(body.external_id, 'PAID', 'PROCESSING');
      const order = getMockOrder(body.external_id);
      if (order) {
        // Normalize null → undefined for OrderEmail compatibility
        const { trackingNumber, ...rest } = order;
        await sendOrderConfirmationEmail({ ...rest, trackingNumber: trackingNumber ?? undefined });
      }
    } else if (body.status === 'EXPIRED') {
      updateMockOrderPayment(body.external_id, 'EXPIRED', 'CANCELLED');
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
