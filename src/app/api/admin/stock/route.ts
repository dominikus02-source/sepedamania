import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { stockAdjustSchema } from '@/lib/validations';
import { adjustStock } from '@/lib/stock';
import { revalidateCatalog } from '@/lib/revalidate-catalog';

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && session.user.role === 'ADMIN');
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // change: 0 rows are legacy no-op entries written by an older checkout stub
    // that logged every order against a fake "checkout" product id.
    const logs = await prisma.stockLog.findMany({
      where: { change: { not: 0 } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // StockLog stores only productId, so resolve names in one extra query
    // rather than adding a relation the schema does not have.
    const productIds = [...new Set(logs.map((l) => l.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });
    const nameById = new Map(products.map((p) => [p.id, p.name]));

    return NextResponse.json(
      {
        logs: logs.map((l) => ({
          id: l.id,
          productId: l.productId,
          productName: nameById.get(l.productId) ?? 'Produk dihapus',
          type: l.change > 0 ? ('IN' as const) : ('OUT' as const),
          qty: Math.abs(l.change),
          note: l.reason,
          createdAt: l.createdAt.toISOString(),
        })),
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } },
    );
  } catch (err) {
    console.error('GET /api/admin/stock error:', err);
    return NextResponse.json({ error: 'Gagal memuat riwayat stok' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = stockAdjustSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { productId, change, reason } = parsed.data;

  try {
    const result = await adjustStock(productId, change, reason || 'Penyesuaian manual');
    revalidateCatalog({ includeAdmin: true });
    return NextResponse.json({ stock: result.stock });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal menyesuaikan stok';
    // adjustStock throws for validation problems (unknown product, negative result).
    const status = /tidak ditemukan|tidak boleh|bilangan bulat/.test(message) ? 400 : 500;
    if (status === 500) console.error('POST /api/admin/stock error:', err);
    return NextResponse.json({ error: message }, { status });
  }
}
