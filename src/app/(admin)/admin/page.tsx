import type { Metadata } from 'next';
import { AdminDashboard } from './dashboard-client';
import { mockDashboardStats, mockRevenueData, mockOrderStatusCounts, mockOrders } from '@/lib/mock-admin-data';
import { mockProducts } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Dashboard Admin',
  description: 'Panel admin SEPEDAMANIA — kelola produk, pesanan, stok, laporan, dan pengaturan toko.',
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  const lowStockProducts = mockProducts
    .filter((p) => p.stock <= 5)
    .map((p) => ({ ...p, price: Number(p.price), salePrice: p.salePrice ? Number(p.salePrice) : null }));

  const recentOrders = mockOrders.slice(0, 5).map((order) => ({
    ...order,
    user: { ...order.user },
  }));

  return (
    <AdminDashboard
      stats={mockDashboardStats}
      revenueData={mockRevenueData}
      orderStatusCounts={mockOrderStatusCounts}
      recentOrders={recentOrders}
      lowStockProducts={lowStockProducts}
    />
  );
}
