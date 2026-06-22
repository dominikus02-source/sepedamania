'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getAllMockReturns } from '@/lib/mock-returns';
import { RETURN_STATUS_LABELS, RETURN_REASON_LABELS } from '@/lib/mock-returns';
import type { MockReturnRequest } from '@/lib/mock-returns';
import { AdminStore } from '@/lib/admin-store';
import type { AdminOrder } from '@/lib/admin-store';
import { formatDateShort } from '@/lib/utils';
import { ReturnStatusBadge } from '@/components/return/return-status-badge';
import { ReturnReasonLabel } from '@/components/return/return-reason-label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Search, RotateCcw, ChevronRight } from 'lucide-react';

// ─── Resolution Labels ─────────────────────────────────────────────────────

const RESOLUTION_LABELS: Record<string, string> = {
  REFUND: 'Refund',
  REPLACEMENT: 'Penggantian Barang',
  STORE_CREDIT: 'Kredit Toko',
  ADMIN_HELP: 'Bantuan Admin',
};

// ─── Status filter options ─────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  ...Object.entries(RETURN_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

// ─── Reason filter options ─────────────────────────────────────────────────

const REASON_OPTIONS = [
  { value: '', label: 'Semua Alasan' },
  ...Object.entries(RETURN_REASON_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

// ─── Page Component ────────────────────────────────────────────────────────

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<MockReturnRequest[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    setReturns(getAllMockReturns());
    setOrders(AdminStore.getOrders());
    setLoading(false);
  }, []);

  // Build a map for quick order lookup
  const orderLookup = useMemo(() => {
    const map = new Map<string, AdminOrder>();
    orders.forEach((o) => map.set(o.id, o));
    return map;
  }, [orders]);

  // Filtered & sorted list
  const filtered = useMemo(() => {
    let result = [...returns];

    if (q) {
      const query = q.toLowerCase();
      result = result.filter((ret) => {
        const order = orderLookup.get(ret.orderId);
        const customerName = order?.user?.name?.toLowerCase() ?? '';
        return (
          ret.returnNumber.toLowerCase().includes(query) ||
          ret.orderId.toLowerCase().includes(query) ||
          customerName.includes(query)
        );
      });
    }

    if (status) {
      result = result.filter((ret) => ret.status === status);
    }

    if (reason) {
      result = result.filter((ret) => ret.reason === reason);
    }

    // Newest first
    result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return result;
  }, [returns, q, status, reason, orderLookup]);

  // ─── Render helpers ─────────────────────────────────────────────────────

  const hasFilters = q || status || reason;
  const resetFilters = () => {
    setQ('');
    setStatus('');
    setReason('');
  };

  // ─── Loading state ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-[#F2F2F7] rounded animate-pulse" />
        <div className="h-10 w-full bg-[#F2F2F7] rounded animate-pulse" />
        <div className="h-64 bg-[#F2F2F7] rounded animate-pulse" />
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
          <RotateCcw className="w-5 h-5 text-[#F5A623]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Pengembalian Barang</h1>
          <p className="text-sm text-[#8E8E93] mt-0.5">
            {returns.length} total pengajuan
            {filtered.length !== returns.length && ` · ${filtered.length} ditampilkan`}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
          <Input
            placeholder="Cari nomor retur, ID pesanan, atau pelanggan..."
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="w-[180px]">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={STATUS_OPTIONS}
          />
        </div>
        <div className="w-[200px]">
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={REASON_OPTIONS}
          />
        </div>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center h-10 px-3 text-sm text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#F2F2F7] flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-[#8E8E93]" />
          </div>
          <p className="text-[#8E8E93] text-sm font-medium">
            {hasFilters
              ? 'Tidak ada pengembalian yang sesuai filter'
              : 'Belum ada pengajuan pengembalian'}
          </p>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="mt-3 text-sm text-[#F5A623] hover:text-[#F5A623]/80 transition-colors font-medium"
            >
              Reset filter
            </button>
          )}
        </div>
      )}

      {filtered.length > 0 && (
        <>
          {/* ── Desktop table ─────────────────────────────────────────────── */}
          <div className="hidden md:block bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
                    <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                      No. Retur
                    </th>
                    <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                      Pesanan
                    </th>
                    <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                      Alasan
                    </th>
                    <th className="text-center p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-center p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                      Resolusi
                    </th>
                    <th className="text-left p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="text-right p-3 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ret) => {
                    const order = orderLookup.get(ret.orderId);
                    const customerName = order?.user?.name ?? '—';
                    return (
                      <tr
                        key={ret.id}
                        className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50 transition-colors"
                      >
                        <td className="p-3">
                          <span className="font-mono text-xs font-bold text-[#1C1C1E]">
                            {ret.returnNumber}
                          </span>
                        </td>
                        <td className="p-3">
                          <Link
                            href={`/admin/pesanan/${ret.orderId}`}
                            className="font-mono text-xs text-[#F5A623] hover:text-[#F5A623]/80 transition-colors"
                          >
                            #{ret.orderId.slice(0, 12)}...
                          </Link>
                        </td>
                        <td className="p-3 text-sm font-medium text-[#1C1C1E]">
                          {customerName}
                        </td>
                        <td className="p-3">
                          <ReturnReasonLabel reason={ret.reason} />
                        </td>
                        <td className="p-3 text-center">
                          <ReturnStatusBadge status={ret.status} />
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-xs text-[#8E8E93]">
                            {RESOLUTION_LABELS[ret.preferredResolution] ?? ret.preferredResolution}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-[#8E8E93] whitespace-nowrap">
                          {formatDateShort(ret.createdAt)}
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            href={`/admin/pengembalian/${ret.returnNumber}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#F5A623] hover:text-[#F5A623]/80 transition-colors"
                          >
                            Detail
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile cards ──────────────────────────────────────────────── */}
          <div className="md:hidden space-y-3">
            {filtered.map((ret) => {
              const order = orderLookup.get(ret.orderId);
              const customerName = order?.user?.name ?? '—';
              return (
                <Link
                  key={ret.id}
                  href={`/admin/pengembalian/${ret.returnNumber}`}
                  className="block bg-white rounded-xl border border-[#E5E5EA] p-4 hover:border-[#F5A623]/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <span className="font-mono text-xs font-bold text-[#1C1C1E]">
                        {ret.returnNumber}
                      </span>
                      <p className="text-sm font-medium text-[#1C1C1E]">{customerName}</p>
                    </div>
                    <ReturnStatusBadge status={ret.status} />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#8E8E93]">
                    <span>#{ret.orderId.slice(0, 12)}...</span>
                    <span>&middot;</span>
                    <span>{formatDateShort(ret.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <ReturnReasonLabel reason={ret.reason} />
                    <span className="text-xs text-[#8E8E93]">&middot;</span>
                    <span className="text-xs text-[#8E8E93]">
                      {RESOLUTION_LABELS[ret.preferredResolution] ?? ret.preferredResolution}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E5EA]">
                    <span className="text-xs text-[#8E8E93]">Lihat detail</span>
                    <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
