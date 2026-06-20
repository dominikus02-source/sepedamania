'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { mockDashboardStats, mockRevenueData, mockOrderStatusCounts } from '@/lib/mock-admin-data';
import { mockProducts } from '@/lib/mock-data';
import { Download } from 'lucide-react';
import Papa from 'papaparse';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminReportsPage() {
  const topProducts = [...mockProducts]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const summaryCards = [
    { label: 'Total Pendapatan', value: formatPrice(mockDashboardStats.monthlyRevenue) },
    { label: 'Total Pesanan', value: mockDashboardStats.totalOrders },
    { label: 'Produk Aktif', value: mockDashboardStats.totalProducts },
    { label: 'Pelanggan', value: mockDashboardStats.totalCustomers },
  ];

  const formatRevenueTick = (val: number) => {
    if (val >= 1_000_000) return `Rp${(val / 1_000_000).toFixed(0)}jt`;
    if (val >= 1_000) return `Rp${(val / 1_000).toFixed(0)}rb`;
    return `Rp${val}`;
  };

  const handleExportCSV = () => {
    const csvData = mockRevenueData.map((d) => ({
      Tanggal: d.date,
      Pendapatan: d.revenue,
      Pesanan: d.orders,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'laporan-pendapatan.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Laporan</h1>
        <Badge variant="info">
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-xs text-[#8E8E93] mb-1">{item.label}</p>
              <p className="text-xl font-bold text-[#1C1C1E]">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tren Pendapatan (14 Hari)</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueData}>
                <defs>
                  <linearGradient id="reportRevenueGradient" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(val: any) => [formatPrice(val), 'Pendapatan']}
                  labelFormatter={(label: any) => `Tanggal: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F5A623"
                  fill="url(#reportRevenueGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Orders by Status + Top Products — Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pesanan per Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockOrderStatusCounts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#8E8E93' }}
                    axisLine={{ stroke: '#E5E5EA' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#8E8E93' }}
                    axisLine={{ stroke: '#E5E5EA' }}
                  />
                  <Tooltip
                    formatter={(val: any) => [val, 'Jumlah']}
                    labelFormatter={(label: any) => `Status: ${label}`}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {mockOrderStatusCounts.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#F5A623] text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#1C1C1E]">{p.name}</p>
                      <p className="text-xs text-[#8E8E93]">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1C1C1E]">{p.sold}</p>
                    <p className="text-xs text-[#8E8E93]">terjual</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
