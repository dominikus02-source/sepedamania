import type { Metadata } from 'next';
import { AdminDashboard } from './dashboard-client';
import { getDashboardData, EMPTY_DASHBOARD } from '@/lib/admin-analytics';

export const metadata: Metadata = {
  title: 'Dashboard Admin',
  description: 'Panel admin SEPEDAMANIA — kelola produk, pesanan, stok, laporan, dan pengaturan toko.',
  robots: { index: false, follow: false },
};

// Figures must reflect the current database, never a cached snapshot.
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let data = EMPTY_DASHBOARD;
  let error = '';

  try {
    data = await getDashboardData();
  } catch (err) {
    console.error('Admin dashboard load failed:', err);
    error = err instanceof Error ? err.message : 'Gagal memuat data dashboard';
  }

  return (
    <>
      {error && (
        <div className="mb-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3 text-sm text-[#991B1B]">
          Gagal memuat data dashboard. Angka di bawah belum tentu akurat.
        </div>
      )}
      <AdminDashboard
        stats={data.stats}
        revenueData={data.revenueData}
        orderStatusCounts={data.orderStatusCounts}
        recentOrders={data.recentOrders}
        lowStockProducts={data.lowStockProducts}
      />
    </>
  );
}
