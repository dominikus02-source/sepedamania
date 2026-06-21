'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Star, Heart, Settings, LogOut, ChevronRight, Bell, Shield } from 'lucide-react';

interface ProfileUser {
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { orders: number; reviews: number };
  addresses: unknown[];
}

export function ProfilePage({ user }: { user: ProfileUser }) {

  const menuItems = [
    { icon: Package, label: 'Pesanan Saya', href: '/pesanan', desc: ` ${user._count.orders} pesanan` },
    { icon: MapPin, label: 'Daftar Alamat', href: '#', desc: `${user.addresses.length} alamat` },
    { icon: Star, label: 'Ulasan Saya', href: '#', desc: `${user._count.reviews} ulasan` },
    { icon: Heart, label: 'Wishlist / Favorit', href: '#' },
    { icon: Bell, label: 'Pengaturan Notifikasi', href: '#' },
    { icon: Settings, label: 'Pengaturan Akun', href: '#' },
    ...(user.role === 'ADMIN' ? [{ icon: Shield, label: 'Admin Panel', href: '/admin' }] : []),
  ];

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl border border-[#E5E5EA] p-4 flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-[#F5A623] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#1C1C1E]">{user.name}</h1>
          <p className="text-sm text-[#8E8E93]">{user.email}</p>
          <p className="text-xs text-[#8E8E93] mt-0.5">Bergabung {formatDate(user.createdAt)}</p>
        </div>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5E5EA] active:scale-[0.99] transition-transform">
              <div className="w-9 h-9 rounded-lg bg-[#F2F2F7] flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#1C1C1E]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1C1C1E]">{item.label}</p>
                {item.desc && <p className="text-xs text-[#8E8E93]">{item.desc}</p>}
              </div>
              <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
            </Link>
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        <Badge variant={user.role === 'ADMIN' ? 'primary' : 'default'} className="w-full justify-center py-2">
          {user.role === 'ADMIN' ? 'Admin Panel' : 'Pelanggan'}
        </Badge>
        {user.role === 'ADMIN' && (
          <Link href="/admin"><Button variant="outline" className="w-full">Dashboard Admin</Button></Link>
        )}
      </div>

      <div className="mt-4">
        <Button variant="ghost" className="w-full text-[#FF3B30]" onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut className="w-4 h-4 mr-2" /> Keluar
        </Button>
      </div>
    </div>
  );
}
