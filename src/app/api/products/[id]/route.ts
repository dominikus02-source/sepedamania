import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidateCatalog } from '@/lib/revalidate-catalog';
import { updateProductSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

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
      variants: product.variants.map((v) => ({
        id: v.id,
        name: v.name,
        value: v.value,
        stock: v.stock,
        price: v.price ? Number(v.price) : null,
        sku: v.sku || '',
        productId: v.productId,
      })),
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
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updateData: Record<string, unknown> = {};
    for (const key of [
      'name', 'sku', 'description', 'categoryId', 'brandId', 'price', 'salePrice',
      'weight', 'stock', 'images', 'videoUrls', 'isActive', 'metaTitle', 'metaDescription',
    ] as const) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    if (data.specs !== undefined) updateData.specs = data.specs as Prisma.InputJsonValue;

    // Renaming a product moves its public URL, so keep the slug in step and
    // make sure the new one is still free.
    let slug = existing.slug;
    if (data.name !== undefined) {
      const nextSlug = slugify(data.name);
      if (nextSlug !== existing.slug) {
        const clash = await prisma.product.findUnique({ where: { slug: nextSlug } });
        if (clash && clash.id !== id) {
          return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
        }
        updateData.slug = nextSlug;
        slug = nextSlug;
      }
    }

    if (data.sku !== undefined && data.sku !== existing.sku) {
      const clash = await prisma.product.findUnique({ where: { sku: data.sku } });
      if (clash && clash.id !== id) {
        return NextResponse.json({ error: 'SKU sudah digunakan' }, { status: 409 });
      }
    }

    if (data.categoryId !== undefined) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) {
        return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
      }
    }
    if (data.brandId !== undefined) {
      const brand = await prisma.brand.findUnique({ where: { id: data.brandId } });
      if (!brand) {
        return NextResponse.json({ error: 'Merek tidak ditemukan' }, { status: 404 });
      }
    }

    // Variants are replaced wholesale — the edit form always submits the full
    // set, and diffing rows the user may have renamed is not worth the risk.
    const product = await prisma.$transaction(async (tx) => {
      if (data.variants !== undefined) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        if (data.variants.length > 0) {
          await tx.productVariant.createMany({
            data: data.variants.map((v) => ({
              productId: id,
              name: v.name,
              value: v.value,
              stock: v.stock,
              price: v.price ?? null,
              sku: v.sku || null,
            })),
          });
        }
      }
      return tx.product.update({
        where: { id },
        data: updateData,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          variants: true,
        },
      });
    });

    revalidateCatalog({ productSlug: slug, includeAdmin: true });
    if (slug !== existing.slug) {
      revalidateCatalog({ productSlug: existing.slug, includeAdmin: true });
    }

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        variants: product.variants.map((v) => ({
          id: v.id,
          name: v.name,
          value: v.value,
          stock: v.stock,
          price: v.price ? Number(v.price) : null,
          sku: v.sku || '',
          productId: v.productId,
        })),
        specs: (product.specs as Record<string, string>) || {},
      },
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
