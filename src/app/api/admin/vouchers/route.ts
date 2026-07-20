import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createVoucherSchema } from '@/lib/validations';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') return false;
  return true;
}

function serialize(v: {
  id: string; code: string; type: string; value: unknown; minPurchase: unknown;
  maxDiscount: unknown; quota: number | null; used: number;
  expiresAt: Date | null; isActive: boolean; createdAt: Date;
}) {
  return {
    id: v.id,
    code: v.code,
    type: v.type,
    value: Number(v.value),
    minPurchase: Number(v.minPurchase),
    maxDiscount: v.maxDiscount === null ? null : Number(v.maxDiscount),
    quota: v.quota,
    used: v.used,
    expiresAt: v.expiresAt ? v.expiresAt.toISOString() : null,
    isActive: v.isActive,
    createdAt: v.createdAt.toISOString(),
  };
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const vouchers = await prisma.voucher.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(
      { vouchers: vouchers.map(serialize) },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } },
    );
  } catch (err) {
    console.error('GET /api/admin/vouchers error:', err);
    return NextResponse.json({ error: 'Gagal memuat voucher' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = createVoucherSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const code = data.code.trim().toUpperCase();

  try {
    const existing = await prisma.voucher.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: 'Kode voucher sudah digunakan' }, { status: 409 });
    }

    const voucher = await prisma.voucher.create({
      data: {
        code,
        type: data.type,
        value: data.value,
        minPurchase: data.minPurchase,
        // A cap only means anything for percentage discounts.
        maxDiscount: data.type === 'PERCENTAGE' ? data.maxDiscount ?? null : null,
        quota: data.quota ?? null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({ voucher: serialize(voucher) }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/vouchers error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan voucher' }, { status: 500 });
  }
}
