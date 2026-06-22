'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { getMockReturn, getMockReturnByNumber, updateMockReturn, isValidReturnTransition } from '@/lib/mock-returns';
import { RETURN_STATUS_LABELS, RETURN_REASON_LABELS } from '@/lib/mock-returns';
import type { MockReturnRequest, ReturnStatus } from '@/lib/mock-returns';
import { AdminStore } from '@/lib/admin-store';
import type { AdminOrder } from '@/lib/admin-store';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReturnStatusBadge } from '@/components/return/return-status-badge';
import { ReturnTimeline } from '@/components/return/return-timeline';
import { ReturnActionPanel } from '@/components/return/return-action-panel';
import { ReturnReasonLabel } from '@/components/return/return-reason-label';
import {
  ArrowLeft,
  RotateCcw,
  User,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Save,
  Package,
  ExternalLink,
  AlertCircle,
  ImageIcon,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

// ─── Resolution Labels ─────────────────────────────────────────────────────

const RESOLUTION_LABELS: Record<string, string> = {
  REFUND: 'Refund',
  REPLACEMENT: 'Penggantian Barang',
  STORE_CREDIT: 'Kredit Toko',
  ADMIN_HELP: 'Bantuan Admin',
};

// ─── Action dialog titles & descriptions ───────────────────────────────────

const ACTION_DIALOG: Record<
  string,
  { title: string; description: string }
> = {
  UNDER_REVIEW: {
    title: 'Tinjau Pengembalian',
    description: 'Tandai pengembalian ini sebagai sedang ditinjau.',
  },
  APPROVED: {
    title: 'Setujui Pengembalian',
    description: 'Setujui pengembalian dan beri instruksi kepada pelanggan untuk mengirim barang.',
  },
  REJECTED: {
    title: 'Tolak Pengembalian',
    description: 'Tolak pengembalian ini. Alasan penolakan wajib diisi.',
  },
  WAITING_FOR_ITEM: {
    title: 'Minta Kirim Barang',
    description: 'Konfirmasi ke pelanggan untuk mengirimkan barang yang akan diretur.',
  },
  ITEM_RECEIVED: {
    title: 'Terima Barang',
    description: 'Tandai bahwa barang sudah diterima di gudang.',
  },
  REFUND_PROCESSING: {
    title: 'Proses Refund',
    description: 'Masukkan jumlah refund yang akan dikembalikan ke pelanggan.',
  },
  REPLACEMENT_SHIPPING: {
    title: 'Kirim Pengganti',
    description: 'Masukkan nomor resi dan provider pengiriman untuk barang pengganti.',
  },
  COMPLETED: {
    title: 'Selesaikan Pengembalian',
    description: 'Selesaikan proses pengembalian barang ini.',
  },
  CANCELLED: {
    title: 'Batalkan Pengembalian',
    description: 'Batalkan pengajuan pengembalian ini.',
  },
};

// ─── Main Page Component ───────────────────────────────────────────────────

export default function AdminReturnDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;

  const [ready, setReady] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);

  const [returnData, setReturnData] = useState<MockReturnRequest | null>(null);
  const [order, setOrder] = useState<AdminOrder | null>(null);

  // Admin notes
  const [adminNote, setAdminNote] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Action dialog
  const [confirmAction, setConfirmAction] = useState<ReturnStatus | null>(null);
  const [acting, setActing] = useState(false);

  // Dialog form fields
  const [dialogAdminNote, setDialogAdminNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingProvider, setShippingProvider] = useState('');

  // Refund info card - editable fields
  const [editRefundAmount, setEditRefundAmount] = useState('');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [editShippingProvider, setEditShippingProvider] = useState('');
  const [savingRefundInfo, setSavingRefundInfo] = useState(false);

  // ─── Load data ──────────────────────────────────────────────────────────

  useEffect(() => {
    const ret = getMockReturn(id) ?? getMockReturnByNumber(id);
    if (!ret) {
      setNotFoundState(true);
      return;
    }
    setReturnData(ret);
    setAdminNote(ret.adminNote ?? '');

    const ord = AdminStore.getOrder(ret.orderId);
    setOrder(ord ?? null);

    // Pre-fill refund info
    setEditRefundAmount(ret.refundAmount ? String(ret.refundAmount) : '');
    setEditTrackingNumber(ret.trackingNumber ?? '');
    setEditShippingProvider(ret.returnShippingProvider ?? '');

    setReady(true);
  }, [id]);

  // ─── Not found ──────────────────────────────────────────────────────────

  if (notFoundState) {
    notFound();
  }

  // ─── Loading state ──────────────────────────────────────────────────────

  if (!ready || !returnData) {
    return (
      <div className="space-y-4 max-w-5xl">
        <div className="h-8 w-64 bg-[#F2F2F7] rounded animate-pulse" />
        <div className="h-32 bg-[#F2F2F7] rounded animate-pulse" />
        <div className="h-64 bg-[#F2F2F7] rounded animate-pulse" />
      </div>
    );
  }

  // ─── Helpers ────────────────────────────────────────────────────────────

  const waNumber = order?.user?.phone
    ? `https://wa.me/${order.user.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(order.user.name ?? 'Pelanggan')}%2C%20saya%20dari%20SEPEDAMANIA.%20Ada%20yang%20ingin%20saya%20sampaikan%20terkait%20pengembalian%20${returnData.returnNumber}.`
    : null;

  const isTerminal = ['REJECTED', 'COMPLETED', 'CANCELLED'].includes(returnData.status);

  // ─── Update return data ─────────────────────────────────────────────────

  const applyUpdates = (updates: Partial<MockReturnRequest>, successMsg: string) => {
    const updated = updateMockReturn(returnData.id, updates);
    if (updated) {
      setReturnData(updated);
      toast(successMsg, 'success');
    } else {
      toast('Gagal memperbarui data', 'error');
    }
  };

  // ─── Save admin notes ───────────────────────────────────────────────────

  const handleSaveNotes = () => {
    setSavingNotes(true);
    setTimeout(() => {
      applyUpdates({ adminNote }, 'Catatan admin berhasil disimpan');
      setSavingNotes(false);
    }, 300);
  };

  // ─── Save refund info ───────────────────────────────────────────────────

  const handleSaveRefundInfo = () => {
    setSavingRefundInfo(true);
    setTimeout(() => {
      applyUpdates(
        {
          refundAmount: editRefundAmount ? Number(editRefundAmount) : undefined,
          trackingNumber: editTrackingNumber || undefined,
          returnShippingProvider: editShippingProvider || undefined,
        },
        'Informasi refund berhasil disimpan',
      );
      setSavingRefundInfo(false);
    }, 300);
  };

  // ─── Open action confirmation dialog ────────────────────────────────────

  const handleActionRequest = (targetStatus: ReturnStatus) => {
    // Pre-fill dialog fields
    setDialogAdminNote('');
    setRejectionReason('');
    setRefundAmount(editRefundAmount);
    setTrackingNumber(editTrackingNumber);
    setShippingProvider(editShippingProvider);
    setConfirmAction(targetStatus);
  };

  // ─── Validate action dialog ─────────────────────────────────────────────

  const canConfirmAction = () => {
    if (!confirmAction) return false;
    if (confirmAction === 'REJECTED' && !rejectionReason.trim()) return false;
    return true;
  };

  // ─── Execute action ─────────────────────────────────────────────────────

  const handleConfirmAction = () => {
    if (!confirmAction || !canConfirmAction()) return;
    if (!isValidReturnTransition(returnData.status as ReturnStatus, confirmAction)) {
      toast('Transisi status tidak valid', 'error');
      setConfirmAction(null);
      return;
    }

    setActing(true);

    const updates: Partial<MockReturnRequest> = {
      status: confirmAction,
    };

    if (dialogAdminNote) updates.adminNote = dialogAdminNote;
    if (confirmAction === 'REJECTED') updates.rejectionReason = rejectionReason.trim();
    if (confirmAction === 'REFUND_PROCESSING' && refundAmount) {
      updates.refundAmount = Number(refundAmount);
    }
    if (confirmAction === 'REPLACEMENT_SHIPPING') {
      if (trackingNumber) updates.trackingNumber = trackingNumber.trim();
      if (shippingProvider) updates.returnShippingProvider = shippingProvider.trim();
    }

    // Timestamps are handled by the API / mock backend
    setTimeout(() => {
      applyUpdates(updates, `Status berhasil diubah ke ${RETURN_STATUS_LABELS[confirmAction]}`);
      setActing(false);
      setConfirmAction(null);
    }, 400);
  };

  // ─── Dialog content by action type ──────────────────────────────────────

  const actionDialog = confirmAction ? ACTION_DIALOG[confirmAction] : null;

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl">
      {/* ── Back link + Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/pengembalian">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1E] flex items-center gap-3">
              <span className="font-mono">{returnData.returnNumber}</span>
              <ReturnStatusBadge status={returnData.status} />
            </h1>
            <p className="text-sm text-[#8E8E93] mt-1">
              Diajukan {formatDate(returnData.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* ── Left column (wider) ──────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-[#8E8E93]" />
                Timeline Pengembalian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReturnTimeline
                status={returnData.status}
                createdAt={returnData.createdAt}
                reviewedAt={returnData.reviewedAt}
                approvedAt={returnData.approvedAt}
                rejectionReason={returnData.rejectionReason}
                receivedAt={returnData.receivedAt}
                completedAt={returnData.completedAt}
              />
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <RotateCcw className="w-4 h-4 text-[#8E8E93]" />
                Detail Pengajuan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-[#8E8E93] uppercase tracking-wider font-medium">
                    Alasan
                  </Label>
                  <p className="text-sm font-medium text-[#1C1C1E] mt-1">
                    <ReturnReasonLabel reason={returnData.reason} />
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-[#8E8E93] uppercase tracking-wider font-medium">
                    Resolusi Diminta
                  </Label>
                  <p className="text-sm font-medium text-[#1C1C1E] mt-1">
                    {RESOLUTION_LABELS[returnData.preferredResolution] ?? returnData.preferredResolution}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-xs text-[#8E8E93] uppercase tracking-wider font-medium">
                  Detail Masalah
                </Label>
                <p className="text-sm text-[#1C1C1E] mt-1 leading-relaxed whitespace-pre-wrap">
                  {returnData.detail}
                </p>
              </div>

              {/* Evidence Images */}
              <div>
                <Label className="text-xs text-[#8E8E93] uppercase tracking-wider font-medium">
                  Bukti Gambar
                </Label>
                {returnData.evidenceImages.length > 0 ? (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {returnData.evidenceImages.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative w-24 h-24 rounded-xl overflow-hidden border border-[#E5E5EA] bg-[#F2F2F7] hover:ring-2 hover:ring-[#F5A623] transition-all"
                      >
                        <img
                          src={url}
                          alt={`Bukti ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2 text-sm text-[#8E8E93]">
                    <ImageIcon className="w-4 h-4" />
                    Tidak ada bukti gambar
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Items Being Returned */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="w-4 h-4 text-[#8E8E93]" />
                Barang yang Dikembalikan ({returnData.items.length})
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
                    {returnData.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#E5E5EA] last:border-0">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover border border-[#E5E5EA] bg-[#F2F2F7]"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#F2F2F7] border border-[#E5E5EA] flex items-center justify-center">
                                <Package className="w-4 h-4 text-[#8E8E93]" />
                              </div>
                            )}
                            <span className="text-[#1C1C1E] font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-center text-[#8E8E93]">{item.qty}</td>
                        <td className="py-3 text-right text-[#8E8E93]">{formatPrice(item.price)}</td>
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

          {/* Rejection Reason */}
          {returnData.status === 'REJECTED' && returnData.rejectionReason && (
            <Card className="border-[#FF3B30]/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FF3B30]/10 flex items-center justify-center shrink-0">
                    <XCircle className="w-4 h-4 text-[#FF3B30]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#FF3B30]">Pengembalian Ditolak</p>
                    <p className="text-sm text-[#8E8E93] mt-1">{returnData.rejectionReason}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completion indicator */}
          {returnData.status === 'COMPLETED' && (
            <Card className="border-[#34C759]/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#34C759]/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#34C759]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#34C759]">Pengembalian Selesai</p>
                    <p className="text-sm text-[#8E8E93] mt-1">
                      Proses pengembalian barang telah selesai.
                      {returnData.completedAt && ` Selesai pada ${formatDate(returnData.completedAt)}.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4 text-[#8E8E93]" />
                Catatan Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Tulis catatan internal untuk pengembalian ini..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
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

        {/* ── Right column (narrower) ───────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ExternalLink className="w-4 h-4 text-[#8E8E93]" />
                Informasi Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8E8E93]">ID Pesanan</span>
                <Link
                  href={`/admin/pesanan/${returnData.orderId}`}
                  className="text-sm font-mono font-medium text-[#F5A623] hover:text-[#F5A623]/80 transition-colors"
                >
                  #{returnData.orderId} <ExternalLink className="w-3 h-3 inline-block ml-0.5" />
                </Link>
              </div>
              {order && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8E8E93]">Tanggal</span>
                    <span className="text-sm text-[#1C1C1E]">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8E8E93]">Total</span>
                    <span className="text-sm font-semibold text-[#1C1C1E]">{formatPrice(order.total)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          {order?.user && (
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
                  <span className="text-sm font-medium text-[#1C1C1E]">{order.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <span className="text-sm text-[#8E8E93]">{order.user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <span className="text-sm text-[#8E8E93]">{order.user.phone}</span>
                </div>

                {waNumber && (
                  <a
                    href={waNumber}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#25D366] hover:text-[#1DA851] transition-colors mt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Hubungi via WhatsApp
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Refund Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4 text-[#8E8E93]" />
                Informasi Refund
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="refund-amount" className="text-xs text-[#8E8E93]">
                  Jumlah Refund
                </Label>
                <Input
                  id="refund-amount"
                  type="number"
                  placeholder="Masukkan jumlah refund..."
                  value={editRefundAmount}
                  onChange={(e) => setEditRefundAmount(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tracking-no" className="text-xs text-[#8E8E93]">
                  Nomor Resi (Pengiriman Retur)
                </Label>
                <Input
                  id="tracking-no"
                  placeholder="Masukkan nomor resi..."
                  value={editTrackingNumber}
                  onChange={(e) => setEditTrackingNumber(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="shipping-provider" className="text-xs text-[#8E8E93]">
                  Provider Pengiriman
                </Label>
                <Input
                  id="shipping-provider"
                  placeholder="JNE, J&T, SiCepat, dll..."
                  value={editShippingProvider}
                  onChange={(e) => setEditShippingProvider(e.target.value)}
                />
              </div>

              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={handleSaveRefundInfo}
                disabled={savingRefundInfo}
              >
                {savingRefundInfo ? (
                  <span className="animate-pulse">Menyimpan...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    Simpan Informasi Refund
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Action Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="w-4 h-4 text-[#8E8E93]" />
                Tindakan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isTerminal ? (
                <p className="text-xs text-[#8E8E93] italic text-center py-2">
                  {returnData.status === 'COMPLETED'
                    ? 'Pengembalian telah selesai.'
                    : returnData.status === 'REJECTED'
                      ? 'Pengembalian telah ditolak.'
                      : 'Pengembalian telah dibatalkan.'}
                </p>
              ) : (
                <ReturnActionPanel
                  currentStatus={returnData.status}
                  onStatusChange={handleActionRequest}
                  isLoading={acting}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Action Confirmation Dialog ────────────────────────────────────── */}
      <Dialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open && !acting) setConfirmAction(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{actionDialog?.title ?? 'Konfirmasi Tindakan'}</DialogTitle>
            <p className="text-sm text-[#8E8E93] mt-1">
              {actionDialog?.description}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Admin note (always shown) */}
            <div className="space-y-1.5">
              <Label htmlFor="dialog-note">Catatan Admin (opsional)</Label>
              <Textarea
                id="dialog-note"
                value={dialogAdminNote}
                onChange={(e) => setDialogAdminNote(e.target.value)}
                rows={2}
                placeholder="Tulis catatan untuk tindakan ini..."
              />
            </div>

            {/* Rejection reason (required) */}
            {confirmAction === 'REJECTED' && (
              <div className="space-y-1.5">
                <Label htmlFor="rejection-reason">
                  Alasan Penolakan <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Wajib diisi — alasan mengapa pengembalian ditolak..."
                  className={!rejectionReason.trim() ? 'border-red-300 focus-visible:ring-red-400' : ''}
                />
                {!rejectionReason.trim() && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    Alasan penolakan wajib diisi
                  </p>
                )}
              </div>
            )}

            {/* Refund amount */}
            {confirmAction === 'REFUND_PROCESSING' && (
              <div className="space-y-1.5">
                <Label htmlFor="dialog-refund">Jumlah Refund</Label>
                <Input
                  id="dialog-refund"
                  type="number"
                  placeholder="Masukkan jumlah refund..."
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>
            )}

            {/* Replacement shipping */}
            {confirmAction === 'REPLACEMENT_SHIPPING' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="dialog-tracking">Nomor Resi</Label>
                  <Input
                    id="dialog-tracking"
                    placeholder="Masukkan nomor resi pengiriman pengganti..."
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dialog-provider">Provider Pengiriman</Label>
                  <Input
                    id="dialog-provider"
                    placeholder="JNE, J&T, SiCepat, dll..."
                    value={shippingProvider}
                    onChange={(e) => setShippingProvider(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E5E5EA]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmAction(null)}
              disabled={acting}
            >
              Batal
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={handleConfirmAction}
              disabled={acting || !canConfirmAction()}
            >
              {acting ? (
                <span className="animate-pulse">Memproses...</span>
              ) : (
                'Konfirmasi'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
