import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const productQuerySchema = z.object({
  q: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sort: z.enum(['price_asc', 'price_desc', 'sold', 'rating', 'newest']).optional(),
});

const createProductSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  sku: z.string().min(1, 'SKU wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  brandId: z.string().min(1, 'Merek wajib dipilih'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  salePrice: z.number().min(0).nullable().optional(),
  weight: z.number().min(0, 'Berat tidak boleh negatif'),
  stock: z.number().int().min(0),
  images: z.array(z.string()).default([]),
  videoUrls: z.array(z.string()).default([]),
  specs: z.record(z.string(), z.string()).default({}),
  isActive: z.boolean().default(true),
});

export async function GET(_req: Request) {
  const { searchParams } = new URL(_req.url);
  const parsed = productQuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { q, categoryId, brandId, limit, sort } = parsed.data;

  try {
    const where: Record<string, unknown> = { isActive: true };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;

    const orderBy: Record<string, string>[] = [];
    if (sort === 'price_asc') orderBy.push({ price: 'asc' });
    else if (sort === 'price_desc') orderBy.push({ price: 'desc' });
    else if (sort === 'sold') orderBy.push({ sold: 'desc' });
    else if (sort === 'rating') orderBy.push({ sold: 'desc' });
    else orderBy.push({ createdAt: 'desc' });

    const products = await prisma.product.findMany({
      where: where as any,
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
      videoUrls: [] as string[],
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

    return NextResponse.json({ products: mapped });
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
      { status: 400 },
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
        specs: data.specs as any,
        isActive: data.isActive,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        videoUrls: [],
        specs: (product.specs as Record<string, string>) || {},
        variants: [],
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
