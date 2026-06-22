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
    <footer className="hidden lg:block bg-white border-t border-[#E5E5EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Brand & Links */}
        <div className="grid grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-[#1C1C1E]">SEPEDAMANIA</h3>
            <p className="text-sm text-[#8E8E93] mt-2 leading-relaxed">
              Toko sepeda online terpercaya dengan berbagai pilihan sepeda dan aksesoris
              untuk mendukung gaya hidup aktif Anda.
            </p>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-sm font-semibold text-[#1C1C1E] mb-3">Layanan</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/pengembalian" className="text-sm text-[#8E8E93] hover:text-[#F5A623] transition-colors">
                  Pengembalian
                </Link>
              </li>
              <li>
                <Link href="/pengiriman" className="text-sm text-[#8E8E93] hover:text-[#F5A623] transition-colors">
                  Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="text-sm text-[#8E8E93] hover:text-[#F5A623] transition-colors">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-sm font-semibold text-[#1C1C1E] mb-3">Bantuan</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/kebijakan-privasi" className="text-sm text-[#8E8E93] hover:text-[#F5A623] transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-sm text-[#8E8E93] hover:text-[#F5A623] transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/6281318986320"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#8E8E93] hover:text-[#F5A623] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-[#8E8E93]">
            &copy; 2026 SEPEDAMANIA. All rights reserved.
          </p>
          <p className="text-xs text-[#8E8E93]">
            <a
              href="https://wa.me/6281318986320"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5A623] transition-colors"
            >
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                +62 813-1898-6320
              </span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
