'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartDrawer, CartBadge } from './cart-drawer';

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getCount());

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors lg:hidden">
                <Menu className="w-5 h-5 text-[#111827]" />
              </button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="p-4">
                <Link href="/" className="block mb-6">
                  <Image
                    src="/images/logo-sepedamania.png"
                    alt="SEPEDAMANIA"
                    width={160}
                    height={40}
                    className="h-8 w-auto object-contain"
                    priority
                  />
                </Link>
                <nav className="space-y-1">
                  {[
                    { href: '/kategori/mtb', label: 'MTB' },
                    { href: '/kategori/road-bike', label: 'Road Bike' },
                    { href: '/kategori/bmx', label: 'BMX' },
                    { href: '/kategori/fixie', label: 'Fixie' },
                    { href: '/kategori/city-bike', label: 'City Bike' },
                    { href: '/kategori/aksesoris', label: 'Aksesoris' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2.5 rounded-lg hover:bg-[#F3F4F6] text-[#111827] font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-sepedamania.webp"
              alt="SEPEDAMANIA"
              width={120}
              height={28}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: '/kategori/mtb', label: 'MTB' },
              { href: '/kategori/road-bike', label: 'Road Bike' },
              { href: '/kategori/bmx', label: 'BMX' },
              { href: '/kategori/fixie', label: 'Fixie' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] rounded-lg hover:bg-[#F3F4F6] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/cari"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
            >
              <Search className="w-5 h-5 text-[#111827]" />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-[#111827]" />
              <CartBadge count={totalItems} />
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
