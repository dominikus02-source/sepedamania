import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(brands);
}
