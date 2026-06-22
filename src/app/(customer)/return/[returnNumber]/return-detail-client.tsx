'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDate, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ReturnStatusBadge } from '@/components/return/return-status-badge';
import { ReturnTimeline } from '@/components/return/return-timeline';
import { ReturnReasonLabel } from '@/components/return/return-reason-label';
import { useToast } from '@/components/ui/toaster';
import {
  Loader2,
  ArrowLeft,
  Package,
  MessageCircle,
  Trash2,
  FileText,
  Camera,
  Info,
  ExternalLink,
  XCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import type { MockReturnRequest } from '@/lib/mock-returns';
import { RESOLUTION_LABELS } from '@/lib/mock-returns';

export function ReturnDetailClient({ returnNumber }: { returnNumber: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const [returnData, setReturnData] = useState<MockReturnRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/returns/${returnNumber}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setReturnData(data);
      })
      .catch((err) => {
        setError(err.message || 'Gagal memuat detail pengembalian');
      })
      .finally(() => setLoading(false));
  }, [returnNumber]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/returns/${returnNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReturnData(data);
      toast('Pengembalian berhasil dibatalkan', 'success');
      setCancelDialogOpen(false);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Gagal membatalkan pengembalian',
        'error'
      );
    } finally {
      setCancelling(false);
    }
  };

  const canCancel =
    returnData &&
    (returnData.status === 'REQUESTED' || returnData.status === 'UNDER_REVIEW');

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5A623] mx-auto mb-3" />
          <p className="text-sm text-[#8E8E93]">Memuat detail pengembalian...</p>
        </div>
      </div>
    );
  }

  // Error / not found
  if (error || !returnData) {
    return (
      <div className="text-center py-20">
        <Package className="w-12 h-12 text-[#E5E5EA] mx-auto mb-3" />
        <p className="text-[#8E8E93] mb-4">
          {error || 'Pengembalian tidak ditemukan'}
        </p>
        <Link href="/return">
          <Button variant="accent">Kembali ke Daftar Pengembalian</Button>
        </Link>
      </div>
    );
  }

  const ret = returnData;

  return (
    <div className="pb-8">
      {/* Back link */}
      <Link
        href="/return"
        className="inline-flex items-center gap-1 text-sm text-[#8E8E93] mb-4 hover:text-[#1C1C1E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-xl font-bold text-[#1C1C1E] font-display">
            {ret.returnNumber}
          </h1>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Diajukan {formatDate(ret.createdAt)}
          </p>
        </div>
        <ReturnStatusBadge status={ret.status} />
      </div>

      {/* Rejection banner */}
      {ret.status === 'REJECTED' && ret.rejectionReason && (
        <div className="mt-4 p-4 bg-[#FF3B30]/10 rounded-xl border border-[#FF3B30]/20">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-[#FF3B30]" />
            <span className="font-semibold text-sm text-[#FF3B30]">Pengembalian Ditolak</span>
          </div>
          <p className="text-sm text-[#FF3B30]">{ret.rejectionReason}</p>
        </div>
      )}

      {/* Timeline */}
      <div className="mt-6 bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#1C1C1E] mb-4 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#F5A623]" />
          Status Pengembalian
        </h3>
        <ReturnTimeline
          status={ret.status}
          createdAt={ret.createdAt}
          reviewedAt={ret.reviewedAt}
          approvedAt={ret.approvedAt}
          rejectionReason={ret.rejectionReason}
          receivedAt={ret.receivedAt}
          completedAt={ret.completedAt}
        />
      </div>

      {/* Reason & Detail */}
      <div className="mt-4 bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#F5A623]" />
          Alasan Pengembalian
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8E8E93]">Alasan:</span>
            <Badge variant="info" className="text-xs">
              <ReturnReasonLabel reason={ret.reason} />
            </Badge>
          </div>
          {ret.detail && (
            <div>
              <span className="text-xs text-[#8E8E93] block mb-1">Detail:</span>
              <p className="text-sm text-[#1C1C1E] bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E5EA] leading-relaxed">
                {ret.detail}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Evidence Images */}
      <div className="mt-4 bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3 flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#F5A623]" />
          Bukti Foto / Video
        </h3>
        {ret.evidenceImages && ret.evidenceImages.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {ret.evidenceImages.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-lg overflow-hidden bg-[#F2F2F7] border border-[#E5E5EA] group"
              >
                <Image
                  src={url}
                  alt={`Bukti ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </a>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg border border-dashed border-[#E5E5EA]">
            <Camera className="w-5 h-5 text-[#C7C7CC]" />
            <p className="text-xs text-[#8E8E93]">Tidak ada lampiran bukti</p>
          </div>
        )}
      </div>

      {/* Preferred Resolution */}
      <div className="mt-4 bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#1C1C1E] mb-2">
          Resolusi yang Diminta
        </h3>
        <Badge variant="warning" className="text-xs">
          {RESOLUTION_LABELS[ret.preferredResolution]}
        </Badge>
      </div>

      {/* Items being returned */}
      <div className="mt-4 bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-[#F5A623]" />
          Barang Dikembalikan
        </h3>
        <div className="space-y-3">
          {ret.items.map((item, i) => (
            <div key={item.productId + i} className="flex gap-3">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F2F2F7] flex-shrink-0 border border-[#E5E5EA]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#C7C7CC]" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1C1C1E] truncate">{item.name}</p>
                <p className="text-xs text-[#8E8E93]">
                  {item.qty}x {formatPrice(item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Note */}
      {ret.adminNote && (
        <div className="mt-4 bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#1C1C1E] mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#F5A623]" />
            Catatan Admin
          </h3>
          <p className="text-sm text-[#1C1C1E] bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E5EA] leading-relaxed">
            {ret.adminNote}
          </p>
        </div>
      )}

      {/* Refund Amount */}
      {ret.refundAmount != null && ret.refundAmount > 0 && (
        <div className="mt-4 bg-[#34C759]/5 rounded-2xl border border-[#34C759]/20 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#34C759]" />
              <span className="text-sm font-semibold text-[#1C1C1E]">Jumlah Refund</span>
            </div>
            <span className="text-lg font-bold text-[#34C759]">
              {formatPrice(ret.refundAmount)}
            </span>
          </div>
        </div>
      )}

      {/* Shipping Info */}
      {(ret.status === 'APPROVED' || ret.status === 'WAITING_FOR_ITEM') &&
        ret.trackingNumber && (
          <div className="mt-4 bg-[#F5A623]/5 rounded-2xl border border-[#F5A623]/20 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1C1C1E] mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#F5A623]" />
              Informasi Pengiriman
            </h3>
            <div className="space-y-1 text-sm">
              {ret.returnShippingProvider && (
                <p className="text-[#1C1C1E]">
                  Kurir: {ret.returnShippingProvider}
                </p>
              )}
              <p className="text-[#1C1C1E]">
                No. Resi:{' '}
                <span className="font-mono font-medium">{ret.trackingNumber}</span>
              </p>
            </div>
          </div>
        )}

      {/* Action Panel */}
      <div className="mt-6 space-y-3">
        {canCancel && (
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogTrigger>
              <Button
                variant="outline"
                className="w-full"
                disabled={cancelling}
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Membatalkan...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Batalkan Pengembalian
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Batalkan Pengembalian?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-[#8E8E93] mb-4">
                Apakah kamu yakin ingin membatalkan pengembalian ini? Tindakan ini tidak dapat
                dibatalkan.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCancelDialogOpen(false)}
                >
                  Kembali
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : null}
                  Ya, Batalkan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <a
          href={`https://wa.me/6281318986320?text=Halo,%20saya%20ingin%20bertanya%20tentang%20pengembalian%20${ret.returnNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="accent" className="w-full">
            <MessageCircle className="w-4 h-4 mr-1" />
            Hubungi WhatsApp
          </Button>
        </a>

        <Link href={`/pesanan/${ret.orderId}`}>
          <Button variant="outline" className="w-full">
            <ExternalLink className="w-4 h-4 mr-1" />
            Lihat Detail Pesanan
          </Button>
        </Link>
      </div>
    </div>
  );
}
