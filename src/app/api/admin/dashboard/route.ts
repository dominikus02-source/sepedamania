import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayOrders, monthlyRevenue, totalOrders, totalProducts, totalCustomers] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID', createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) } } }),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
  ]);

  return NextResponse.json({
    todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total), 0),
    todayOrders: todayOrders.length,
    monthlyRevenue: Number(monthlyRevenue._sum.total || 0),
    totalOrders,
    totalProducts,
    totalCustomers,
  });
}
