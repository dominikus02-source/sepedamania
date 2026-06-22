'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, ShoppingCart, Users, PackageSearch, Tags, Percent, Truck, CreditCard, BarChart3, Settings, MessageCircle, RotateCcw } from 'lucide-react';

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
  { href: '/admin/pengembalian', label: 'Pengembalian', icon: RotateCcw },
  { href: '/admin/chat', label: 'Chat Pelanggan', icon: MessageCircle },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
];

const SidebarItem = memo(function SidebarItem({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
        isActive
          ? 'bg-[#EFF6FF] text-[#2563EB]'
          : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
});

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-[#E2E8F0] overflow-y-auto z-30">
      <nav className="p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isActive}
            />
          );
        })}
      </nav>
    </aside>
  );
}
