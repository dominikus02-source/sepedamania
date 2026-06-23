import { NextResponse } from 'next/server';
import { mapShippingStatus } from '@/lib/shipping';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * Binderbyte webhook for shipping status updates.
 * Binderbyte sends POST requests when shipment status changes.
 * This webhook is optional — the app also supports polling via /api/shipping/track.
 */

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`webhook-shipping:${ip}`, 30, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();

    const { awb, courier, status, date, desc, location } = body;

    if (!awb || !status) {
      return NextResponse.json(
        { error: 'Missing required fields (awb, status)' },
        { status: 400 },
      );
    }

    const mappedStatus = mapShippingStatus(status);

    console.log('[Shipping Webhook]', {
      awb,
      courier,
      status: mappedStatus,
      rawStatus: status,
      date,
      desc,
      location,
    });

    // In a real app, update the order status in the database
    // For now, we log it and the frontend can poll /api/shipping/track

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}
