import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        variants: true,
        reviews: {
          select: { id: true, rating: true, comment: true, images: true, createdAt: true, userId: true },
        },
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
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (err) {
    console.error('GET /api/admin/products error:', err);
    return NextResponse.json({ error: 'Gagal mengambil produk' }, { status: 500 });
  }
}
