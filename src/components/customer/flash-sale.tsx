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
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] font-display">Flash Sale</h2>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#EF4444] mt-0.5">
              <span className="bg-[#FEF2F2] px-1.5 py-0.5 rounded">{pad(timeLeft.hours)}</span>
              <span>:</span>
              <span className="bg-[#FEF2F2] px-1.5 py-0.5 rounded">{pad(timeLeft.minutes)}</span>
              <span>:</span>
              <span className="bg-[#FEF2F2] px-1.5 py-0.5 rounded">{pad(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>
        <Link href="/kategori?sort=sold" className="flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
          Lihat Semua <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-5">
          {products.map((product) => (
            <div key={product.id} className="min-w-[170px] sm:min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
