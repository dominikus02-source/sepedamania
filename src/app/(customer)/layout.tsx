import { Header } from '@/components/customer/header';
import { BottomNav } from '@/components/customer/bottom-nav';
import { WhatsAppWidget } from '@/components/customer/whatsapp-widget';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto pb-20 min-h-screen">
        {children}
      </main>
      <BottomNav />
      <WhatsAppWidget />
    </>
  );
}
