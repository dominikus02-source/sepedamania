// Server-only: imports the Prisma client. Call from server components or route
// handlers, never from a client component.
import { prisma } from '@/lib/prisma';
import { orderStatusColor, orderStatusLabel } from '@/lib/order-status';

/** Orders at or below this stock level show up in the low-stock panel. */
export const LOW_STOCK_THRESHOLD = 5;

/** Days covered by the revenue/orders chart. */
const CHART_DAYS = 14;

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStock: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
  label: string;
  color: string;
}

export interface DashboardOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  customerName: string;
  createdAt: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  stock: number;
  price: number;
  salePrice: number | null;
  images: string[];
}

export interface TopProduct {
  id: string;
  name: string;
  slug: string;
  sold: number;
  price: number;
  stock: number;
}

export interface DashboardData {
  stats: DashboardStats;
  revenueData: RevenuePoint[];
  orderStatusCounts: OrderStatusCount[];
  recentOrders: DashboardOrder[];
  lowStockProducts: LowStockProduct[];
  topProducts: TopProduct[];
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Local YYYY-MM-DD. Avoids toISOString(), which would shift dates in UTC+7. */
function dateKey(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/** Revenue counts only orders that were actually paid for. */
const PAID = { paymentStatus: 'PAID' as const };

export const EMPTY_DASHBOARD: DashboardData = {
  stats: {
    todayOrders: 0, todayRevenue: 0, weeklyRevenue: 0, monthlyRevenue: 0,
    totalOrders: 0, totalProducts: 0, totalCustomers: 0, lowStock: 0,
  },
  revenueData: [],
  orderStatusCounts: [],
  recentOrders: [],
  lowStockProducts: [],
  topProducts: [],
};

/**
 * One round of queries backing both the dashboard (server component) and the
 * reports page (via /api/admin/dashboard), so the two can never disagree.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const today = startOfDay(new Date());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const chartStart = new Date(today);
  chartStart.setDate(chartStart.getDate() - (CHART_DAYS - 1));

  const [
    todayOrders,
    weekly,
    monthly,
    totalOrders,
    totalProducts,
    totalCustomers,
    lowStockCount,
    statusGroups,
    chartOrders,
    recent,
    lowStockProducts,
    topProducts,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: today } },
      select: { total: true, paymentStatus: true },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { ...PAID, createdAt: { gte: weekAgo } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { ...PAID, createdAt: { gte: monthStart } },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { isActive: true, stock: { lte: LOW_STOCK_THRESHOLD } } }),
    prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.order.findMany({
      where: { createdAt: { gte: chartStart } },
      select: { total: true, createdAt: true, paymentStatus: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true, orderNumber: true, status: true, paymentStatus: true,
        total: true, createdAt: true, guestName: true, guestEmail: true,
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: LOW_STOCK_THRESHOLD } },
      orderBy: { stock: 'asc' },
      take: 10,
      select: {
        id: true, name: true, slug: true, stock: true,
        price: true, salePrice: true, images: true,
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { sold: 'desc' },
      take: 5,
      select: { id: true, name: true, slug: true, sold: true, price: true, stock: true },
    }),
  ]);

  // Seed every day in range so the chart has no gaps on quiet days.
  const buckets = new Map<string, RevenuePoint>();
  for (let i = 0; i < CHART_DAYS; i++) {
    const d = new Date(chartStart);
    d.setDate(d.getDate() + i);
    buckets.set(dateKey(d), { date: dateKey(d), revenue: 0, orders: 0 });
  }
  for (const order of chartOrders) {
    const bucket = buckets.get(dateKey(order.createdAt));
    if (!bucket) continue;
    bucket.orders += 1;
    if (order.paymentStatus === 'PAID') bucket.revenue += Number(order.total);
  }

  return {
    stats: {
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders
        .filter((o) => o.paymentStatus === 'PAID')
        .reduce((sum, o) => sum + Number(o.total), 0),
      weeklyRevenue: Number(weekly._sum.total ?? 0),
      monthlyRevenue: Number(monthly._sum.total ?? 0),
      totalOrders,
      totalProducts,
      totalCustomers,
      lowStock: lowStockCount,
    },
    revenueData: [...buckets.values()],
    orderStatusCounts: statusGroups.map((g) => ({
      status: g.status,
      count: g._count._all,
      label: orderStatusLabel(g.status),
      color: orderStatusColor(g.status),
    })),
    recentOrders: recent.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      paymentStatus: o.paymentStatus,
      total: Number(o.total),
      // Guest checkout leaves `user` null, so fall back to the guest fields.
      customerName: o.user?.name || o.guestName || o.user?.email || o.guestEmail || 'Pelanggan',
      createdAt: o.createdAt.toISOString(),
    })),
    lowStockProducts: lowStockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      stock: p.stock,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      images: p.images,
    })),
    topProducts: topProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sold: p.sold,
      price: Number(p.price),
      stock: p.stock,
    })),
  };
}
