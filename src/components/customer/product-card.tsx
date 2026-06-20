'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  variant?: 'default' | 'horizontal';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);

  const isOnSale = product.salePrice && product.salePrice < product.price;
  const dp = isOnSale ? product.salePrice! : product.price;
  const hasBadge = isOnSale || product.stock <= 5;

  const imgSrc = !imgError && product.images?.[0] ? product.images[0] : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
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

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/produk/${product.slug}`}
        className="flex gap-3 p-3 bg-white rounded-xl border border-[#E5E7EB] card-hover active:scale-[0.99] transition-transform"
      >
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F3F4F6] flex-shrink-0">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#E5E7EB] to-[#F3F4F6] flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto rounded-full bg-white/60 flex items-center justify-center mb-1">
                  <ShoppingBag className="w-4 h-4 text-[#9CA3AF]" />
                </div>
                <span className="text-[10px] text-[#9CA3AF] font-medium">{product.name.charAt(0)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#6B7280] mb-0.5">{product.category?.name}</p>
          <h3 className="text-sm font-medium text-[#111827] truncate">{product.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            {product.rating && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-[#0EA5E9] text-[#0EA5E9]" />
                <span className="text-xs text-[#6B7280]">{product.rating}</span>
              </div>
            )}
            <span className="text-xs text-[#6B7280]">| Terjual {product.sold}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-[#111827]">{formatPrice(dp)}</span>
            {isOnSale && (
              <span className="text-xs text-[#6B7280] line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/produk/${product.slug}`} className="group block">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F3F4F6] mb-2 card-hover">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 33vw"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E5E7EB] to-[#F3F4F6] flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
              <span className="text-xs text-[#9CA3AF] font-medium">{product.name}</span>
            </div>
          </div>
        )}
        {hasBadge && (
          <div className="absolute top-2 left-2 flex gap-1">
            {isOnSale && (
              <Badge variant="warning" className="text-[10px] px-1.5 py-0.5">
                -{Math.round((1 - product.salePrice! / product.price) * 100)}%
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                Sisa {product.stock}
              </Badge>
            )}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
              Habis
            </span>
          </div>
        )}

        {/* Quick add button — appears on hover */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#0EA5E9] hover:text-white"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      <div>
        <p className="text-xs text-[#6B7280] mb-0.5">{product.category?.name || 'Produk'}</p>
        <h3 className="text-sm font-medium text-[#111827] truncate leading-snug">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          {product.rating && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-[#0EA5E9] text-[#0EA5E9]" />
              <span className="text-xs text-[#6B7280]">{product.rating}</span>
            </div>
          )}
          <span className="text-xs text-[#6B7280]">| Terjual {product.sold}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-base font-bold text-[#111827]">{formatPrice(dp)}</span>
          {isOnSale && (
            <span className="text-xs text-[#6B7280] line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
