import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { validateOrigin } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';

// C5: Zod validation schema
const voucherSchema = z.object({
  code: z.string().min(1, 'Kode voucher wajib diisi'),
  subtotal: z.number().positive('Subtotal harus lebih dari 0'),
});

const mockVouchers: Record<string, { type: string; value: number; minPurchase: number; maxDiscount?: number; isActive: boolean; expiresAt?: string }> = {
  SEPEDA10: { type: 'PERCENTAGE', value: 10, minPurchase: 50000, maxDiscount: 200000, isActive: true, expiresAt: '2027-12-31T00:00:00Z' },
  GRATIS20: { type: 'NOMINAL', value: 20000, minPurchase: 100000, isActive: true, expiresAt: '2027-12-31T00:00:00Z' },
  MERDEKA: { type: 'PERCENTAGE', value: 15, minPurchase: 200000, maxDiscount: 150000, isActive: true, expiresAt: '2026-08-31T00:00:00Z' },
};

export async function POST(req: Request) {
  try {
    // C3: CSRF origin check
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // C6: Rate limiting — 10 voucher checks per IP per minute
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`voucher:${ip}`, 10, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // C5: Validate request body with Zod
    const parsed = voucherSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { valid: false, error: 'Data tidak valid', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { code, subtotal } = parsed.data;
    const voucherCode = code.toUpperCase();

    const voucher = mockVouchers[voucherCode];

    if (!voucher || !voucher.isActive) {
      return NextResponse.json({ valid: false, error: 'Voucher tidak ditemukan' });
    }

    if (voucher.expiresAt && new Date() > new Date(voucher.expiresAt)) {
      return NextResponse.json({ valid: false, error: 'Voucher sudah kadaluarsa' });
    }

    if (Number(subtotal) < Number(voucher.minPurchase)) {
      return NextResponse.json({ valid: false, error: `Min. belanja Rp ${Number(voucher.minPurchase).toLocaleString('id-ID')}` });
    }

    let discount = voucher.type === 'PERCENTAGE'
      ? (Number(subtotal) * Number(voucher.value)) / 100
      : Number(voucher.value);

    if (voucher.maxDiscount && discount > Number(voucher.maxDiscount)) {
      discount = Number(voucher.maxDiscount);
    }

    return NextResponse.json({ valid: true, discount, voucher: { ...voucher, code: voucherCode } });
  } catch {
    return NextResponse.json({ valid: false, error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
