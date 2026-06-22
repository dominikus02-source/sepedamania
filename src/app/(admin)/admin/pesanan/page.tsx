'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdminOrders } from '@/lib/admin-store';
import { formatPrice, formatDateShort } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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
  return 'warning';
}

function paymentBadgeVariant(status: string) {
  if (status === 'PAID') return 'success';
  if (status === 'UNPAID') return 'warning';
  return 'destructive';
}

export default function AdminOrdersPage() {
  const { orders, loading } = useAdminOrders();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [payment, setPayment] = useState('');

  const filtered = useMemo(() => {
    let result = [...orders];
    if (q) {
      const query = q.toLowerCase();
      result = result.filter((o) => o.id.toLowerCase().includes(query) || o.user.name.toLowerCase().includes(query));
    }
    if (status) {
      result = result.filter((o) => o.status === status);
    }
    if (payment) {
      result = result.filter((o) => o.paymentStatus === payment);
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [orders, q, status, payment]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-[#F2F2F7] rounded animate-pulse" />
        <div className="h-10 w-full bg-[#F2F2F7] rounded animate-pulse" />
        <div className="h-64 bg-[#F2F2F7] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-6">Pesanan</h1>

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
          <Input
            placeholder="Cari ID atau nama pelanggan..."
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="w-[200px]">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: '', label: 'Semua Status' },
              { value: 'PENDING_PAYMENT', label: 'Menunggu Pembayaran' },
              { value: 'PROCESSING', label: 'Diproses' },
              { value: 'SHIPPED', label: 'Dikirim' },
              { value: 'DELIVERED', label: 'Selesai' },
              { value: 'CANCELLED', label: 'Dibatalkan' },
            ]}
          />
        </div>
        <div className="w-[200px]">
          <Select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            options={[
              { value: '', label: 'Semua Pembayaran' },
              { value: 'PAID', label: 'Lunas' },
              { value: 'UNPAID', label: 'Belum Dibayar' },
              { value: 'FAILED', label: 'Gagal' },
            ]}
          />
        </div>
        {(q || status || payment) && (
          <button
            onClick={() => { setQ(''); setStatus(''); setPayment(''); }}
            className="inline-flex items-center h-10 px-3 text-sm text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-12 text-center">
          <p className="text-[#8E8E93] text-sm">Tidak ada pesanan ditemukan</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
                  <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">Order ID</th>
                  <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">Tanggal</th>
                  <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">Pelanggan</th>
                  <th className="text-right p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">Total</th>
                  <th className="text-center p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">Status</th>
                  <th className="text-center p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">Pembayaran</th>
                  <th className="text-right p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50 transition-colors">
                    <td className="p-3">
                      <span className="font-mono font-bold text-xs text-[#1C1C1E]">#{o.id}</span>
                    </td>
                    <td className="p-3 text-[#8E8E93] text-xs whitespace-nowrap">{formatDateShort(o.createdAt)}</td>
                    <td className="p-3 text-[#1C1C1E] text-sm font-medium">{o.user.name}</td>
                    <td className="p-3 text-right font-semibold text-sm text-[#1C1C1E] whitespace-nowrap">{formatPrice(o.total)}</td>
                    <td className="p-3 text-center">
                      <Badge variant={badgeVariant(o.status) as 'success' | 'destructive' | 'primary' | 'info' | 'warning'}>
                        {STATUS_LABELS[o.status] || o.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={paymentBadgeVariant(o.paymentStatus) as 'success' | 'destructive' | 'primary' | 'info' | 'warning'}>
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
