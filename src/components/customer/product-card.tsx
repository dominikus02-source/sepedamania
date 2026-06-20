'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingBag } from 'lucide-react';
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
    <Link href={`/produk/${product.slug}`} className="group block bg-white rounded-2xl border border-[#E2E8F0] p-2.5 card-hover">
      {/* Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F1F5F9] mb-2.5">
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
        <div className="absolute top-2 left-2 flex gap-1">
          {isOnSale && (
            <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              -{discountPct}%
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="bg-[#0F172A] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
              Sisa {product.stock}
            </span>
          )}
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white font-semibold text-xs bg-black/70 px-3 py-1 rounded-full">Habis</span>
          </div>
        )}

        {/* Quick add — visible on hover */}
        {product.stock > 0 && (
          <button
            onClick={handleAdd}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#0F172A] hover:text-white"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">{product.category?.name || 'Produk'}</p>
        <h3 className="text-xs sm:text-sm font-semibold text-[#0F172A] leading-snug line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
          {product.rating && (
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
              {product.rating}
            </span>
          )}
          <span>{product.sold} terjual</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-bold text-[#0F172A]">{formatPrice(dp)}</span>
          {isOnSale && (
            <span className="text-[10px] sm:text-xs text-[#94A3B8] line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
