import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let stats = {
    todayRevenue: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, monthlyRevenue, totalOrders, totalProducts, totalCustomers] = await Promise.all([
      prisma.order.findMany({ where: { createdAt: { gte: today } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID', createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) } } }),
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ]);

    stats = {
      todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total), 0),
      todayOrders: todayOrders.length,
      monthlyRevenue: Number(monthlyRevenue._sum.total || 0),
      totalOrders,
      totalProducts,
      totalCustomers,
    };
  } catch {
    // Database unavailable — return empty stats
  }

  return NextResponse.json(stats);
}
