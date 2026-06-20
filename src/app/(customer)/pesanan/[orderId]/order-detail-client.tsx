'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge } from '@/components/customer/order-status-badge';
import { Loader2, ArrowLeft, Copy, ExternalLink, MessageCircle, Clock, Package, Truck, CheckCircle, AlertCircle, Banknote } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

const STATUS_STEPS = ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const;

export function OrderDetailClient({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = () =>
      fetch(`/api/orders/${orderId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setOrder(data);
        })
        .catch(() => setOrder(null))
        .finally(() => setLoading(false));

    fetchOrder();

    // Auto-refresh every 10 detik jika masih PENDING_PAYMENT
    const interval = setInterval(() => {
      fetchOrder();
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast('Teks disalin', 'success');
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5A623] mx-auto mb-3" />
          <p className="text-sm text-[#8E8E93]">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 text-center py-20">
        <Package className="w-12 h-12 text-[#E5E5EA] mx-auto mb-3" />
        <p className="text-[#8E8E93]">Pesanan tidak ditemukan</p>
        <Link href="/pesanan"><Button variant="accent" className="mt-4">Lihat Semua Pesanan</Button></Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="pb-8">
      {status === 'success' && (
        <div className="bg-[#34C759] p-4 text-white text-center">
          <CheckCircle className="w-10 h-10 mx-auto mb-2" />
          <p className="text-lg font-bold">Pembayaran Berhasil!</p>
          <p className="text-sm opacity-90">Pesanan akan segera diproses</p>
        </div>
      )}
      {status === 'failed' && (
        <div className="bg-[#FF3B30] p-4 text-white text-center">
          <AlertCircle className="w-10 h-10 mx-auto mb-2" />
          <p className="text-lg font-bold">Pembayaran Gagal</p>
          <p className="text-sm opacity-90">Silakan coba lagi atau hubungi CS</p>
        </div>
      )}

      <div className="p-4">
        <Link href="/pesanan" className="inline-flex items-center gap-1 text-sm text-[#8E8E93] mb-4"><ArrowLeft className="w-4 h-4" />Kembali</Link>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-[#1C1C1E]">Pesanan #{order.id.slice(0, 8)}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-xs text-[#8E8E93] font-mono">ID: {order.id}</p>
        <p className="text-xs text-[#8E8E93] mt-1">{formatDate(order.createdAt)}</p>

        {order.status === 'PENDING_PAYMENT' && (
          <div className="mt-4 p-4 bg-[#F5A623]/10 rounded-xl border border-[#F5A623]/20">
            <div className="flex items-center gap-2 mb-2"><Clock className="w-5 h-5 text-[#F5A623]" /><span className="font-semibold text-sm">Menunggu Pembayaran</span></div>
            <p className="text-xs text-[#8E8E93]">Silakan selesaikan pembayaran sebelum batas waktu habis.</p>
            {order.paymentMethod && <p className="text-xs text-[#8E8E93] mt-2">Metode: {order.paymentMethod}</p>}
          </div>
        )}

        {order.status === 'SHIPPED' && order.trackingNumber && (
          <div className="mt-4 p-4 bg-[#34C759]/10 rounded-xl border border-[#34C759]/20">
            <div className="flex items-center gap-2 mb-2"><Truck className="w-5 h-5 text-[#34C759]" /><span className="font-semibold text-sm">Dalam Pengiriman</span></div>
            <p className="text-xs text-[#8E8E93]">Resi: <span className="font-mono font-medium">{order.trackingNumber}</span></p>
            <Button variant="outline" size="sm" className="mt-2">Lacak Paket</Button>
          </div>
        )}

        {order.status !== 'PENDING_PAYMENT' && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3">Status Pesanan</h3>
            <div className="space-y-0">
              {STATUS_STEPS.map((step, i) => {
                const labels = ['Pesanan Dibuat', 'Pembayaran Dikonfirmasi', 'Sedang Diproses', 'Dalam Pengiriman', 'Pesanan Selesai'];
                const isActive = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-[#F5A623]' : 'bg-[#F2F2F7]'}`}>
                        {i < currentStepIndex ? <CheckCircle className="w-3 h-3 text-white" /> : <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-[#E5E5EA]'}`} />}
                      </div>
                      {i < STATUS_STEPS.length - 1 && <div className={`w-[1px] h-6 ${i < currentStepIndex ? 'bg-[#F5A623]' : 'bg-[#E5E5EA]'}`} />}
                    </div>
                    <div className={`pb-4 ${isCurrent ? 'text-[#1C1C1E]' : 'text-[#8E8E93]'}`}>
                      <p className={`text-sm font-medium ${isCurrent ? 'font-semibold' : ''}`}>{labels[i]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3">Produk Dipesan</h3>
          <div className="space-y-3">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F2F2F7] flex-shrink-0">
                  <Image src={item.image || '/images/placeholder.svg'} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1C1C1E]">{item.name}</p>
                  <p className="text-xs text-[#8E8E93]">{item.qty}x {formatPrice(item.price)}</p>
                  <p className="text-sm font-semibold mt-1">{formatPrice(item.price * item.qty)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl border border-[#E5E5EA] p-4 space-y-2">
          <h3 className="text-sm font-semibold text-[#1C1C1E] mb-2">Informasi Pengiriman</h3>
          {(() => {
            const addr = order.shippingAddress as Record<string, string> | null;
            if (!addr || typeof addr !== 'object') return null;
            return <>
              <p className="text-sm text-[#1C1C1E]">{addr.recipient}</p>
              <p className="text-xs text-[#8E8E93]">{addr.phone}</p>
              <p className="text-xs text-[#8E8E93]">{addr.detail}, {addr.district}, {addr.city}, {addr.province} {addr.postalCode}</p>
            </>;
          })()}
          <Separator />
          <div className="flex justify-between text-sm"><span className="text-[#8E8E93]">Kurir</span><span>{order.courier} {order.courierService}</span></div>
        </div>

        <div className="mt-4 bg-white rounded-xl border border-[#E5E5EA] p-4 space-y-2">
          <h3 className="text-sm font-semibold text-[#1C1C1E] mb-2">Rincian Pembayaran</h3>
          <div className="flex justify-between text-sm"><span className="text-[#8E8E93]">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#8E8E93]">Ongkos Kirim</span><span>{formatPrice(order.shippingCost)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-[#34C759]">Diskon</span><span className="text-[#34C759]">-{formatPrice(order.discount)}</span></div>}
          <Separator />
          <div className="flex justify-between font-bold text-[#1C1C1E]"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#8E8E93]">Metode Bayar</span><span>{order.paymentMethod}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#8E8E93]">Status Bayar</span><Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'warning'}>{order.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Dibayar'}</Badge></div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => copyToClipboard(order.id)}><Copy className="w-4 h-4 mr-1" /> Salin ID</Button>
          <a href={`https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20bertanya%20tentang%20pesanan%20#${order.id.slice(0, 8)}`} target="_blank" className="flex-1">
            <Button variant="accent" className="w-full"><MessageCircle className="w-4 h-4 mr-1" /> Hubungi CS</Button>
          </a>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const items = order.items.map((item: any) => ({
                productId: item.productId,
                variantId: item.variantId,
                name: item.name,
                price: item.price,
                image: item.image,
                maxStock: 999,
                weight: 0,
              }));
              items.forEach((item: any) => {
                const stored = localStorage.getItem('sepedamania-cart');
                const cart = stored ? JSON.parse(stored) : { state: { items: [] }, version: 0 };
                const existing = cart.state.items.find((i: any) => i.productId === item.productId && i.variantId === item.variantId);
                if (existing) existing.qty += item.qty;
                else cart.state.items.push({ ...item, qty: item.qty, id: `${item.productId}-${item.variantId || 'default'}` });
                localStorage.setItem('sepedamania-cart', JSON.stringify(cart));
              });
              toast('Produk ditambahkan ke keranjang!', 'success');
            }}
          >
            Beli Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}
