import { Header } from '@/components/customer/header';
import { CartDrawer } from '@/components/customer/cart-drawer';
import { BottomNav } from '@/components/customer/bottom-nav';
import { WhatsAppWidget } from '@/components/customer/whatsapp-widget';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <CartDrawer />
      <main className="max-w-7xl mx-auto pb-24 lg:pb-12 min-h-screen">
        {children}
      </main>
      <BottomNav />
      <WhatsAppWidget />
    </>
  );
}
