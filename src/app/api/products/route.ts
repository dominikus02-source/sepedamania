import { NextResponse } from 'next/server';
import { mockProducts, mockCategories } from '@/lib/mock-data';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const categoryId = searchParams.get('categoryId');
  const limit = Number(searchParams.get('limit') || '50');
  const sort = searchParams.get('sort');

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
  return NextResponse.json({ error: 'Database not available. Admin product creation requires DB connection.' }, { status: 503 });
}
