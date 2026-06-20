'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QuantityPicker } from '@/components/ui/quantity-picker';
import { EmptyState } from '@/components/ui/empty-state';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/ui/toaster';
import { Trash2, ShoppingBag, ChevronRight, Tag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQty, getTotal, voucherCode, voucherDiscount, applyVoucher, removeVoucher } = useCartStore();
  const subtotal = getTotal();
  const total = subtotal - voucherDiscount;
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="p-4">
        <EmptyState icon={<ShoppingBag className="w-8 h-8 text-[#8E8E93]" />} title="Keranjang Kosong" description="Belum ada produk di keranjang. Yuk, mulai belanja!"
          action={<Link href="/"><Button variant="accent">Mulai Belanja</Button></Link>} />
      </div>
    );
  }

  const handleApplyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;
    if (code === 'SEPEDA10') {
      applyVoucher(code, subtotal * 0.1);
      toast('Voucher berhasil diterapkan!', 'success');
      setVoucherInput('');
      setVoucherError('');
    } else {
      setVoucherError('Kode voucher tidak valid');
    }
  };

  return (
    <div className="p-4 pb-32">
      <h1 className="text-xl font-bold text-[#1C1C1E] mb-4">Keranjang</h1>
      <div className="space-y-3">
        {items.map((item) => {
          const cartKey = `${item.productId}::${item.variantId || ''}`;
          return (
          <div key={cartKey} className="flex gap-3 p-3 bg-white rounded-xl border border-[#E5E5EA]">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F2F2F7] flex-shrink-0">
              <Image src={item.image || '/images/placeholder.svg'} alt={item.name} fill className="object-cover" sizes="80px" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-[#1C1C1E] truncate">{item.name}</h3>
                  {item.variantLabel && <p className="text-xs text-[#8E8E93] mt-0.5">Varian: {item.variantLabel}</p>}
                </div>
                <button onClick={() => { removeItem(item.productId, item.variantId); toast('Produk dihapus', 'info'); }} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F2F2F7] flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-[#8E8E93]" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold text-sm text-[#1C1C1E]">{formatPrice(item.price)}</span>
                <QuantityPicker value={item.qty} min={1} max={item.maxStock} size="sm" onChange={(q) => updateQty(item.productId, item.variantId, q)} />
              </div>
              <p className="text-xs text-[#8E8E93] mt-1">Subtotal: {formatPrice(item.price * item.qty)}</p>
            </div>
          </div>
        )})}
      </div>

      <div className="mt-4 p-3 bg-white rounded-xl border border-[#E5E5EA]">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#8E8E93]" />
          <input type="text" placeholder="Masukkan kode voucher" value={voucherInput} onChange={(e) => setVoucherInput(e.target.value)} className="flex-1 text-sm bg-transparent outline-none" />
          <Button variant="outline" size="sm" onClick={handleApplyVoucher}>Pakai</Button>
        </div>
        {voucherError && <p className="text-xs text-[#FF3B30] mt-1">{voucherError}</p>}
        {voucherCode && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E5EA]">
            <span className="text-xs text-[#34C759]">Voucher {voucherCode} diterapkan</span>
            <button onClick={removeVoucher} className="text-xs text-[#FF3B30]">Hapus</button>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-white rounded-xl border border-[#E5E5EA] space-y-2">
        <div className="flex justify-between text-sm"><span className="text-[#8E8E93]">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        {voucherDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-[#34C759]">Diskon</span><span className="text-[#34C759]">-{formatPrice(voucherDiscount)}</span></div>}
        <div className="flex justify-between text-sm"><span className="text-[#8E8E93]">Ongkos Kirim</span><span>Dihitung nanti</span></div>
        <Separator />
        <div className="flex justify-between font-semibold text-[#1C1C1E]"><span>Total</span><span>{formatPrice(total)}</span></div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5EA] px-4 py-3 pb-safe">
        <div className="max-w-lg mx-auto">
          <Button variant="accent" className="w-full h-12 text-base" onClick={() => router.push('/checkout')}>
            Lanjut ke Pembayaran <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
