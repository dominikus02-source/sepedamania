'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/ui/toaster';
import { Heart, ChevronLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';

export default function WishlistPage() {
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();
  const [items, setItems] = useState(mockProducts.filter((p) => p.stock > 0).slice(0, 6));

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    toast('Dihapus dari wishlist', 'info');
  };

  const addToCart = (product: (typeof mockProducts)[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.salePrice ?? product.price,
      image: product.images[0] || '/images/placeholder.svg',
      maxStock: product.stock,
      weight: product.weight,
      qty: 1,
    });
    toast('Ditambahkan ke keranjang!', 'success');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/profil" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-[#0F172A]">Wishlist</h1>
        <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">{items.length} item</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
          <p className="text-sm text-[#64748B]">Wishlist masih kosong</p>
          <Link href="/"><Button variant="outline" className="mt-3">Temukan Produk</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-3 flex items-center gap-3">
              <Link href={`/produk/${product.slug}`} className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                <Image src={product.images[0] || '/images/placeholder.svg'} alt={product.name} fill className="object-cover" sizes="64px" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/produk/${product.slug}`}>
                  <p className="text-sm font-medium text-[#0F172A] truncate">{product.name}</p>
                </Link>
                <p className="text-sm font-bold text-[#0F172A] mt-0.5">{formatPrice(product.salePrice ?? product.price)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={() => addToCart(product)} className="flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                    <ShoppingBag className="w-3 h-3" /> Keranjang
                  </button>
                  <button onClick={() => removeItem(product.id)} className="flex items-center gap-1 text-xs font-medium text-[#EF4444] hover:text-[#DC2626] transition-colors">
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
