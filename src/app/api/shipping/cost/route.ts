import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validateOrigin } from '@/lib/csrf';
import { getShippingRates, AVAILABLE_COURIERS } from '@/lib/shipping';

const costSchema = z.object({
  origin: z.string().min(1, 'Kota asal wajib diisi'),
  destination: z.string().min(1, 'Kota tujuan wajib diisi'),
  weight: z.number().min(1, 'Berat minimal 1 gram'),
  couriers: z.array(z.string()).optional(),
});

// Fallback: hardcoded rates when Binderbyte API key is not configured
const FALLBACK_RATES: Record<string, { service: string; description: string; cost: number; etd: string }[]> = {
  jne: [
    { service: 'REG', description: 'Layanan Reguler', cost: 18000, etd: '2-3 hari' },
    { service: 'YES', description: 'Yakin Esok Sampai', cost: 35000, etd: '1 hari' },
    { service: 'OKE', description: 'Ongkos Kirim Ekonomis', cost: 12000, etd: '4-6 hari' },
  ],
  jnt: [
    { service: 'REG', description: 'Layanan Reguler', cost: 15000, etd: '2-3 hari' },
  ],
  sicepat: [
    { service: 'REG', description: 'SiCepat Reguler', cost: 16000, etd: '2-3 hari' },
    { service: 'BEST', description: 'Besok Sampai', cost: 32000, etd: '1 hari' },
  ],
  anteraja: [
    { service: 'REG', description: 'Reguler', cost: 14000, etd: '3-4 hari' },
  ],
  pos: [
    { service: 'Kilat', description: 'Pos Kilat', cost: 20000, etd: '2-3 hari' },
    { service: 'Reguler', description: 'Pos Reguler', cost: 10000, etd: '5-7 hari' },
  ],
};

export async function POST(req: Request) {
  try {
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const parsed = costSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { origin, destination, weight, couriers } = parsed.data;
    const courierList = couriers?.length
      ? couriers
      : AVAILABLE_COURIERS.slice(0, 5).map((c) => c.code);

    // Try real Binderbyte API first
    const rates = await getShippingRates(origin, destination, weight, courierList);

    if (rates.length > 0) {
      return NextResponse.json({ success: true, data: { rates } });
    }

    // Fallback to mock rates when API key is not configured
    const weightInKg = Math.max(1, Math.ceil(weight / 1000));
    const fallbackRates = Object.entries(FALLBACK_RATES).flatMap(([courier, services]) =>
      services.map((s) => ({
        courier,
        courierName: AVAILABLE_COURIERS.find((c) => c.code === courier)?.name || courier,
        service: s.service,
        description: s.description,
        cost: s.cost * weightInKg,
        etd: s.etd,
      })),
    );

    return NextResponse.json({ success: true, data: { rates: fallbackRates } });
  } catch {
    return NextResponse.json({ error: 'Gagal menghitung ongkir' }, { status: 500 });
  }
}
