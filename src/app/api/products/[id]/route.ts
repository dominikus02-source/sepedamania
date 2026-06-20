import { NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mock-data';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(_req: Request, _context: { params: Promise<{ id: string }> }) {
  void _req;
  void _context;
  return NextResponse.json({ error: 'Database not available' }, { status: 503 });
}

export async function DELETE(_req: Request, _context: { params: Promise<{ id: string }> }) {
  void _req;
  void _context;
  return NextResponse.json({ error: 'Database not available' }, { status: 503 });
}
