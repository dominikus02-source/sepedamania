import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'list') {
      const users = await prisma.user.findMany({
        take: 5,
        select: { id: true, name: true, email: true, role: true },
      });
      const orders = await prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          userId: true,
          status: true,
          paymentStatus: true,
          paidAt: true,
          completedAt: true,
          createdAt: true,
          total: true,
        },
      });
      return NextResponse.json({ users, orders });
    }

    if (action === 'prepare') {
      const { orderNumber, email } = body;
      if (!orderNumber) {
        return NextResponse.json({ error: 'orderNumber required' }, { status: 400 });
      }

      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const updated = await prisma.order.update({
        where: { orderNumber },
        data: {
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          paidAt: new Date(),
          completedAt: new Date(),
          updatedAt: new Date(),
        },
        select: {
          orderNumber: true,
          status: true,
          paymentStatus: true,
          paidAt: true,
          completedAt: true,
          userId: true,
          total: true,
        },
      });

      return NextResponse.json({ order: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
