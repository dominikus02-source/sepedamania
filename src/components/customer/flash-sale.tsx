'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from './product-card';
import { Zap, ChevronRight } from 'lucide-react';

interface FlashSaleProduct {
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
}

export function FlashSale({ products }: { products: FlashSaleProduct[] }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">Flash Sale</h2>
          </div>
          <div className="flex items-center gap-0.5 text-xs font-mono font-bold text-[#EF4444] ml-1 bg-[#FEF2F2] px-2 py-1 rounded-lg">
            <span>{pad(timeLeft.hours)}</span>
            <span className="text-[#FCA5A5]">:</span>
            <span>{pad(timeLeft.minutes)}</span>
            <span className="text-[#FCA5A5]">:</span>
            <span>{pad(timeLeft.seconds)}</span>
          </div>
        </div>
        <Link href="/kategori?sort=sold" className="flex items-center gap-0.5 text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
          Lihat Semua <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
          {products.map((product) => (
            <div key={product.id} className="min-w-[160px] sm:min-w-0 w-[160px] sm:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
