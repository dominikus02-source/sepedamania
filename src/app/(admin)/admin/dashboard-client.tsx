'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';

import { normalizeArray } from '@/lib/safe-array';
import type { DashboardStats, RevenuePoint, OrderStatusCount, AdminOrder } from '@/lib/mock-admin-data';

const RevenueChart = dynamic(() => import('./revenue-chart').then((m) => m.RevenueChart), {
  ssr: false,
  loading: () => <div className="h-64 bg-[#F2F2F7] rounded-xl animate-pulse" />,
});

const OrdersChart = dynamic(() => import('./orders-chart').then((m) => m.OrdersChart), {
  ssr: false,
  loading: () => <div className="h-64 bg-[#F2F2F7] rounded-xl animate-pulse" />,
});

const StatusPieChart = dynamic(() => import('./status-pie-chart').then((m) => m.StatusPieChart), {
  ssr: false,
  loading: () => <div className="h-64 bg-[#F2F2F7] rounded-xl animate-pulse" />,
});

export function AdminDashboard({
  stats,
  revenueData,
  orderStatusCounts,
  recentOrders,
  lowStockProducts,
}: {
  stats: DashboardStats;
  revenueData: RevenuePoint[];
  orderStatusCounts: OrderStatusCount[];
  recentOrders: Partial<AdminOrder>[];
  lowStockProducts: { id: string; name: string; stock: number; price: number; salePrice: number | null }[];
}) {
  const safeRevenueData = normalizeArray<RevenuePoint>(revenueData);
  const safeOrderStatusCounts = normalizeArray<OrderStatusCount>(orderStatusCounts);
  const safeRecentOrders = normalizeArray<Partial<AdminOrder>>(recentOrders);
  const safeLowStockProducts = normalizeArray<{ id: string; name: string; stock: number; price: number; salePrice: number | null }>(lowStockProducts);

  const kpis = [
    { label: 'Pesanan Hari Ini', value: stats.todayOrders, icon: ShoppingCart, color: 'text-[#007AFF]' },
    { label: 'Pendapatan Hari Ini', value: formatPrice(stats.todayRevenue), icon: DollarSign, color: 'text-[#34C759]' },
    { label: 'Total Pesanan', value: stats.totalOrders, icon: Package, color: 'text-[#2563EB]' },
    { label: 'Pendapatan Bulan Ini', value: formatPrice(stats.monthlyRevenue), icon: TrendingUp, color: 'text-[#FF3B30]' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Dashboard</h1>
        <Badge variant="info">
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-[#8E8E93]">{kpi.label}</p>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-xl font-bold text-[#1C1C1E]">{kpi.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Pendapatan (14 Hari)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <RevenueChart data={safeRevenueData} />
          </div>
        </CardContent>
      </Card>

      {/* Orders Chart + Status Pie — Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pesanan per Hari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <OrdersChart data={safeRevenueData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex flex-col items-center">
              <StatusPieChart data={safeOrderStatusCounts} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert + Recent Orders — Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {safeLowStockProducts.length > 0 && (
          <Card className="border-[#FF3B30]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#FF3B30]">
                <AlertTriangle className="w-5 h-5" />
                Stok Kritis ({safeLowStockProducts.length} produk)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {safeLowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <Link
                      href={`/admin/produk/${p.id}`}
                      className="text-[#1C1C1E] hover:text-[#F5A623]"
                    >
                      {p.name}
                    </Link>
                    <Badge variant="destructive">Stok: {p.stock}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safeRecentOrders.map((order) => (
                <Link
                  key={order.id ?? ''}
                  href={`/admin/pesanan/${order.id}`}
                  className="flex items-center justify-between py-2 border-b border-[#E5E5EA] last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">
                      #{order.id?.slice(0, 8) ?? ''}
                    </p>
                    <p className="text-xs text-[#8E8E93]">
                      {order.user?.name || 'Guest'} • {formatDate(order.createdAt ?? '')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatPrice(order.total ?? 0)}</p>
                    <Badge
                      variant={order.paymentStatus === 'PAID' ? 'success' : 'warning'}
                      className="text-[10px]"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
