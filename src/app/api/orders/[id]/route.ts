import { NextResponse } from 'next/server';
import { getMockOrder, updateMockOrderPayment } from '@/lib/mock-orders';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getMockOrder(id);
  if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const updated = updateMockOrderPayment(id, body.paymentStatus, body.status);
  if (!updated) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
  return NextResponse.json(updated);
}
