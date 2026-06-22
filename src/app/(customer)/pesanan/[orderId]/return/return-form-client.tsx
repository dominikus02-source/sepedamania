'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/toaster';
import {
  Loader2,
  ArrowLeft,
  Package,
  AlertCircle,
  Camera,
  Info,
} from 'lucide-react';
import type {
  ReturnReason,
  ReturnStatus,
  PreferredResolution,
  MockReturnRequest,
} from '@/lib/mock-returns';
import { RETURN_REASON_LABELS, RESOLUTION_LABELS } from '@/lib/mock-returns';

interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface OrderData {
  id: string;
  status: string;
  items: OrderItem[];
  [key: string]: unknown;
}

export function ReturnFormClient({ orderId }: { orderId: string }) {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // Order state
  const [order, setOrder] = useState<OrderData | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Active return check
  const [activeReturn, setActiveReturn] = useState<MockReturnRequest | null>(null);

  // Form state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState<ReturnReason | ''>('');
  const [detail, setDetail] = useState('');
  const [resolution, setResolution] = useState<PreferredResolution | ''>('');
  const [confirmation, setConfirmation] = useState(false);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Character count
  const charCount = detail.length;
  const charLimit = 2000;
  const isDetailValid = charCount >= 10 && charCount <= charLimit;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/masuk?callbackUrl=' + encodeURIComponent(`/pesanan/${orderId}/return`));
    }
  }, [authStatus, orderId, router]);

  // Fetch order and check active returns
  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    const fetchData = async () => {
      try {
        // Fetch order
        const orderRes = await fetch(`/api/orders/${orderId}`);
        const orderData = await orderRes.json();
        if (orderData.error) throw new Error(orderData.error);
        setOrder(orderData);

        // Pre-select all items
        if (orderData.items && Array.isArray(orderData.items)) {
          setSelectedItems(new Set(orderData.items.map((i: OrderItem) => i.productId)));
        }

        // Check for active returns on this order
        const returnsRes = await fetch(`/api/returns?orderId=${orderId}`);
        const returnsData = await returnsRes.json();
        if (!returnsData.error) {
          const returnsList: MockReturnRequest[] = Array.isArray(returnsData)
            ? returnsData
            : returnsData.returns ?? [];
          const terminal: ReturnStatus[] = ['COMPLETED', 'CANCELLED', 'REJECTED'];
          const active = returnsList.find(
            (r: MockReturnRequest) => !terminal.includes(r.status)
          );
          if (active) setActiveReturn(active);
        }
      } catch (err) {
        setOrderError(
          err instanceof Error ? err.message : 'Gagal memuat data pesanan'
        );
      } finally {
        setOrderLoading(false);
      }
    };

    fetchData();
  }, [orderId, authStatus]);

  // Validate order status for return
  const canReturn =
    order &&
    (order.status === 'DELIVERED' || order.status === 'COMPLETED') &&
    !activeReturn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation
    if (!reason) {
      setSubmitError('Pilih alasan pengembalian');
      return;
    }
    if (!isDetailValid) {
      setSubmitError('Detail pengembalian minimal 10 karakter');
      return;
    }
    if (!resolution) {
      setSubmitError('Pilih resolusi yang diinginkan');
      return;
    }
    if (!confirmation) {
      setSubmitError('Kamu harus menyetujui pernyataan di atas');
      return;
    }
    if (selectedItems.size === 0) {
      setSubmitError('Pilih minimal satu produk untuk dikembalikan');
      return;
    }

    setSubmitting(true);
    try {
      const items = order?.items.filter((i) => selectedItems.has(i.productId)) || [];

      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          items,
          reason,
          detail,
          preferredResolution: resolution,
          evidenceImages: [],
          confirmationAccepted: true,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      toast('Pengembalian berhasil diajukan!', 'success');
      router.push(`/return/${data.returnNumber}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Gagal mengajukan pengembalian'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleItem = (productId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Loading
  if (orderLoading || authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5A623] mx-auto mb-3" />
          <p className="text-sm text-[#8E8E93]">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  // Auth check
  if (authStatus === 'unauthenticated') {
    return null; // Will redirect
  }

  // Order error
  if (orderError || !order) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-[#FF3B30] mx-auto mb-3" />
        <p className="text-[#8E8E93] mb-4">{orderError || 'Pesanan tidak ditemukan'}</p>
        <Link href="/pesanan">
          <Button variant="accent">Kembali ke Pesanan</Button>
        </Link>
      </div>
    );
  }

  // Active return exists
  if (activeReturn) {
    return (
      <div className="py-10">
        <Link
          href={`/pesanan/${orderId}`}
          className="inline-flex items-center gap-1 text-sm text-[#8E8E93] mb-6 hover:text-[#1C1C1E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Pesanan
        </Link>

        <div className="bg-[#F5A623]/10 rounded-2xl border border-[#F5A623]/20 p-6 text-center">
          <Info className="w-10 h-10 text-[#F5A623] mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[#1C1C1E] mb-2">
            Pengembalian Sedang Aktif
          </h2>
          <p className="text-sm text-[#8E8E93] mb-4">
            Pesanan ini sudah memiliki pengajuan pengembalian yang sedang diproses.
          </p>
          <Link href={`/return/${activeReturn.returnNumber}`}>
            <Button variant="accent">Lihat Status Pengembalian</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Cannot return — wrong status
  if (!canReturn) {
    return (
      <div className="py-10">
        <Link
          href={`/pesanan/${orderId}`}
          className="inline-flex items-center gap-1 text-sm text-[#8E8E93] mb-6 hover:text-[#1C1C1E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Pesanan
        </Link>

        <div className="bg-[#FF3B30]/10 rounded-2xl border border-[#FF3B30]/20 p-6 text-center">
          <AlertCircle className="w-10 h-10 text-[#FF3B30] mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[#1C1C1E] mb-2">
            Tidak Dapat Mengajukan Pengembalian
          </h2>
          <p className="text-sm text-[#8E8E93] mb-4">
            Pengembalian hanya dapat diajukan untuk pesanan dengan status{' '}
            <strong>Diterima</strong> atau <strong>Selesai</strong>.
          </p>
          <Link href={`/pesanan/${orderId}`}>
            <Button variant="accent">Kembali ke Pesanan</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check order has items
  if (!order.items || order.items.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-12 h-12 text-[#E5E5EA] mx-auto mb-3" />
        <p className="text-[#8E8E93]">Tidak ada item dalam pesanan ini</p>
        <Link href="/pesanan">
          <Button variant="accent" className="mt-4">
            Kembali ke Pesanan
          </Button>
        </Link>
      </div>
    );
  }

  const reasonOptions: { value: ReturnReason; label: string }[] = Object.entries(
    RETURN_REASON_LABELS
  ).map(([key, label]) => ({ value: key as ReturnReason, label }));

  const resolutionOptions: { value: PreferredResolution; label: string }[] = Object.entries(
    RESOLUTION_LABELS
  ).map(([key, label]) => ({ value: key as PreferredResolution, label }));

  return (
    <div className="pb-8">
      {/* Back link */}
      <Link
        href={`/pesanan/${orderId}`}
        className="inline-flex items-center gap-1 text-sm text-[#8E8E93] mb-6 hover:text-[#1C1C1E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Detail Pesanan
      </Link>

      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-1 font-display">
        Ajukan Pengembalian
      </h1>
      <p className="text-sm text-[#8E8E93] mb-6">
        Pesanan #{orderId.slice(0, 8)}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Selection */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1C1C1E] mb-3">
            Pilih Produk yang Dikembalikan
          </h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <label
                key={item.productId + i}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E5EA] cursor-pointer transition-all duration-200 hover:border-[#F5A623] has-checked:border-[#F5A623] has-checked:bg-[#F5A623]/5"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.productId)}
                  onChange={() => toggleItem(item.productId)}
                  className="w-4 h-4 rounded border-[#E5E5EA] text-[#F5A623] focus:ring-[#F5A623] accent-[#F5A623]"
                />
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F2F2F7] flex-shrink-0 border border-[#E5E5EA]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#C7C7CC]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1C1E] truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#8E8E93]">
                    {item.qty}x {formatPrice(item.price)}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1C1C1E] mb-3">
            Alasan Pengembalian
          </h2>
          <RadioGroup
            value={reason}
            onValueChange={(v) => setReason(v as ReturnReason)}
          >
            {reasonOptions.map((opt) => (
              <RadioGroupItem key={opt.value} value={opt.value}>
                <span className="text-sm font-medium text-[#1C1C1E]">
                  {opt.label}
                </span>
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </div>

        {/* Detail */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1C1C1E] mb-3">
            Detail Pengembalian
          </h2>
          <Textarea
            placeholder="Jelaskan alasan pengembalian secara detail..."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="min-h-[120px]"
            maxLength={charLimit}
          />
          <div className="flex justify-between items-center mt-1.5">
            {charCount < 10 && (
              <span className="text-xs text-[#FF3B30]">
                Minimal 10 karakter
              </span>
            )}
            {charCount >= 10 && (
              <span className="text-xs text-[#34C759]">
                Sudah cukup
              </span>
            )}
            <span
              className={`text-xs ml-auto ${
                charCount > charLimit ? 'text-[#FF3B30]' : 'text-[#8E8E93]'
              }`}
            >
              {charCount}/{charLimit}
            </span>
          </div>
        </div>

        {/* Preferred Resolution */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1C1C1E] mb-3">
            Resolusi yang Diinginkan
          </h2>
          <RadioGroup
            value={resolution}
            onValueChange={(v) => setResolution(v as PreferredResolution)}
          >
            {resolutionOptions.map((opt) => (
              <RadioGroupItem key={opt.value} value={opt.value}>
                <span className="text-sm font-medium text-[#1C1C1E]">
                  {opt.label}
                </span>
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </div>

        {/* Evidence Images */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1C1C1E] mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#F5A623]" />
            Bukti Foto / Video
          </h2>
          <div className="flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E5EA]">
            <Camera className="w-6 h-6 text-[#C7C7CC]" />
            <div>
              <p className="text-sm font-medium text-[#8E8E93]">
                Upload foto maksimal 5
              </p>
              <p className="text-xs text-[#C7C7CC]">
                Fitur upload akan tersedia segera
              </p>
            </div>
          </div>
          <p className="text-xs text-[#8E8E93] mt-2">
            Jika fitur upload belum tersedia, kamu bisa menyertakan link foto di
            kolom detail atau menghubungi CS melalui WhatsApp.
          </p>
        </div>

        {/* Confirmation */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmation}
              onChange={(e) => setConfirmation(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-[#E5E5EA] text-[#F5A623] focus:ring-[#F5A623] accent-[#F5A623]"
            />
            <span className="text-sm text-[#1C1C1E] leading-relaxed">
              Saya menyatakan informasi yang diberikan benar dan sesuai dengan
              ketentuan pengembalian yang berlaku.
            </span>
          </label>
        </div>

        {/* Error */}
        {submitError && (
          <div className="flex items-center gap-2 p-3 bg-[#FF3B30]/10 rounded-xl border border-[#FF3B30]/20">
            <AlertCircle className="w-4 h-4 text-[#FF3B30] flex-shrink-0" />
            <p className="text-sm text-[#FF3B30]">{submitError}</p>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Mengajukan...
            </>
          ) : (
            'Ajukan Pengembalian'
          )}
        </Button>
      </form>
    </div>
  );
}
