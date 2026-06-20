'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './product-card';
import { Zap } from 'lucide-react';

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
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#111827] font-display">Flash Sale</h2>
          <div className="flex items-center gap-1 text-sm font-mono font-bold text-[#EF4444]">
            <span className="bg-[#FEE2E2] px-1.5 py-0.5 rounded">{pad(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-[#FEE2E2] px-1.5 py-0.5 rounded">{pad(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-[#FEE2E2] px-1.5 py-0.5 rounded">{pad(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
          {products.map((product) => (
            <div key={product.id} className="min-w-[160px] sm:min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
