'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Star, Heart, Settings, LogOut, ChevronRight, Bell, Shield } from 'lucide-react';

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number; reviews: number };
  addresses: unknown[];
}

export function ProfilePage({ user }: { user: ProfileUser }) {
  const menuItems = [
    { icon: Package, label: 'Pesanan Saya', href: '/pesanan', desc: `${user._count.orders} pesanan` },
    { icon: MapPin, label: 'Daftar Alamat', href: '/profil/alamat', desc: `${user.addresses.length} alamat` },
    { icon: Star, label: 'Ulasan Saya', href: '/profil/ulasan', desc: `${user._count.reviews} ulasan` },
    { icon: Heart, label: 'Wishlist / Favorit', href: '/profil/wishlist' },
    { icon: Bell, label: 'Pengaturan Notifikasi', href: '/profil/notifikasi' },
    { icon: Settings, label: 'Pengaturan Akun', href: '/profil/pengaturan' },
    ...(user.role === 'ADMIN' ? [{ icon: Shield, label: 'Admin Panel', href: '/admin' }] : []),
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex items-center gap-4 mb-4 card-hover">
        <div className="w-16 h-16 rounded-full bg-[#0F172A] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#0F172A]">{user.name}</h1>
          <p className="text-sm text-[#64748B]">{user.email}</p>
          <p className="text-xs text-[#94A3B8] mt-0.5">Bergabung {formatDate(user.createdAt)}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-[#E2E8F0] card-hover active:scale-[0.99] transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#0F172A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0F172A]">{item.label}</p>
                {item.desc && <p className="text-xs text-[#64748B]">{item.desc}</p>}
              </div>
              <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="mt-6">
        <Button variant="outline" className="w-full h-11 text-[#EF4444] border-[#FECACA] hover:bg-[#FEF2F2]" onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut className="w-4 h-4 mr-2" /> Keluar
        </Button>
      </div>
    </div>
  );
}
