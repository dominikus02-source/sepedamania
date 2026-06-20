import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mockProducts } from '@/lib/mock-data';
import { validateOrigin } from '@/lib/csrf';
import { auth } from '@/lib/auth';

const productQuerySchema = z.object({
  q: z.string().optional(),
  categoryId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sort: z.enum(['price_asc', 'price_desc', 'sold', 'rating', 'newest']).optional(),
});

const createProductSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi'),
  sku: z.string().min(1, 'SKU wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  brandId: z.string().min(1, 'Merek wajib dipilih'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  salePrice: z.number().min(0).nullable().optional(),
  weight: z.number().min(0, 'Berat tidak boleh negatif'),
  stock: z.number().int().min(0),
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

  const { q, categoryId, limit, sort } = parsed.data;

  let products = [...mockProducts].filter((p) => p.isActive);

  if (q) {
    const query = q.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
    );
  }

  if (categoryId) {
    products = products.filter((p) => p.categoryId === categoryId);
  }

  if (sort === 'price_asc') products.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  else if (sort === 'price_desc') products.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  else if (sort === 'sold') products.sort((a, b) => b.sold - a.sold);
  else if (sort === 'rating') products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else if (sort === 'newest') products.sort((a, b) => parseInt(b.id.slice(1)) - parseInt(a.id.slice(1)));

  products = products.slice(0, limit);

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = createProductSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: parsed.error.issues },
      { status: 400 },
    );
  }

  return NextResponse.json({ error: 'Database not available. Admin product creation requires DB connection.' }, { status: 503 });
}
