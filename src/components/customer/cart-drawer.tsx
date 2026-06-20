'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, getSubtotal, getCount } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeCart]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={closeCart} />
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0F172A]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Keranjang</h2>
            <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
              {getCount()} item
            </span>
          </div>
          <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors">
            <X className="w-4 h-4 text-[#64748B]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-10 h-10 text-[#E2E8F0] mb-3" />
              <p className="text-sm text-[#64748B]">Keranjang masih kosong</p>
              <button onClick={closeCart} className="mt-3 text-sm font-medium text-[#2563EB]">
                Mulai Belanja
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variantId || ''}`} className="flex gap-3 p-3 bg-white rounded-xl border border-[#E2E8F0]">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                  <Image src={item.image || '/images/placeholder.svg'} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[#0F172A] truncate">{item.name}</h3>
                  {item.variantLabel && <p className="text-xs text-[#64748B] mt-0.5">{item.variantLabel}</p>}
                  <p className="text-sm font-semibold text-[#0F172A] mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-0.5 bg-[#F1F5F9] rounded-lg p-0.5">
                      <button onClick={() => updateQty(item.productId, item.variantId, item.qty - 1)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors">
                        <Minus className="w-3 h-3 text-[#64748B]" />
                      </button>
                      <span className="w-7 text-center text-sm font-medium text-[#0F172A]">{item.qty}</span>
                      <button onClick={() => updateQty(item.productId, item.variantId, item.qty + 1)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors">
                        <Plus className="w-3 h-3 text-[#64748B]" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.productId, item.variantId)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEF2F2] transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#E2E8F0] px-4 py-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748B]">Subtotal</span>
              <span className="text-lg font-bold text-[#0F172A]">{formatPrice(getSubtotal())}</span>
            </div>
            <Link href="/keranjang" onClick={closeCart} className="block w-full text-center bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              Lihat Keranjang
            </Link>
            <Link href="/checkout" onClick={closeCart} className="block w-full text-center border border-[#E2E8F0] text-[#0F172A] font-medium py-3 rounded-xl hover:bg-[#F1F5F9] transition-colors text-sm">
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0F172A] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
      {count > 9 ? '9+' : count}
    </span>
  );
}
