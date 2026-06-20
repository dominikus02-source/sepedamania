'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQty, getSubtotal, getCount } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#F8F9FA] shadow-2xl flex flex-col transition-transform duration-300 ease-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#111827]" />
            <h2 className="text-lg font-semibold text-[#111827]">Keranjang</h2>
            <span className="text-xs text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
              {getCount()} item
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-[#E5E7EB] mb-3" />
              <p className="text-sm text-[#6B7280]">Keranjang masih kosong</p>
              <button
                onClick={onClose}
                className="mt-4 text-sm font-medium text-[#0EA5E9] hover:text-[#0284C7]"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId || ''}`}
                className="flex gap-3 p-3 bg-white rounded-xl border border-[#E5E7EB] card-hover"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                  <Image
                    src={item.image || '/images/placeholder.svg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[#111827] truncate">{item.name}</h3>
                  {item.variantLabel && (
                    <p className="text-xs text-[#6B7280] mt-0.5">{item.variantLabel}</p>
                  )}
                  <p className="text-sm font-semibold text-[#111827] mt-1">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-0.5">
                      <button
                        onClick={() => updateQty(item.productId, item.variantId, item.qty - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                      >
                        <Minus className="w-3 h-3 text-[#6B7280]" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-[#111827]">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.variantId, item.qty + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                      >
                        <Plus className="w-3 h-3 text-[#6B7280]" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E5E7EB] bg-white px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Subtotal</span>
              <span className="text-lg font-bold text-[#111827]">{formatPrice(getSubtotal())}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Lanjut ke Checkout
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-center text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              Lanjut Belanja
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#0EA5E9] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
      {count > 9 ? '9+' : count}
    </span>
  );
}
