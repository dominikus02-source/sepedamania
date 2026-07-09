'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatPrice, formatDateShort } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AdminOrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  guestName: string | null;
  guestEmail: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  items: AdminOrderItem[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Menunggu Pembayaran',
  PAID: 'Dibayar',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Selesai',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
  REFUNDED: 'Refund',
};

const PAYMENT_LABELS: Record<string, string> = {
  PAID: 'Lunas',
  UNPAID: 'Belum Dibayar',
  EXPIRED: 'Kadaluarsa',
  FAILED: 'Gagal',
  CANCELLED: 'Dibatalkan',
  REFUNDED: 'Refund',
};

function badgeVariant(status: string) {
  if (['DELIVERED', 'COMPLETED'].includes(status)) return 'success';
  if (['CANCELLED', 'REFUNDED'].includes(status)) return 'destructive';
  if (status === 'SHIPPED') return 'primary';
  if (['PAID', 'PROCESSING'].includes(status)) return 'info';
  return 'warning';
}

function paymentBadgeVariant(status: string) {
  if (status === 'PAID') return 'success';
  if (status === 'UNPAID') return 'warning';
  return 'destructive';
}

export function AdminOrdersClient({ orders = [] }: { orders: AdminOrder[] }) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [payment, setPayment] = useState('');

  const filtered = useMemo(() => {
    let result = [...orders];
    if (q) {
      const query = q.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          (o.guestName || '').toLowerCase().includes(query) ||
          (o.guestEmail || '').toLowerCase().includes(query),
      );
    }
    if (status) {
      result = result.filter((o) => o.status === status);
    }
    if (payment) {
      result = result.filter((o) => o.paymentStatus === payment);
    }
    return result;
  }, [orders, q, status, payment]);

  if (orders.length === 0 && !q && !status && !payment) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1E] mb-6">Pesanan</h1>
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-12 text-center">
          <p className="text-[#8E8E93] text-sm">Belum ada pesanan</p>
        </div>
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
            placeholder="Cari no. pesanan atau pelanggan..."
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
              { value: 'PAID', label: 'Dibayar' },
              { value: 'PROCESSING', label: 'Diproses' },
              { value: 'SHIPPED', label: 'Dikirim' },
              { value: 'DELIVERED', label: 'Selesai' },
              { value: 'CANCELLED', label: 'Dibatalkan' },
              { value: 'REFUNDED', label: 'Refund' },
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
              { value: 'EXPIRED', label: 'Kadaluarsa' },
              { value: 'FAILED', label: 'Gagal' },
              { value: 'REFUNDED', label: 'Refund' },
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
                  <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">Pesanan</th>
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
                      <span className="font-mono font-bold text-xs text-[#1C1C1E]">#{o.orderNumber}</span>
                    </td>
                    <td className="p-3 text-[#8E8E93] text-xs whitespace-nowrap">{formatDateShort(o.createdAt)}</td>
                    <td className="p-3 text-[#1C1C1E] text-sm font-medium">{o.guestName || o.guestEmail || '-'}</td>
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
