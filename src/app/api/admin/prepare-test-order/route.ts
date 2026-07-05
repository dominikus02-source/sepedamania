import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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
          guestEmail: true,
          status: true,
          paymentStatus: true,
          paidAt: true,
          completedAt: true,
          createdAt: true,
          total: true,
        },
      });
      const products = await prisma.product.findMany({
        take: 5,
        select: { id: true, name: true, slug: true, price: true },
      });
      return NextResponse.json({ users, orders, products });
    }

    if (action === 'prepare') {
      const { orderNumber } = body;
      if (!orderNumber) {
        return NextResponse.json({ error: 'orderNumber required' }, { status: 400 });
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
          guestEmail: true,
          total: true,
        },
      });

      return NextResponse.json({ order: updated });
    }

    if (action === 'create-test-user') {
      const { email, name, password } = body;
      if (!email || !name || !password) {
        return NextResponse.json({ error: 'email, name, password required' }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ user: existing, message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { email, name, password: hashedPassword, role: 'CUSTOMER' },
        select: { id: true, name: true, email: true, role: true },
      });

      return NextResponse.json({ user });
    }

    if (action === 'link-order') {
      const { orderNumber, email } = body;
      if (!orderNumber || !email) {
        return NextResponse.json({ error: 'orderNumber and email required' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const updated = await prisma.order.update({
        where: { orderNumber },
        data: {
          userId: user.id,
          guestEmail: email,
        },
        select: {
          orderNumber: true,
          userId: true,
          guestEmail: true,
          status: true,
          paymentStatus: true,
        },
      });

      return NextResponse.json({ order: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
