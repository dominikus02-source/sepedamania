'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingCart } from 'lucide-react';
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
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const displayPrice = isOnSale ? product.salePrice! : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(isOnSale ? product.salePrice! : product.price),
      image: product.images[0] || '/images/placeholder.svg',
      maxStock: product.stock,
      weight: product.weight || 0,
      qty: 1,
    });
    toast('Ditambahkan ke keranjang!', 'success');
  };

  if (variant === 'horizontal') {
    return (
      <Link href={`/produk/${product.slug}`} className="flex gap-3 p-3 bg-white rounded-xl border border-[#E5E5EA] active:scale-[0.99] transition-transform">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F2F2F7] flex-shrink-0">
          <Image src={product.images[0] || '/images/placeholder.svg'} alt={product.name} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#8E8E93] mb-0.5">{product.category?.name}</p>
          <h3 className="text-sm font-medium text-[#1C1C1E] truncate">{product.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            {product.rating && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-[#F5A623] text-[#F5A623]" />
                <span className="text-xs text-[#8E8E93]">{product.rating}</span>
              </div>
            )}
            <span className="text-xs text-[#8E8E93]">| Terjual {product.sold}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-semibold text-sm text-[#1C1C1E]">{formatPrice(displayPrice)}</span>
            {isOnSale && (
              <span className="text-xs text-[#8E8E93] line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/produk/${product.slug}`} className="group block">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F2F2F7] mb-2 active:scale-[0.99] transition-transform">
        <Image
          src={product.images[0] || '/images/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, 33vw"
        />
        {isOnSale && (
          <Badge variant="warning" className="absolute top-2 left-2">
            Promo
          </Badge>
        )}
        {product.sold > 50 && (
          <Badge variant="primary" className="absolute top-2 right-2">
            Terlaris
          </Badge>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Habis</span>
          </div>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#F5A623] shadow-md flex items-center justify-center active:scale-90 transition-transform"
        >
          <ShoppingCart className="w-4.5 h-4.5 text-white" />
        </button>
      </div>
      <p className="text-xs text-[#8E8E93] mb-0.5">{product.category?.name}</p>
      <h3 className="text-sm font-medium text-[#1C1C1E] line-clamp-2 leading-tight mb-1">{product.name}</h3>
      <div className="flex items-center gap-1 mb-1">
        <Star className="w-3 h-3 fill-[#F5A623] text-[#F5A623]" />
        <span className="text-xs text-[#8E8E93]">{product.rating || 0}</span>
        <span className="text-xs text-[#8E8E93]">| Terjual {product.sold}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm text-[#1C1C1E]">{formatPrice(displayPrice)}</span>
        {isOnSale && (
          <span className="text-xs text-[#8E8E93] line-through">{formatPrice(product.price)}</span>
        )}
      </div>
    </Link>
  );
}
