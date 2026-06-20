'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Search, ShoppingCart, Package, User } from 'lucide-react';
import { useCartStore } from '@/store/cart';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/cari', label: 'Cari', icon: Search },
  { href: '/keranjang', label: 'Keranjang', icon: ShoppingCart, cart: true },
  { href: '/pesanan', label: 'Pesanan', icon: Package },
  { href: '/profil', label: 'Profil', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-[#E5E5EA] pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center w-16 h-full transition-colors duration-200',
                isActive ? 'text-[#F5A623]' : 'text-[#8E8E93]'
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.cart && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FF3B30] text-white text-[10px] font-bold flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
