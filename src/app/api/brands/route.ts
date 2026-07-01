import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(brands, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('GET /api/brands error:', err);
    return NextResponse.json({ error: 'Gagal mengambil merek' }, { status: 500 });
  }
}
