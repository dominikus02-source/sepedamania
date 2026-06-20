import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMockOrder, updateMockOrderPayment } from '@/lib/mock-orders';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { validateOrigin } from '@/lib/csrf';

const webhookSchema = z.object({
  external_id: z.string().min(1),
  status: z.enum(['PAID', 'EXPIRED']),
});

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

    // C5: Validate webhook payload with Zod
    const parsed = webhookSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { external_id, status } = parsed.data;

    if (status === 'PAID') {
      updateMockOrderPayment(external_id, 'PAID', 'PROCESSING');
      const order = getMockOrder(external_id);
      if (order) {
        // Normalize null → undefined for OrderEmail compatibility
        const { trackingNumber, ...rest } = order;
        await sendOrderConfirmationEmail({ ...rest, trackingNumber: trackingNumber ?? undefined });
      }
    } else if (status === 'EXPIRED') {
      updateMockOrderPayment(external_id, 'EXPIRED', 'CANCELLED');
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
