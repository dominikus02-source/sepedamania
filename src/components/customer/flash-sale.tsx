'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './product-card';

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

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="px-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
          <h2 className="text-lg font-bold text-[#1C1C1E]">Flash Sale</h2>
          <div className="flex items-center gap-1 text-sm font-mono">
            <span className="bg-[#1A1A1A] text-white px-1.5 py-0.5 rounded text-xs">{pad(timeLeft.hours)}</span>
            <span className="text-[#1C1C1E]">:</span>
            <span className="bg-[#1A1A1A] text-white px-1.5 py-0.5 rounded text-xs">{pad(timeLeft.minutes)}</span>
            <span className="text-[#1C1C1E]">:</span>
            <span className="bg-[#1A1A1A] text-white px-1.5 py-0.5 rounded text-xs">{pad(timeLeft.seconds)}</span>
          </div>
        </div>
        <button className="text-xs text-[#F5A623] font-medium">Lihat Semua</button>
      </div>
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-3">
          {products.map((product) => (
            <div key={product.id} className="min-w-[160px] max-w-[160px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
