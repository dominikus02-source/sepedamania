import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const updateSchema = z.object({
  isActive: z.boolean().optional(),
  quota: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && session.user.role === 'ADMIN');
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const existing = await prisma.voucher.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Voucher tidak ditemukan' }, { status: 404 });
    }

    const data = parsed.data;
    const voucher = await prisma.voucher.update({
      where: { id },
      data: {
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.quota !== undefined && { quota: data.quota }),
        ...(data.expiresAt !== undefined && {
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        }),
      },
    });

    return NextResponse.json({
      voucher: {
        id: voucher.id,
        code: voucher.code,
        type: voucher.type,
        value: Number(voucher.value),
        minPurchase: Number(voucher.minPurchase),
        maxDiscount: voucher.maxDiscount === null ? null : Number(voucher.maxDiscount),
        quota: voucher.quota,
        used: voucher.used,
        expiresAt: voucher.expiresAt ? voucher.expiresAt.toISOString() : null,
        isActive: voucher.isActive,
        createdAt: voucher.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error('PATCH /api/admin/vouchers error:', err);
    return NextResponse.json({ error: 'Gagal mengubah voucher' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.voucher.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Voucher tidak ditemukan' }, { status: 404 });
    }

    // A used voucher is referenced by past orders, so keep the record and just
    // retire it rather than breaking that history.
    if (existing.used > 0) {
      const voucher = await prisma.voucher.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        deactivated: true,
        message: `Voucher sudah dipakai ${voucher.used}x, jadi dinonaktifkan bukan dihapus.`,
      });
    }

    await prisma.voucher.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/vouchers error:', err);
    return NextResponse.json({ error: 'Gagal menghapus voucher' }, { status: 500 });
  }
}
