'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/ui/toaster';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    images: string[];
    sold: number;
    rating?: number;
    category?: { name: string };
    stock: number;
    weight: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);

  const isOnSale = product.salePrice && product.salePrice < product.price;
  const dp = isOnSale ? product.salePrice! : product.price;
  const imgSrc = !imgError && product.images?.[0] ? product.images[0] : null;
  const discountPct = isOnSale ? Math.round((1 - product.salePrice! / product.price) * 100) : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: dp,
      image: product.images[0] || '/images/placeholder.svg',
      maxStock: product.stock,
      weight: product.weight || 0,
      qty: 1,
    });
    toast('Ditambahkan ke keranjang!', 'success');
  };

  return (
    <Link href={`/produk/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F1F5F9] mb-3 card-hover">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover product-img-zoom"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-[#94A3B8]" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {isOnSale && (
            <span className="bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              -{discountPct}%
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="bg-[#0F172A] text-white text-[11px] font-medium px-2 py-0.5 rounded-md shadow-sm">
              Sisa {product.stock}
            </span>
          )}
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white font-semibold text-sm bg-black/70 px-4 py-1.5 rounded-full">Habis</span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <Heart className="w-4 h-4 text-[#64748B]" />
        </button>

        {/* Quick add */}
        {product.stock > 0 && (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 h-9 px-3 rounded-lg bg-white shadow-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#0F172A] hover:text-white text-sm font-medium text-[#0F172A]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tambah</span>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <p className="text-xs text-[#64748B] font-medium">{product.category?.name || 'Produk'}</p>
        <h3 className="text-sm font-semibold text-[#0F172A] leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          {product.rating && (
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
              {product.rating}
            </span>
          )}
          <span>Terjual {product.sold}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-[#0F172A]">{formatPrice(dp)}</span>
          {isOnSale && (
            <span className="text-xs text-[#94A3B8] line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
