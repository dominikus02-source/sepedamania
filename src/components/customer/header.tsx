'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { CartDrawer, CartBadge } from './cart-drawer';

const NAV_ITEMS = [
  { href: '/kategori/mtb', label: 'MTB' },
  { href: '/kategori/road-bike', label: 'Road Bike' },
  { href: '/kategori/bmx', label: 'BMX' },
  { href: '/kategori/fixie', label: 'Fixie' },
  { href: '/kategori/city-bike', label: 'City Bike' },
  { href: '/kategori/aksesoris', label: 'Aksesoris' },
];

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getCount());

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto">
          {/* Desktop header */}
          <div className="hidden lg:flex items-center justify-between h-16 px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/logo-sepedamania.webp"
                alt="SEPEDAMANIA"
                width={140}
                height={32}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Link
                href="/cari"
                className="flex items-center gap-2 px-3.5 py-2 text-sm text-[#64748B] bg-[#F1F5F9] rounded-xl hover:bg-[#E2E8F0] transition-colors min-w-[200px]"
              >
                <Search className="w-4 h-4" />
                <span>Cari sepeda...</span>
              </Link>

              {/* Wishlist */}
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <Heart className="w-5 h-5 text-[#64748B]" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <ShoppingBag className="w-5 h-5 text-[#0F172A]" />
                <CartBadge count={totalItems} />
              </button>

              {/* Profile */}
              <Link
                href="/profil"
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <User className="w-5 h-5 text-[#64748B]" />
              </Link>
            </div>
          </div>

          {/* Mobile header */}
          <div className="flex lg:hidden items-center justify-between h-14 px-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              <Menu className="w-5 h-5 text-[#0F172A]" />
            </button>

            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-sepedamania.webp"
                alt="SEPEDAMANIA"
                width={110}
                height={26}
                className="h-6 w-auto object-contain"
                priority
              />
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href="/cari"
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <Search className="w-5 h-5 text-[#0F172A]" />
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <ShoppingBag className="w-5 h-5 text-[#0F172A]" />
                <CartBadge count={totalItems} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile side menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl">
            <div className="flex items-center justify-between px-4 h-14 border-b border-[#E2E8F0]">
              <Image
                src="/images/logo-sepedamania.webp"
                alt="SEPEDAMANIA"
                width={120}
                height={28}
                className="h-6 w-auto"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl hover:bg-[#F1F5F9] text-[#0F172A] font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-[#E2E8F0] my-3" />
              <Link
                href="/pesanan"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-xl hover:bg-[#F1F5F9] text-[#0F172A] font-medium"
              >
                Pesanan Saya
              </Link>
              <Link
                href="/profil"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-xl hover:bg-[#F1F5F9] text-[#0F172A] font-medium"
              >
                Profil
              </Link>
            </nav>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
