'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Bell, ShoppingBag, Truck, Tag, Star } from 'lucide-react';

const notifications = [
  { id: 'order', label: 'Update Pesanan', desc: 'Notifikasi perubahan status pesanan', icon: Truck, enabled: true },
  { id: 'promo', label: 'Promo & Diskon', desc: 'Info flash sale, voucher, dan promo terbaru', icon: Tag, enabled: true },
  { id: 'cart', label: 'Keranjang', desc: 'Pengingat produk di keranjang', icon: ShoppingBag, enabled: false },
  { id: 'review', label: 'Ulasan', desc: 'Pengingat untuk memberikan ulasan', icon: Star, enabled: true },
];

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState(notifications);

  const toggle = (id: string) => {
    setSettings((prev) => prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/profil" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-[#0F172A]">Pengaturan Notifikasi</h1>
      </div>

      <div className="space-y-2">
        {settings.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#0F172A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0F172A]">{item.label}</p>
                <p className="text-xs text-[#64748B]">{item.desc}</p>
              </div>
              <button
                onClick={() => toggle(item.id)}
                className={`relative w-11 h-6 rounded-full transition-colors ${item.enabled ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${item.enabled ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-[#F1F5F9] rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-[#64748B]" />
          <p className="text-xs text-[#64748B]">Notifikasi dikirim melalui email dan WhatsApp (jika terdaftar)</p>
        </div>
      </div>
    </div>
  );
}
