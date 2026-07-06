import { ShieldCheck, Truck, RotateCcw, MessageCircle, Wallet, Search } from 'lucide-react';
import { Container, Section } from '@/components/ui/container';

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Pembayaran Aman',
    description: 'Transaksi diproses via Midtrans — terpercaya dan terenkripsi.',
    bg: '#E0F2FE',
    iconColor: '#0284C7',
  },
  {
    icon: Truck,
    title: 'Pengiriman Jelas',
    description: 'Kurir terpercaya dengan nomor resi yang bisa dilacak.',
    bg: '#FEF3C7',
    iconColor: '#F97316',
  },
  {
    icon: RotateCcw,
    title: 'Pengembalian Mudah',
    description: 'Sesuai ketentuan — proses jelas dan transparan.',
    bg: '#DCFCE7',
    iconColor: '#16A34A',
  },
  {
    icon: MessageCircle,
    title: 'Konsultasi Gratis',
    description: 'Tanya-tanya dulu sebelum beli — kami bantu pilih sepeda yang pas.',
    bg: '#FEE2E2',
    iconColor: '#EF4444',
  },
  {
    icon: Search,
    title: 'Produk Pilihan',
    description: 'Sepeda & aksesoris original dari brand ternama.',
    bg: '#F3E8FF',
    iconColor: '#9333EA',
  },
  {
    icon: Wallet,
    title: 'Bisa COD*',
    description: 'Bayar di tempat untuk wilayah tertentu.',
    bg: '#FEF9C3',
    iconColor: '#CA8A04',
  },
];

export function TrustSection() {
  return (
    <Section className="py-8 sm:py-12">
      <Container>
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Kenapa Belanja di SEPEDAMANIA?
          </h2>
          <p className="text-sm text-[#64748B] mt-1.5 max-w-lg mx-auto">
            Kami ingin membantu kamu menemukan sepeda yang tepat — dengan cara belanja yang nyaman dan aman.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white border border-[#E2E8F0] hover:shadow-sm hover:border-[#FBBF24]/30 transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: point.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: point.iconColor }} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#0F172A]">{point.title}</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
