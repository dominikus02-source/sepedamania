'use client';

import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ShoppingCart, DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';

import type { DashboardStats, RevenuePoint, OrderStatusCount, AdminOrder } from '@/lib/mock-admin-data';

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
  const kpis = [
    { label: 'Pesanan Hari Ini', value: stats.todayOrders, icon: ShoppingCart, color: 'text-[#007AFF]' },
    { label: 'Pendapatan Hari Ini', value: formatPrice(stats.todayRevenue), icon: DollarSign, color: 'text-[#34C759]' },
    { label: 'Total Pesanan', value: stats.totalOrders, icon: Package, color: 'text-[#F5A623]' },
    { label: 'Pendapatan Bulan Ini', value: formatPrice(stats.monthlyRevenue), icon: TrendingUp, color: 'text-[#FF3B30]' },
  ];

  const formatRevenueTick = (val: number) => {
    if (val >= 1_000_000) return `Rp${(val / 1_000_000).toFixed(0)}jt`;
    if (val >= 1_000) return `Rp${(val / 1_000).toFixed(0)}rb`;
    return `Rp${val}`;
  };

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

      {/* Revenue AreaChart - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Pendapatan (14 Hari)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#8E8E93' }}
                  axisLine={{ stroke: '#E5E5EA' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#8E8E93' }}
                  tickFormatter={formatRevenueTick}
                  axisLine={{ stroke: '#E5E5EA' }}
                />
                <Tooltip
                  formatter={(val) => [formatPrice(Number(val)), 'Pendapatan']}
                  labelFormatter={(label) => `Tanggal: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F5A623"
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Orders BarChart + PieChart — Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pesanan per Hari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: '#8E8E93' }}
                    axisLine={{ stroke: '#E5E5EA' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#8E8E93' }}
                    axisLine={{ stroke: '#E5E5EA' }}
                  />
                  <Tooltip
                    formatter={(val) => [Number(val), 'Pesanan']}
                    labelFormatter={(label) => `Tanggal: ${label}`}
                  />
                  <Bar dataKey="orders" fill="#007AFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex flex-col items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusCounts}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {orderStatusCounts.map((entry: OrderStatusCount, index: number) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [Number(val), name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert + Recent Orders — Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {lowStockProducts.length > 0 && (
          <Card className="border-[#FF3B30]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#FF3B30]">
                <AlertTriangle className="w-5 h-5" />
                Stok Kritis ({lowStockProducts.length} produk)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockProducts.map((p) => (
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
              {recentOrders.map((order) => (
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
