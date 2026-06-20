'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, ShoppingCart, Users, PackageSearch, Tags, Percent, Truck, CreditCard, BarChart3, Settings, MessageCircle } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produk', label: 'Produk', icon: Package },
  { href: '/admin/pesanan', label: 'Pesanan', icon: ShoppingCart },
  { href: '/admin/pelanggan', label: 'Pelanggan', icon: Users },
  { href: '/admin/stok', label: 'Stok & Inventori', icon: PackageSearch },
  { href: '/admin/kategori', label: 'Kategori & Merek', icon: Tags },
  { href: '/admin/diskon', label: 'Diskon & Voucher', icon: Percent },
  { href: '/admin/pengiriman', label: 'Pengiriman', icon: Truck },
  { href: '/admin/pembayaran', label: 'Pembayaran', icon: CreditCard },
  { href: '/admin/laporan', label: 'Laporan', icon: BarChart3 },
  { href: '/admin/chat', label: 'Chat Pelanggan', icon: MessageCircle },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-[#E5E5EA] overflow-y-auto z-30">
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-[#F5A623]/10 text-[#F5A623]' : 'text-[#8E8E93] hover:bg-[#F2F2F7] hover:text-[#1C1C1E]'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
