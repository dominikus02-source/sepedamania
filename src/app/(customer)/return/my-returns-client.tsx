'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ReturnStatusBadge } from '@/components/return/return-status-badge';
import { ReturnReasonLabel } from '@/components/return/return-reason-label';
import { Loader2, Package, ChevronRight, RefreshCw } from 'lucide-react';
import type { MockReturnRequest } from '@/lib/mock-returns';
import { RESOLUTION_LABELS } from '@/lib/mock-returns';

export function MyReturnsClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [returns, setReturns] = useState<MockReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }
    if (status !== 'authenticated') return;

    fetch('/api/returns')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const list: MockReturnRequest[] = Array.isArray(data) ? data : data.returns ?? [];
        list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReturns(list);
      })
      .catch((err) => {
        setError(err.message || 'Gagal memuat data pengembalian');
      })
      .finally(() => setLoading(false));
  }, [status]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5A623] mx-auto mb-3" />
          <p className="text-sm text-[#8E8E93]">Memuat pengembalian...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="py-10">
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="Masuk untuk Melihat Pengembalian"
          description="Silakan masuk terlebih dahulu untuk melihat status pengembalian barang Anda."
          action={
            <Link href="/masuk?callbackUrl=/return">
              <Button variant="accent">Masuk</Button>
            </Link>
          }
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-10">
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="Gagal Memuat Data"
          description={error}
          action={
            <Button
              variant="accent"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Coba Lagi
            </Button>
          }
        />
      </div>
    );
  }

  // Empty state
  if (returns.length === 0) {
    return (
      <div className="py-10">
        <h1 className="text-2xl font-bold text-[#1C1C1E] mb-6 font-display">
          Pengembalian Barang
        </h1>
        <EmptyState
          icon={<RefreshCw className="w-8 h-8" />}
          title="Belum Ada Pengembalian"
          description="Kamu belum melakukan pengembalian barang apapun."
          action={
            <Link href="/pesanan">
              <Button variant="accent">Pergi ke Pesanan</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-6 font-display">
        Pengembalian Barang
      </h1>

      <div className="space-y-3">
        {returns.map((ret) => (
          <Link
            key={ret.id}
            href={`/return/${ret.returnNumber}`}
            className="block bg-white rounded-2xl border border-[#E5E5EA] shadow-sm card-hover overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5EA] bg-[#F9FAFB]">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#6B7280]" />
                <span className="text-xs text-[#6B7280] font-medium">
                  {formatDate(ret.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ReturnStatusBadge status={ret.status} />
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </div>
            </div>

            {/* Body */}
            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1C1C1E]">{ret.returnNumber}</span>
                <span className="text-xs text-[#8E8E93]">
                  Pesanan #{ret.orderId.slice(0, 8)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
                <span>Alasan: <ReturnReasonLabel reason={ret.reason} /></span>
                <span className="text-[#E5E5EA]">|</span>
                <span>Resolusi: {RESOLUTION_LABELS[ret.preferredResolution]}</span>
              </div>
              {ret.items && ret.items.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1">
                  {ret.items.slice(0, 3).map((item, i) => (
                    <div
                      key={item.productId + i}
                      className="w-8 h-8 rounded-lg bg-[#F2F2F7] overflow-hidden flex-shrink-0 border border-[#E5E5EA]"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-[#C7C7CC]" />
                        </div>
                      )}
                    </div>
                  ))}
                  {ret.items.length > 3 && (
                    <span className="text-xs text-[#8E8E93] ml-1">
                      +{ret.items.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
