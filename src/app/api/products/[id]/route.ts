import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidateCatalog } from '@/lib/revalidate-catalog';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        variants: true,
      },
    });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      specs: (product.specs as Record<string, string>) || {},
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.brandId !== undefined) updateData.brandId = body.brandId;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.salePrice !== undefined) updateData.salePrice = body.salePrice;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.specs !== undefined) updateData.specs = body.specs as any;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
      },
    });

    revalidateCatalog({ productSlug: product.slug, includeAdmin: true });
    return NextResponse.json({
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
    });
  } catch (err) {
    console.error('PUT /api/products error:', err);
    return NextResponse.json({ error: 'Gagal update produk' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  void req;

  try {
    await prisma.product.delete({ where: { id } });
    revalidateCatalog({ includeAdmin: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/products error:', err);
    return NextResponse.json({ error: 'Gagal hapus produk' }, { status: 500 });
  }
}
