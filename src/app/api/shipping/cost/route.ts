import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { validateOrigin } from '@/lib/csrf';
import { calculateCost, isConfigured, DEFAULT_COURIERS } from '@/lib/rajaongkir';

const costSchema = z.object({
  destinationId: z.union([z.string(), z.number()]).refine(
    (v) => String(v).trim().length > 0,
    'Tujuan pengiriman wajib dipilih',
  ),
  weight: z.number().min(1, 'Berat minimal 1 gram'),
  couriers: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = costSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: parsed.error.issues },
      { status: 400 },
    );
  }

  if (!isConfigured()) {
    console.error('Shipping quote unavailable: RAJAONGKIR_API_KEY / RAJAONGKIR_ORIGIN_ID missing');
    return NextResponse.json(
      { error: 'Perhitungan ongkir belum dikonfigurasi. Hubungi admin toko.' },
      { status: 503 },
    );
  }

  const { destinationId, weight, couriers } = parsed.data;

  try {
    const rates = await calculateCost(
      destinationId,
      weight,
      couriers?.length ? couriers : DEFAULT_COURIERS,
    );

    // Deliberately no flat-rate fallback. A quote that ignores distance
    // overcharges nearby buyers and loses money on remote ones, and it does so
    // silently — an honest error is cheaper than a wrong price.
    return NextResponse.json({ success: true, data: { rates } });
  } catch (err) {
    console.error('POST /api/shipping/cost error:', err);
    return NextResponse.json(
      { error: 'Gagal menghitung ongkir. Coba lagi sebentar lagi.' },
      { status: 502 },
    );
  }
}
