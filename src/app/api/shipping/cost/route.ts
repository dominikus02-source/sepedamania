import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validateOrigin } from '@/lib/csrf';

// C5: Zod validation schema
const shippingCostSchema = z.object({
  courier: z.string().min(1, 'Kurir wajib dipilih'),
  destination: z.string().optional(),
  weight: z.number().positive('Berat harus lebih dari 0').optional(),
});

const mockRates: Record<string, { service: string; description: string; cost: number; etd: string }[]> = {
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
    // C3: CSRF origin check
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // C5: Validate request body with Zod
    const parsed = shippingCostSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { courier, weight } = parsed.data;
    const normalizedCourier = courier.toLowerCase();

    const rates = mockRates[normalizedCourier] || null;
    if (!rates) {
      return NextResponse.json({ error: 'Kurir tidak tersedia' }, { status: 404 });
    }

    const weightInKg = Math.max(1, Math.ceil((weight || 1000) / 1000));

    const results = rates.map((r) => ({
      service: r.service,
      description: r.description,
      cost: r.cost * weightInKg,
      etd: r.etd,
    }));

    return NextResponse.json({ costs: results });
  } catch {
    return NextResponse.json({ error: 'Gagal menghitung ongkir' }, { status: 500 });
  }
}
