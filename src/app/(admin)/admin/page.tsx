import { AdminDashboard } from './dashboard-client';
import { mockDashboardStats, mockRevenueData, mockOrderStatusCounts, mockOrders } from '@/lib/mock-admin-data';
import { mockProducts } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const lowStockProducts = mockProducts
    .filter((p) => p.stock <= 5)
    .map((p) => ({ ...p, price: Number(p.price), salePrice: p.salePrice ? Number(p.salePrice) : null }));

  const recentOrders = mockOrders.slice(0, 5).map((order) => ({
    ...order,
    user: { name: order.user.name },
  }));

  return (
    <AdminDashboard
      stats={mockDashboardStats}
      revenueData={mockRevenueData}
      orderStatusCounts={mockOrderStatusCounts}
      recentOrders={recentOrders as any}
      lowStockProducts={lowStockProducts}
    />
  );
}
