import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidateCatalog } from '@/lib/revalidate-catalog';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { brand: { select: { id: true, name: true, slug: true } } },
    });
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ category });
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
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (body.slug !== undefined) {
      const slugConflict = await prisma.category.findFirst({
        where: { slug: body.slug, id: { not: id } },
      });
      if (slugConflict) return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
    }

    if (body.name !== undefined) {
      const nameConflict = await prisma.category.findFirst({
        where: { name: { equals: body.name, mode: 'insensitive' }, id: { not: id } },
      });
      if (nameConflict) return NextResponse.json({ error: 'Nama kategori sudah ada' }, { status: 409 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.brandId !== undefined) updateData.brandId = body.brandId;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.color !== undefined) updateData.color = body.color;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: { brand: { select: { id: true, name: true, slug: true } } },
    });

    revalidateCatalog({ categorySlug: category.slug, includeAdmin: true });
    return NextResponse.json({ category });
  } catch (err) {
    console.error('PUT /api/categories error:', err);
    return NextResponse.json({ error: 'Gagal update kategori' }, { status: 500 });
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
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json({ error: 'Masih ada produk dalam kategori ini' }, { status: 400 });
    }
    await prisma.category.delete({ where: { id } });
    revalidateCatalog({ includeAdmin: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/categories error:', err);
    return NextResponse.json({ error: 'Gagal hapus kategori' }, { status: 500 });
  }
}
