'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  const totalItems = useCartStore((s) => s.getCount());

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[#E5E5EA]">
      <div className="max-w-lg mx-auto flex items-center justify-between h-12 px-4">
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F2F2F7] transition-colors">
              <Menu className="w-5 h-5 text-[#1C1C1E]" />
            </button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="p-4">
              <Link href="/" className="text-xl font-bold text-[#1A1A1A]">
                SEPEDAMANIA
              </Link>
              <nav className="mt-6 space-y-2">
                <Link href="/kategori/mtb" className="block px-3 py-2 rounded-lg hover:bg-[#F2F2F7] text-[#1C1C1E]">MTB</Link>
                <Link href="/kategori/road-bike" className="block px-3 py-2 rounded-lg hover:bg-[#F2F2F7] text-[#1C1C1E]">Road Bike</Link>
                <Link href="/kategori/bmx" className="block px-3 py-2 rounded-lg hover:bg-[#F2F2F7] text-[#1C1C1E]">BMX</Link>
                <Link href="/kategori/fixie" className="block px-3 py-2 rounded-lg hover:bg-[#F2F2F7] text-[#1C1C1E]">Fixie</Link>
                <Link href="/kategori/city-bike" className="block px-3 py-2 rounded-lg hover:bg-[#F2F2F7] text-[#1C1C1E]">City Bike</Link>
                <Link href="/kategori/aksesoris" className="block px-3 py-2 rounded-lg hover:bg-[#F2F2F7] text-[#1C1C1E]">Aksesoris</Link>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="text-lg font-bold tracking-tight text-[#1A1A1A]">
          SEPEDAMANIA
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/cari"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F2F2F7] transition-colors"
          >
            <Search className="w-5 h-5 text-[#1C1C1E]" />
          </Link>
          <Link
            href="/keranjang"
            className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F2F2F7] transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-[#1C1C1E]" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF3B30] text-white text-[10px] font-bold flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
