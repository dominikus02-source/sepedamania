'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronLeft, Menu } from 'lucide-react';
import { ADMIN_NAV_ITEMS, isAdminRouteActive } from '@/config/admin-navigation';
import { AdminRoutePrefetcher } from '@/components/admin/route-prefetcher';

function SidebarItem({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
        isActive
          ? 'bg-[#EFF6FF] text-[#2563EB]'
          : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SidebarDesktop({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-[#E2E8F0] overflow-y-auto z-30 flex-col">
      <nav className="p-3 space-y-0.5 flex-1">
        {ADMIN_NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={isAdminRouteActive(pathname, item.href)}
          />
        ))}
      </nav>
    </aside>
  );
}

function SidebarMobile({
  pathname,
  open,
  onClose,
}: {
  pathname: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-[#E2E8F0] z-50 lg:hidden transition-transform duration-200 ease-out overflow-y-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-3 space-y-0.5">
          {ADMIN_NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isAdminRouteActive(pathname, item.href)}
              onClick={onClose}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

function AdminHeader({
  user,
  onMenuClick,
}: {
  user: { name?: string | null };
  onMenuClick: () => void;
}) {
  const pathname = usePathname();
  const title = pathname.split('/').filter(Boolean).pop() || 'Dashboard';
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0F172A] flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-sm font-bold text-[#0F172A]">Sepedamania</span>
          <span className="text-[10px] text-[#2563EB] font-medium bg-[#EFF6FF] px-1.5 py-0.5 rounded-md hidden sm:inline">Admin</span>
        </Link>
        <span className="text-sm text-[#94A3B8] hidden sm:inline">/ {displayTitle}</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" className="text-xs text-[#94A3B8] hover:text-[#0F172A] flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-3 h-3" /> Lihat Toko
        </Link>
        <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-xs font-bold text-white shrink-0">
          {user.name?.charAt(0).toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}

export function AdminShell({
  user,
  children,
}: {
  user: { name?: string | null };
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminRoutePrefetcher />
      <AdminHeader
        user={user}
        onMenuClick={() => setMobileOpen((v) => !v)}
      />
      <SidebarDesktop pathname={pathname} />
      <SidebarMobile pathname={pathname} open={mobileOpen} onClose={closeMobile} />
      <main className="flex-1 lg:ml-64 pt-14 p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
