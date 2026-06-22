'use client';

import { Suspense, lazy, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { mockDashboardStats, mockRevenueData } from '@/lib/mock-admin-data';
import { getAllProducts } from '@/lib/catalog-data';
import type { CatalogProduct } from '@/lib/catalog-data';
import { Download } from 'lucide-react';
import Papa from 'papaparse';

const AdminRevenueChart = lazy(() => import('./revenue-chart').then((m) => ({ default: m.AdminRevenueChart })));
const AdminOrdersChart = lazy(() => import('./orders-chart').then((m) => ({ default: m.AdminOrdersChart })));

export default function AdminReportsPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  useEffect(() => { setProducts(getAllProducts()); }, []);

  const topProducts = [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const summaryCards = [
    { label: 'Total Pendapatan', value: formatPrice(mockDashboardStats.monthlyRevenue) },
    { label: 'Total Produk Terjual', value: topProducts.reduce((s, p) => s + p.sold, 0) },
    { label: 'Total Pesanan', value: mockDashboardStats.totalOrders },
    { label: 'Rata-rata Transaksi', value: formatPrice(mockDashboardStats.totalOrders > 0 ? Math.round(mockDashboardStats.monthlyRevenue / mockDashboardStats.totalOrders) : 0) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Laporan</h1>
        <Badge variant="info">Bulan {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <p className="text-xs text-[#8E8E93] mb-1">{card.label}</p>
              <p className="text-lg font-bold text-[#1C1C1E]">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tren Pendapatan (14 Hari)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Suspense fallback={<div className="h-80 bg-[#F2F2F7] rounded-xl animate-pulse" />}>
              <AdminRevenueChart data={mockRevenueData} />
            </Suspense>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pesanan per Hari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Suspense fallback={<div className="h-72 bg-[#F2F2F7] rounded-xl animate-pulse" />}>
                <AdminOrdersChart data={mockRevenueData} />
              </Suspense>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#E5E5EA] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#8E8E93] w-5">#{i + 1}</span>
                    <p className="text-sm text-[#1C1C1E]">{p.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatPrice(p.salePrice ?? p.price)}</p>
                    <p className="text-xs text-[#8E8E93]">{p.sold} terjual</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Data Stok</span>
            <Button variant="outline" size="sm" onClick={() => exportCSV(products)}>
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E5EA]">
                  <th className="text-left py-2 px-3 text-[#8E8E93] font-medium">Produk</th>
                  <th className="text-right py-2 px-3 text-[#8E8E93] font-medium">SKU</th>
                  <th className="text-right py-2 px-3 text-[#8E8E93] font-medium">Stok</th>
                  <th className="text-right py-2 px-3 text-[#8E8E93] font-medium">Terjual</th>
                  <th className="text-right py-2 px-3 text-[#8E8E93] font-medium">Harga</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-[#E5E5EA] hover:bg-[#F2F2F7]">
                    <td className="py-2 px-3 text-[#1C1C1E]">{p.name}</td>
                    <td className="py-2 px-3 text-right text-[#8E8E93]">{p.sku}</td>
                    <td className="py-2 px-3 text-right">
                      <Badge variant={p.stock <= 5 ? 'destructive' : 'success'}>{p.stock}</Badge>
                    </td>
                    <td className="py-2 px-3 text-right text-[#1C1C1E]">{p.sold}</td>
                    <td className="py-2 px-3 text-right font-semibold">{formatPrice(p.salePrice ?? p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function exportCSV(products: CatalogProduct[]) {
  const rows = products.map((p) => ({
    name: p.name,
    sku: p.sku,
    stock: p.stock,
    sold: p.sold,
    price: p.salePrice ?? p.price,
    category: p.category?.name ?? '',
  }));
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sepedamania-laporan-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
