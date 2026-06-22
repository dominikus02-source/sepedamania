import type { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';
import { Truck, Package, Clock, MapPin, Search, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Informasi Pengiriman — SEPEDAMANIA',
  description: 'Informasi lengkap mengenai layanan pengiriman SEPEDAMANIA. Cek biaya, estimasi waktu, jasa ekspedisi, dan cara lacak pesanan Anda.',
};

const couriers = [
  { name: 'JNE', description: 'Jalur Nugraha Ekakurir — layanan REG, YES, OKE' },
  { name: 'J&T', description: 'J&T Express — pengiriman cepat ke seluruh Indonesia' },
  { name: 'SiCepat', description: 'SiCepat Express — layanan REG, BEST, Halu' },
  { name: 'Anteraja', description: 'Anteraja — layanan REG dan Ace' },
  { name: 'Pos Indonesia', description: 'Pos Indonesia — layanan POS Kilat Khusus' },
];

export default function PengirimanPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F5A623]/10 text-[#F5A623]">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E]">
              Informasi Pengiriman
            </h1>
            <p className="text-sm text-[#8E8E93] mt-1">
              Terakhir diperbarui: 1 Juni 2026
            </p>
          </div>
        </div>
        <p className="text-[#8E8E93] leading-relaxed max-w-3xl">
          SEPEDAMANIA berkomitmen untuk mengirimkan pesanan Anda dengan aman, cepat, dan
          terpercaya ke seluruh wilayah Indonesia.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Jasa Pengiriman */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F5A623]/10 text-[#F5A623]">
                <Package className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1E]">Jasa Pengiriman</h2>
            </div>
            <p className="text-[#8E8E93] leading-relaxed mb-4">
              Kami bekerja sama dengan berbagai jasa ekspedisi terpercaya untuk memastikan
              pesanan Anda sampai dengan aman dan tepat waktu:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {couriers.map((courier) => (
                <div
                  key={courier.name}
                  className="p-3.5 rounded-xl bg-[#F2F2F7] border border-[#E5E5EA]"
                >
                  <p className="font-semibold text-[#1C1C1E] text-sm">{courier.name}</p>
                  <p className="text-xs text-[#8E8E93] mt-0.5">{courier.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Biaya Pengiriman */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F5A623]/10 text-[#F5A623]">
                <span className="text-sm font-bold">Rp</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1E]">Biaya Pengiriman</h2>
            </div>
            <p className="text-[#8E8E93] leading-relaxed">
              Biaya pengiriman dihitung berdasarkan berat barang dan jarak lokasi tujuan.
              Anda dapat melihat estimasi biaya pengiriman secara otomatis pada halaman
              checkout sebelum menyelesaikan pemesanan. Setiap jasa ekspedisi memiliki tarif
              yang berbeda sesuai dengan kebijakan masing-masing.
            </p>
          </div>

          {/* Estimasi Waktu */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F5A623]/10 text-[#F5A623]">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1E]">Estimasi Waktu</h2>
            </div>
            <p className="text-[#8E8E93] leading-relaxed">
              Estimasi waktu pengiriman berkisar antara <strong className="text-[#1C1C1E]">1—7 hari kerja</strong>{' '}
              tergantung pada lokasi tujuan dan jasa ekspedisi yang dipilih:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-3 text-sm text-[#8E8E93]">
                <span className="w-2 h-2 rounded-full bg-[#34C759] mt-1.5 shrink-0" />
                <span><strong className="text-[#1C1C1E]">Jabodetabek:</strong> 1—2 hari kerja</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#8E8E93]">
                <span className="w-2 h-2 rounded-full bg-[#F5A623] mt-1.5 shrink-0" />
                <span><strong className="text-[#1C1C1E]">Pulau Jawa:</strong> 1—3 hari kerja</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#8E8E93]">
                <span className="w-2 h-2 rounded-full bg-[#F5A623] mt-1.5 shrink-0" />
                <span><strong className="text-[#1C1C1E]">Sumatera, Kalimantan, Sulawesi:</strong> 3—5 hari kerja</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#8E8E93]">
                <span className="w-2 h-2 rounded-full bg-[#FF3B30] mt-1.5 shrink-0" />
                <span><strong className="text-[#1C1C1E]">Papua, Maluku, Nusa Tenggara:</strong> 5—7 hari kerja</span>
              </li>
            </ul>
          </div>

          {/* Gratis Ongkir */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#34C759]/10 text-[#34C759]">
                <span className="text-sm font-bold">✓</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1E]">Gratis Ongkir</h2>
            </div>
            <p className="text-[#8E8E93] leading-relaxed">
              SEPEDAMANIA menawarkan promo gratis ongkir untuk pembelian dengan nominal
              tertentu. Syarat dan ketentuan promo gratis ongkir akan diinformasikan secara
              jelas pada halaman produk dan saat checkout. Promo ini berlaku untuk jasa
              ekspedisi tertentu dan area pengiriman yang telah ditentukan.
            </p>
          </div>

          {/* Pengiriman ke Seluruh Indonesia */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F5A623]/10 text-[#F5A623]">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1E]">Pengiriman ke Seluruh Indonesia</h2>
            </div>
            <p className="text-[#8E8E93] leading-relaxed">
              Kami melayani pengiriman ke seluruh wilayah Indonesia, dari Sabang sampai
              Merauke. Setiap pesanan akan dikemas dengan aman menggunakan kemasan khusus
              yang melindungi produk dari kerusakan selama perjalanan.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Cara Lacak */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F5A623]/10 text-[#F5A623]">
                <Search className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-lg font-bold text-[#1C1C1E]">Cara Lacak</h2>
            </div>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F5A623] text-white text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-sm text-[#8E8E93] leading-relaxed">
                  Cek nomor resi pada halaman detail pesanan di akun Anda
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F5A623] text-white text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-sm text-[#8E8E93] leading-relaxed">
                  Kunjungi website resmi jasa ekspedisi yang digunakan
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F5A623] text-white text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-sm text-[#8E8E93] leading-relaxed">
                  Masukkan nomor resi pada kolom pelacakan
                </p>
              </li>
            </ol>
          </div>

          {/* Pengiriman Tidak Berhasil */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#FF3B30]/10 text-[#FF3B30]">
                <span className="text-lg font-bold">!</span>
              </div>
              <h2 className="text-lg font-bold text-[#1C1C1E]">Pengiriman Tidak Berhasil</h2>
            </div>
            <p className="text-sm text-[#8E8E93] leading-relaxed">
              Apabila pengiriman tidak berhasil dilakukan (alamat tidak ditemukan, penerima
              tidak ada di tempat, atau alasan lainnya), tim <strong className="text-[#1C1C1E]">Customer Service</strong>{' '}
              kami akan menghubungi Anda melalui nomor telepon yang terdaftar untuk mencari
              solusi terbaik.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E5E5EA]">
              <p className="text-xs text-[#8E8E93] mb-2">Butuh bantuan?</p>
              <a
                href="https://wa.me/6281318986320"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F5A623] text-white rounded-xl hover:bg-[#F5A623]/90 transition-colors font-medium text-sm w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi CS via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
