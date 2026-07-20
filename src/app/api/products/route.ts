import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { createProductSchema } from '@/lib/validations';
import { auth } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { revalidateCatalog } from '@/lib/revalidate-catalog';

const productQuerySchema = z.object({
  q: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  categorySlug: z.string().optional(),
  brandSlug: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sort: z.enum(['price_asc', 'price_desc', 'sold', 'rating', 'newest']).optional(),
  featured: z.coerce.boolean().optional(),
  flashSale: z.coerce.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = productQuerySchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.issues },
      { status: 400 }
    );
  }

  const {
    q,
    categoryId,
    brandId,
    categorySlug,
    brandSlug,
    limit,
    sort,
    featured,
    flashSale,
  } = parsed.data;

  try {
    const where: any = { isActive: true };

    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        where.categoryId = category.id;
      }
    } else if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandSlug) {
      const brand = await prisma.brand.findUnique({
        where: { slug: brandSlug },
      });
      if (brand) {
        where.brandId = brand.id;
      }
    } else if (brandId) {
      where.brandId = brandId;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    switch (sort) {
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'sold':
        orderBy.sold = 'desc';
        break;
      case 'rating':
        orderBy.rating = 'desc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        variants: true,
        reviews: { select: { id: true, rating: true, comment: true, images: true, createdAt: true, userId: true } },
      },
    });

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      categoryId: p.categoryId,
      brandId: p.brandId,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      weight: p.weight,
      stock: p.stock,
      sold: p.sold,
      images: p.images,
      videoUrls: p.videoUrls,
      isActive: p.isActive,
      specs: (p.specs as Record<string, string>) || {},
      category: p.category,
      brand: p.brand,
      variants: p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        value: v.value,
        stock: v.stock,
        price: v.price ? Number(v.price) : null,
        sku: v.sku || '',
        productId: v.productId,
      })),
      reviews: p.reviews.map((r) => ({
        id: r.id,
        userId: r.userId,
        productId: p.id,
        rating: r.rating,
        comment: r.comment || '',
        images: r.images,
        createdAt: r.createdAt.toISOString(),
        user: { name: '', image: null },
      })),
      rating: p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0,
      reviewCount: p.reviews.length,
    }));

    return NextResponse.json({ products: mapped }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ error: 'Gagal mengambil produk' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = createProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const data = parsed.data;
    const slug = slugify(data.name);

    const existingBySlug = await prisma.product.findUnique({ where: { slug } });
    if (existingBySlug) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
    }

    const existingBySku = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existingBySku) {
      return NextResponse.json({ error: 'SKU sudah digunakan' }, { status: 409 });
    }

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    const brand = await prisma.brand.findUnique({
      where: { id: data.brandId },
    });
    if (!brand) {
      return NextResponse.json({ error: 'Merek tidak ditemukan' }, { status: 404 });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku: data.sku,
        description: data.description,
        categoryId: data.categoryId,
        brandId: data.brandId,
        price: data.price,
        salePrice: data.salePrice ?? null,
        weight: data.weight,
        stock: data.stock,
        images: data.images,
        videoUrls: data.videoUrls,
        specs: data.specs as any,
        isActive: data.isActive,
        variants: {
          create: data.variants?.map((v: any) => ({
            name: v.name,
            value: v.value,
            stock: v.stock,
            price: v.price,
            sku: v.sku,
          })) || [],
        },
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        variants: true,
      },
    });

    revalidateCatalog({ productSlug: slug, includeAdmin: true });

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        specs: (product.specs as Record<string, string>) || {},
        reviews: [],
        rating: 0,
        reviewCount: 0,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/products error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan produk' }, { status: 500 });
  }
}
