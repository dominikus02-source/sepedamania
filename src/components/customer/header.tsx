'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cart';
import { SepedamaniaLogo } from '@/components/brand/sepedamania-logo';
import { CartBadge } from './cart-drawer';
import { Search, ShoppingBag, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { data: session } = useSession();
  const openCart = useCartStore((s) => s.openCart);
  const totalItems = useCartStore((s) => s.getCount());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!session;
  const userName = session?.user?.name || 'User';
  const userRole = session?.user?.role;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <SepedamaniaLogo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/kategori" className="text-sm font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors">
                Kategori
              </Link>
              <Link href="/flash-sale" className="text-sm font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors">
                Flash Sale
              </Link>
              <Link href="/produk-terlaris" className="text-sm font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors">
                Terlaris
              </Link>
              <Link href="/bike-finder" className="text-sm font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors">
                Bike Finder
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search */}
              <Link href="/cari" className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <Search className="w-5 h-5 text-[#64748B]" />
              </Link>

              {/* Cart */}
              <button onClick={openCart} className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <ShoppingBag className="w-5 h-5 text-[#64748B]" />
                {totalItems > 0 && <CartBadge count={totalItems} />}
              </button>

              {/* User Menu */}
              {isLoggedIn ? (
                <UserMenu userName={userName} userRole={userRole} onSignOut={() => signOut({ callbackUrl: '/' })} />
              ) : (
                <Link href="/masuk" className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-medium rounded-lg transition-colors">
                  Masuk
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <Link href="/cari" className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <Search className="w-5 h-5 text-[#64748B]" />
              </Link>
              <button onClick={openCart} className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <ShoppingBag className="w-5 h-5 text-[#64748B]" />
                {totalItems > 0 && <CartBadge count={totalItems} />}
              </button>
              <button onClick={() => setMobileMenuOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <Menu className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A]">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]">
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              <Link href="/kategori" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg">
                Kategori
              </Link>
              <Link href="/flash-sale" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg">
                Flash Sale
              </Link>
              <Link href="/produk-terlaris" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg">
                Terlaris
              </Link>
              <Link href="/bike-finder" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg">
                Bike Finder
              </Link>
              <div className="border-t border-[#E2E8F0] my-2" />
              {isLoggedIn ? (
                <>
                  <Link href="/profil" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg">
                    Profil Saya
                  </Link>
                  <Link href="/pesanan" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg">
                    Pesanan Saya
                  </Link>
                  {userRole === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg">
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-[#E2E8F0] my-2" />
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg">
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <Link href="/masuk" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg">
                  Masuk / Daftar
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function UserMenu({ userName, userRole, onSignOut }: { userName: string; userRole?: string; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
        <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center">
          <span className="text-white text-sm font-medium">{userName.charAt(0).toUpperCase()}</span>
        </div>
        <span className="text-sm font-medium text-[#0F172A]">{userName}</span>
        <ChevronDown className="w-4 h-4 text-[#64748B]" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E2E8F0] z-50">
            <div className="p-3 border-b border-[#E2E8F0]">
              <p className="text-sm font-medium text-[#0F172A]">{userName}</p>
              {userRole && <p className="text-xs text-[#64748B]">{userRole}</p>}
            </div>
            <div className="p-2">
              <Link href="/profil" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg">
                Profil Saya
              </Link>
              <Link href="/pesanan" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg">
                Pesanan Saya
              </Link>
              {userRole === 'ADMIN' && (
                <Link href="/admin" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg">
                  Admin Panel
                </Link>
              )}
              <div className="border-t border-[#E2E8F0] my-1" />
              <button onClick={onSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg">
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
