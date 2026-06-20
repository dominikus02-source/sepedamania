import Link from 'next/link';
import { mockOrders } from '@/lib/mock-admin-data';
import { formatPrice, formatDateShort } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Menunggu Pembayaran',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

const PAYMENT_LABELS: Record<string, string> = {
  PAID: 'Lunas',
  UNPAID: 'Belum Dibayar',
  FAILED: 'Gagal',
};

function badgeVariant(status: string) {
  if (status === 'DELIVERED') return 'success';
  if (status === 'CANCELLED') return 'destructive';
  if (status === 'SHIPPED') return 'primary';
  if (status === 'PROCESSING') return 'info';
  return 'warning'; // PENDING_PAYMENT
}

function paymentBadgeVariant(status: string) {
  if (status === 'PAID') return 'success';
  if (status === 'UNPAID') return 'warning';
  return 'destructive'; // FAILED
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; payment?: string }>;
}) {
  const { q, status, payment } = await searchParams;

  let orders = [...mockOrders];

  // Apply search filter
  if (q) {
    const query = q.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.user.name.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  // Apply payment status filter
  if (payment) {
    orders = orders.filter((o) => o.paymentStatus === payment);
  }

  // Sort by newest first
  orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-6">Pesanan</h1>

      {/* Filters */}
      <form className="flex flex-wrap items-end gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
          <Input
            name="q"
            placeholder="Cari ID atau nama pelanggan..."
            className="pl-9"
            defaultValue={q}
          />
        </div>

        {/* Status filter */}
        <div className="w-[200px]">
          <select
            name="status"
            className="flex h-10 w-full rounded-lg border border-[#E5E5EA] bg-white px-3 py-2 text-sm text-[#1C1C1E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] transition-all duration-200"
            defaultValue={status || ''}
            onChange={(e) => {
              const form = e.currentTarget.closest('form');
              if (form) form.submit();
            }}
          >
            <option value="">Semua Status</option>
            <option value="PENDING_PAYMENT">Menunggu Pembayaran</option>
            <option value="PROCESSING">Diproses</option>
            <option value="SHIPPED">Dikirim</option>
            <option value="DELIVERED">Selesai</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </div>

        {/* Payment status filter */}
        <div className="w-[200px]">
          <select
            name="payment"
            className="flex h-10 w-full rounded-lg border border-[#E5E5EA] bg-white px-3 py-2 text-sm text-[#1C1C1E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] transition-all duration-200"
            defaultValue={payment || ''}
            onChange={(e) => {
              const form = e.currentTarget.closest('form');
              if (form) form.submit();
            }}
          >
            <option value="">Semua Pembayaran</option>
            <option value="PAID">Lunas</option>
            <option value="UNPAID">Belum Dibayar</option>
            <option value="FAILED">Gagal</option>
          </select>
        </div>

        <button type="submit" className="hidden">
          Filter
        </button>

        {(q || status || payment) && (
          <Link
            href="/admin/pesanan"
            className="inline-flex items-center h-10 px-3 text-sm text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
          >
            Reset
          </Link>
        )}
      </form>

      {/* Orders table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-12 text-center">
          <p className="text-[#8E8E93] text-sm">Tidak ada pesanan ditemukan</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
                  <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="text-right p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-center p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="text-right p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50 transition-colors"
                  >
                    <td className="p-3">
                      <span className="font-mono font-bold text-xs text-[#1C1C1E]">
                        #{o.id}
                      </span>
                    </td>
                    <td className="p-3 text-[#8E8E93] text-xs whitespace-nowrap">
                      {formatDateShort(o.createdAt)}
                    </td>
                    <td className="p-3 text-[#1C1C1E] text-sm font-medium">
                      {o.user.name}
                    </td>
                    <td className="p-3 text-right font-semibold text-sm text-[#1C1C1E] whitespace-nowrap">
                      {formatPrice(o.total)}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={badgeVariant(o.status) as any}>
                        {STATUS_LABELS[o.status] || o.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        variant={paymentBadgeVariant(o.paymentStatus) as any}
                      >
                        {PAYMENT_LABELS[o.paymentStatus] || o.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/pesanan/${o.id}`}
                        className="text-xs font-medium text-[#F5A623] hover:text-[#F5A623]/80 transition-colors"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
