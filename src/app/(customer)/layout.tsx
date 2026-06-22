import Link from 'next/link';
import { Header } from '@/components/customer/header';
import { CartDrawer } from '@/components/customer/cart-drawer';
import { BottomNav } from '@/components/customer/bottom-nav';
import { WhatsAppWidget } from '@/components/customer/whatsapp-widget';
import { Separator } from '@/components/ui/separator';
import { MessageCircle } from 'lucide-react';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <CartDrawer />
      <main className="max-w-7xl mx-auto pb-24 lg:pb-12 min-h-screen">
        {children}
      </main>
      <DesktopFooter />
      <BottomNav />
      <WhatsAppWidget />
    </>
  );
}

function DesktopFooter() {
  return (
    <footer className="hidden lg:block bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand & Links */}
        <div className="grid grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-[#FBBF24]">SEPEDAMANIA</h3>
            <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
              Premium Bicycle Store. Tempat terbaik untuk menemukan sepeda impianmu.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <a
                href="https://wa.me/6281318986320"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#22C55E]/10 text-[#22C55E] text-xs font-medium rounded-lg hover:bg-[#22C55E]/20 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Kategori</h4>
            <ul className="space-y-2.5">
              <li><Link href="/kategori/mtb" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">MTB</Link></li>
              <li><Link href="/kategori/road-bike" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">Road Bike</Link></li>
              <li><Link href="/kategori/bmx" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">BMX</Link></li>
              <li><Link href="/kategori/fixie" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">Fixie</Link></li>
              <li><Link href="/kategori/city-bike" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">City Bike</Link></li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Layanan</h4>
            <ul className="space-y-2.5">
              <li><Link href="/pengembalian" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">Pengembalian</Link></li>
              <li><Link href="/pengiriman" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">Pengiriman</Link></li>
              <li><Link href="/syarat-ketentuan" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">Syarat &amp; Ketentuan</Link></li>
              <li><Link href="/kebijakan-privasi" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Bantuan</h4>
            <ul className="space-y-2.5">
              <li><Link href="/panduan" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">Panduan</Link></li>
              <li><Link href="/bike-finder" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">Bike Finder</Link></li>
              <li><Link href="/kontak" className="text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors">Hubungi Kami</Link></li>
              <li>
                <a
                  href="https://wa.me/6281318986320"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#FBBF24] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  +62 813-1898-6320
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E293B] my-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-[#64748B]">
            &copy; 2026 SEPEDAMANIA. All rights reserved.
          </p>
          <p className="text-xs text-[#64748B]">
            Premium Bicycle Store — Sepeda Berkualitas, Harga Terbaik.
          </p>
        </div>
      </div>
    </footer>
  );
}
