'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockOrders, AdminOrder } from '@/lib/mock-admin-data';
import { formatPrice, formatDate, formatDateShort } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/toaster';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Truck,
  Package,
  CreditCard,
  XCircle,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Save,
  ClipboardCheck,
  Send,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────

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

const PAYMENT_BADGE_VARIANTS: Record<string, string> = {
  PAID: 'success',
  UNPAID: 'warning',
  FAILED: 'destructive',
};

const ORDER_BADGE_VARIANTS: Record<string, string> = {
  DELIVERED: 'success',
  CANCELLED: 'destructive',
  SHIPPED: 'primary',
  PROCESSING: 'info',
  PENDING_PAYMENT: 'warning',
};

const STEP_ORDER = ['PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const STEP_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Pesanan Dibuat',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Selesai',
};

const COURIER_OPTIONS = [
  { value: 'JNE', label: 'JNE' },
  { value: 'J&T', label: 'J&T' },
  { value: 'SiCepat', label: 'SiCepat' },
  { value: 'Anteraja', label: 'Anteraja' },
  { value: 'Pos Indonesia', label: 'Pos Indonesia' },
];

// ─── Stepper Component ──────────────────────────────────────────────────────

function StatusStepper({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center justify-center gap-4 py-4">
        <div className="flex items-center gap-2">
          <XCircle className="w-6 h-6 text-[#FF3B30]" />
          <span className="text-sm font-semibold text-[#FF3B30]">
            Pesanan Dibatalkan
          </span>
        </div>
      </div>
    );
  }

  const currentIdx = STEP_ORDER.indexOf(status);

  return (
    <div className="flex items-center justify-between py-4 px-2">
      {STEP_ORDER.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFuture = idx > currentIdx;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* Circle + Label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#34C759]'
                    : isCurrent
                      ? 'bg-[#F5A623] ring-4 ring-[#F5A623]/20'
                      : 'bg-[#E5E5EA]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Circle className="w-5 h-5 text-white fill-white" />
                  </div>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-[#C7C7CC]" />
                )}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isCurrent
                    ? 'text-[#F5A623] font-semibold'
                    : isCompleted
                      ? 'text-[#34C759]'
                      : 'text-[#8E8E93]'
                }`}
              >
                {STEP_LABELS[step]}
              </span>
            </div>

            {/* Connector Line */}
            {idx < STEP_ORDER.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 mb-6 self-center">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx < currentIdx ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Detail Page ───────────────────────────────────────────────────────

export default function AdminOrderDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('JNE');
  const [trackingNo, setTrackingNo] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    const found = mockOrders.find((o) => o.id === id) || null;
    if (found) {
      setOrder(found);
      setNotes(found.notes || '');
      setSelectedCourier(found.courier || 'JNE');
      setTrackingNo(found.trackingNumber || '');
    }
    setLoading(false);
  }, [id]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleConfirmPayment = () => {
    if (!order) return;
    setActing(true);
    // Simulate API call
    setTimeout(() => {
      setOrder((prev: AdminOrder | null) =>
        prev
          ? {
              ...prev,
              paymentStatus: 'PAID',
              status: 'PROCESSING',
              updatedAt: new Date().toISOString(),
            }
          : prev
      );
      setActing(false);
      toast('Pembayaran berhasil dikonfirmasi', 'success');
    }, 600);
  };

  const handleSaveResi = () => {
    if (!order) return;
    if (!trackingNo.trim()) {
      toast('Harap masukkan nomor resi', 'error');
      return;
    }
    setActing(true);
    // Simulate API call
    setTimeout(() => {
      setOrder((prev: AdminOrder | null) =>
        prev
          ? {
              ...prev,
              courier: selectedCourier,
              trackingNumber: trackingNo.trim(),
              status: 'SHIPPED',
              updatedAt: new Date().toISOString(),
            }
          : prev
      );
      setActing(false);
      toast('Resi berhasil disimpan & status berubah ke Dikirim', 'success');
      toast('Email notifikasi pengiriman telah dikirim', 'success');
    }, 600);
  };

  const handleMarkDelivered = () => {
    if (!order) return;
    setActing(true);
    setTimeout(() => {
      setOrder((prev: AdminOrder | null) =>
        prev
          ? {
              ...prev,
              status: 'DELIVERED',
              updatedAt: new Date().toISOString(),
            }
          : prev
      );
      setActing(false);
      toast('Pesanan ditandai selesai', 'success');
    }, 600);
  };

  const handleSaveNotes = () => {
    if (!order) return;
    setSavingNotes(true);
    setTimeout(() => {
      setOrder((prev: AdminOrder | null) =>
        prev ? { ...prev, notes } : prev
      );
      setSavingNotes(false);
      toast('Catatan berhasil disimpan', 'success');
    }, 400);
  };

  // ── Loading / Not Found ────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-[#8E8E93]">Memuat pesanan...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Link href="/admin/pesanan">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </Button>
        </Link>
        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-lg font-semibold text-[#1C1C1E] mb-2">
              Pesanan Tidak Ditemukan
            </h2>
            <p className="text-sm text-[#8E8E93]">
              Pesanan dengan ID <span className="font-mono">#{id}</span> tidak
              ditemukan.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Derived Values ─────────────────────────────────────────────────────────

  const isCancelled = order.status === 'CANCELLED';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl">
      {/* ─── A. Order Info Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/pesanan">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1E] flex items-center gap-3">
              <span className="font-mono">#{order.id}</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    (ORDER_BADGE_VARIANTS[order.status] as any) || 'default'
                  }
                >
                  {STATUS_LABELS[order.status] || order.status}
                </Badge>
                <Badge
                  variant={
                    (PAYMENT_BADGE_VARIANTS[order.paymentStatus] as any) ||
                    'default'
                  }
                >
                  {PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}
                </Badge>
              </div>
            </h1>
            <p className="text-sm text-[#8E8E93] mt-1">
              {formatDate(order.createdAt)} &middot;{' '}
              {formatDateShort(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* ─── B. Status Stepper ────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <StatusStepper status={order.status} />
        </CardContent>
      </Card>

      {/* ─── Two-column layout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* ─── C. Customer Info Card ───────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-[#8E8E93]" />
              Informasi Pelanggan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#8E8E93] shrink-0" />
              <span className="text-sm font-medium text-[#1C1C1E]">
                {order.user.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#8E8E93] shrink-0" />
              <span className="text-sm text-[#8E8E93]">{order.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#8E8E93] shrink-0" />
              <span className="text-sm text-[#8E8E93]">{order.user.phone}</span>
            </div>
            <Separator />
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#8E8E93] shrink-0 mt-0.5" />
              <div className="text-sm text-[#1C1C1E]">
                <p className="font-medium">{order.shippingAddress.recipient}</p>
                <p className="text-[#8E8E93]">
                  {order.shippingAddress.detail}
                </p>
                <p className="text-[#8E8E93]">
                  {order.shippingAddress.district},{' '}
                  {order.shippingAddress.city}
                </p>
                <p className="text-[#8E8E93]">
                  {order.shippingAddress.province}{' '}
                  {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── F. Shipping Card ────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="w-4 h-4 text-[#8E8E93]" />
              Informasi Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8E8E93]">Kurir</span>
              <span className="text-sm font-medium text-[#1C1C1E]">
                {order.courier}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8E8E93]">Layanan</span>
              <span className="text-sm font-medium text-[#1C1C1E]">
                {order.courierService}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8E8E93]">Penerima</span>
              <span className="text-sm font-medium text-[#1C1C1E]">
                {order.shippingAddress.recipient}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-sm text-[#8E8E93] shrink-0">Alamat</span>
              <span className="text-sm text-[#1C1C1E] text-right max-w-[200px]">
                {order.shippingAddress.detail}, {order.shippingAddress.district}
                , {order.shippingAddress.city},{' '}
                {order.shippingAddress.province}{' '}
                {order.shippingAddress.postalCode}
              </span>
            </div>
            {order.trackingNumber && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8E8E93]">No. Resi</span>
                  <span className="text-sm font-mono font-bold text-[#1C1C1E]">
                    {order.trackingNumber}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── D. Products Card ─────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="w-4 h-4 text-[#8E8E93]" />
            Produk ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E5EA]">
                  <th className="text-left pb-2 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="text-center pb-2 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="text-right pb-2 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="text-right pb-2 font-medium text-[#8E8E93] text-xs uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#E5E5EA] last:border-0"
                  >
                    <td className="py-3 pr-4 text-[#1C1C1E] font-medium">
                      {item.name}
                    </td>
                    <td className="py-3 text-center text-[#8E8E93]">
                      {item.qty}
                    </td>
                    <td className="py-3 text-right text-[#8E8E93]">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-3 text-right font-semibold text-[#1C1C1E] whitespace-nowrap">
                      {formatPrice(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ─── E. Payment Breakdown Card ────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="w-4 h-4 text-[#8E8E93]" />
            Rincian Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#8E8E93]">Subtotal</span>
            <span className="text-[#1C1C1E]">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8E8E93]">Ongkos Kirim</span>
            <span className="text-[#1C1C1E]">
              {formatPrice(order.shippingCost)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#34C759]">Diskon</span>
              <span className="text-[#34C759]">
                -{formatPrice(order.discount)}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span className="text-[#1C1C1E]">Total</span>
            <span className="text-[#1C1C1E]">
              {formatPrice(order.total)}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-1">
            <span className="text-[#8E8E93]">Metode Pembayaran</span>
            <span className="text-[#1C1C1E] font-medium">
              {order.paymentMethod}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ─── G. Admin Actions ─────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardCheck className="w-4 h-4 text-[#8E8E93]" />
            Aksi Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* CANCELLED */}
          {isCancelled && (
            <div className="flex items-start gap-3 p-4 bg-[#FF3B30]/5 rounded-xl border border-[#FF3B30]/10">
              <XCircle className="w-5 h-5 text-[#FF3B30] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#FF3B30]">
                  Pesanan Dibatalkan
                </p>
                {order.notes && (
                  <p className="text-sm text-[#8E8E93] mt-1">
                    Catatan: {order.notes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* PENDING_PAYMENT + PAID → Konfirmasi Pembayaran */}
          {order.status === 'PENDING_PAYMENT' &&
            order.paymentStatus === 'PAID' && (
              <div className="space-y-3">
                <p className="text-sm text-[#8E8E93]">
                  Pembayaran sudah diterima. Konfirmasi untuk memproses pesanan.
                </p>
                <Button
                  variant="accent"
                  onClick={handleConfirmPayment}
                  disabled={acting}
                >
                  {acting ? (
                    <span className="animate-pulse">Memproses...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Konfirmasi Pembayaran
                    </>
                  )}
                </Button>
              </div>
            )}

          {/* PENDING_PAYMENT + UNPAID → No actions */}
          {order.status === 'PENDING_PAYMENT' &&
            order.paymentStatus === 'UNPAID' && (
              <div className="flex items-center gap-2 text-sm text-[#8E8E93]">
                <Circle className="w-4 h-4" />
                Menunggu pembayaran dari pelanggan...
              </div>
            )}

          {order.status === 'PENDING_PAYMENT' &&
            order.paymentStatus === 'FAILED' && (
              <div className="flex items-center gap-2 text-sm text-[#FF3B30]">
                <XCircle className="w-4 h-4" />
                Pembayaran gagal. Menunggu tindakan pelanggan.
              </div>
            )}

          {/* PROCESSING → Input Resi */}
          {order.status === 'PROCESSING' && (
            <div className="space-y-4">
              <p className="text-sm text-[#8E8E93]">
                Masukkan nomor resi pengiriman untuk mengirim pesanan.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="courier">Kurir</Label>
                  <Select
                    id="courier"
                    options={COURIER_OPTIONS}
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="tracking">Nomor Resi</Label>
                  <Input
                    id="tracking"
                    placeholder="Masukkan nomor resi..."
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="accent"
                onClick={handleSaveResi}
                disabled={acting || !trackingNo.trim()}
              >
                {acting ? (
                  <span className="animate-pulse">Menyimpan...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    Simpan Resi & Kirim
                  </>
                )}
              </Button>
            </div>
          )}

          {/* SHIPPED → Tandai Selesai */}
          {order.status === 'SHIPPED' && (
            <div className="space-y-3">
              <p className="text-sm text-[#8E8E93]">
                Pesanan sudah dikirim. Tandai sebagai selesai jika sudah
                diterima pelanggan.
              </p>
              {order.trackingNumber && (
                <p className="text-xs text-[#8E8E93] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Resi:{' '}
                  <span className="font-mono font-medium text-[#1C1C1E]">
                    {order.trackingNumber}
                  </span>
                </p>
              )}
              <Button
                variant="accent"
                onClick={handleMarkDelivered}
                disabled={acting}
              >
                {acting ? (
                  <span className="animate-pulse">Memproses...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1.5" />
                    Tandai Selesai
                  </>
                )}
              </Button>
            </div>
          )}

          {/* DELIVERED → No actions */}
          {order.status === 'DELIVERED' && (
            <div className="flex items-center gap-2 text-sm text-[#34C759]">
              <CheckCircle className="w-4 h-4" />
              Pesanan sudah selesai. Tidak ada tindakan yang diperlukan.
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── H. Notes Section ─────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4 text-[#8E8E93]" />
            Catatan Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Tulis catatan internal untuk pesanan ini..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveNotes}
            disabled={savingNotes}
          >
            {savingNotes ? (
              <span className="animate-pulse">Menyimpan...</span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                Simpan Catatan
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
