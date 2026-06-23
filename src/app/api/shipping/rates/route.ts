import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getShippingRates } from '@/lib/shipping';
import { checkRateLimit } from '@/lib/rate-limit';

const ratesSchema = z.object({
  origin: z.string().min(1, 'Kota asal wajib diisi'),
  destination: z.string().min(1, 'Kota tujuan wajib diisi'),
  weight: z.number().min(1, 'Berat minimal 1 gram'),
  couriers: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`shipping-rates:${ip}`, 20, 60000)) {
      return NextResponse.json({ error: 'Terlalu banyak request' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = ratesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { origin, destination, weight, couriers } = parsed.data;

    const rates = await getShippingRates(origin, destination, weight, couriers);

    return NextResponse.json({
      success: true,
      data: {
        origin,
        destination,
        weight,
        rates,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Gagal menghitung ongkir' },
      { status: 500 },
    );
  }
}
