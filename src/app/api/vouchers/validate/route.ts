import { NextResponse } from 'next/server';

const mockVouchers: Record<string, { type: string; value: number; minPurchase: number; maxDiscount?: number; isActive: boolean; expiresAt?: string }> = {
  SEPEDA10: { type: 'PERCENTAGE', value: 10, minPurchase: 50000, maxDiscount: 200000, isActive: true, expiresAt: '2027-12-31T00:00:00Z' },
  GRATIS20: { type: 'NOMINAL', value: 20000, minPurchase: 100000, isActive: true, expiresAt: '2027-12-31T00:00:00Z' },
  MERDEKA: { type: 'PERCENTAGE', value: 15, minPurchase: 200000, maxDiscount: 150000, isActive: true, expiresAt: '2026-08-31T00:00:00Z' },
};

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();
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
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
