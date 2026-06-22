import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Package,
  ChevronRight,
  MessageCircle,
  ClipboardList,
  Search,
  ShieldCheck,
  Truck,
  RefreshCw,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pengembalian Barang',
  description:
    'Sepedamania membantu proses pengembalian barang sesuai ketentuan toko agar belanja tetap aman dan nyaman.',
};

const requirements = [
  'Produk salah kirim',
  'Produk rusak saat diterima',
  'Produk tidak sesuai deskripsi',
  'Ukuran/varian tidak sesuai jika tersedia',
  'Pengajuan dilakukan maksimal 7 hari setelah barang diterima',
  'Produk belum digunakan secara berat',
  'Kemasan/label utama masih tersedia',
  'Bukti foto/video wajib dilampirkan',
];

const nonReturnable = [
  'Produk sudah digunakan berat',
  'Kerusakan karena pemakaian sendiri',
  'Produk yang sudah dimodifikasi',
  'Pengajuan melewati batas waktu 7 hari',
];

const processSteps = [
  {
    icon: ClipboardList,
    label: 'Ajukan return dari halaman pesanan',
  },
  {
    icon: Search,
    label: 'Admin meninjau bukti dan alasan',
  },
  {
    icon: ShieldCheck,
    label: 'Admin menyetujui atau menolak',
  },
  {
    icon: Package,
    label: 'Jika disetujui, user kirim barang kembali',
  },
  {
    icon: Truck,
    label: 'Admin menerima dan memeriksa barang',
  },
  {
    icon: RefreshCw,
    label: 'Refund/penggantian barang diproses',
  },
];

export default function PengembalianPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[#8E8E93] mb-6 hover:text-[#1C1C1E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1C1E] font-display tracking-tight mb-3">
        Pengembalian Barang
      </h1>

      {/* Intro */}
      <p className="text-[#8E8E93] text-base sm:text-lg leading-relaxed mb-8">
        Sepedamania membantu proses pengembalian barang sesuai ketentuan toko agar belanja tetap
        aman dan nyaman.
      </p>

      {/* Syarat Pengembalian */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#1C1C1E] mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#34C759]" />
          Syarat Pengembalian
        </h2>
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
          <ul className="space-y-3">
            {requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#1C1C1E]">
                <span className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-[#34C759]" />
                </span>
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Barang yang Tidak Dapat Dikembalikan */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#1C1C1E] mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-[#FF3B30]" />
          Barang yang Tidak Dapat Dikembalikan
        </h2>
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
          <ul className="space-y-3">
            {nonReturnable.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#1C1C1E]">
                <span className="flex-shrink-0 mt-0.5">
                  <XCircle className="w-4 h-4 text-[#FF3B30]" />
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Proses Return */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#1C1C1E] mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-[#F5A623]" />
          Proses Pengembalian
        </h2>
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm">
          <div className="space-y-0">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#F5A623] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{i + 1}</span>
                    </div>
                    {i < processSteps.length - 1 && (
                      <div className="w-[2px] h-7 bg-[#E5E5EA]" />
                    )}
                  </div>
                  <div className={`pb-5 ${i < processSteps.length - 1 ? '' : 'pb-0'}`}>
                    <div className="flex items-center gap-2 pt-0.5">
                      <Icon className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                      <p className="text-sm text-[#1C1C1E] font-medium">{step.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link href="/pesanan" className="flex-1">
          <button className="w-full h-12 rounded-xl bg-[#F5A623] text-[#1A1A1A] font-semibold text-sm hover:bg-[#F5A623]/90 transition-all duration-200 active:scale-[0.97] shadow-sm flex items-center justify-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Lihat Pesanan Saya
          </button>
        </Link>
        <a
          href="https://wa.me/6281318986320"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <button className="w-full h-12 rounded-xl border border-[#E5E5EA] bg-white text-[#1C1C1E] font-medium text-sm hover:bg-[#F2F2F7] transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            Hubungi WhatsApp
          </button>
        </a>
      </div>
    </div>
  );
}
