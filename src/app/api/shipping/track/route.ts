import { NextResponse } from 'next/server';
import { trackShipment } from '@/lib/shipping';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`shipping-track:${ip}`, 30, 60000)) {
      return NextResponse.json({ error: 'Terlalu banyak request' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const courier = searchParams.get('courier');
    const awb = searchParams.get('awb');

    if (!courier || !awb) {
      return NextResponse.json(
        { error: 'Parameter courier dan awb wajib diisi' },
        { status: 400 },
      );
    }

    const result = await trackShipment(courier, awb);

    if (!result) {
      return NextResponse.json(
        { error: 'Data tidak ditemukan atau API key belum dikonfigurasi' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch {
    return NextResponse.json(
      { error: 'Gagal melacak paket' },
      { status: 500 },
    );
  }
}
