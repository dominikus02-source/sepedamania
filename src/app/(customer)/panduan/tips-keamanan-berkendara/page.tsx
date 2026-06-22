import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, Lightbulb, ArrowRight, ChevronRight, ShoppingCart, MessageCircle, Shield, HardHat, TrafficCone, Lamp, Eye, AlertTriangle, Backpack } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tips Keamanan Berkendara',
  description: 'Keselamatan adalah prioritas utama. Simak tips penting untuk berkendara sepeda yang aman di jalan raya dan area publik.',
  openGraph: {
    title: 'Tips Keamanan Berkendara | SEPEDAMANIA',
    description: 'Keselamatan adalah prioritas utama. Simak tips penting untuk berkendara sepeda yang aman di jalan raya dan area publik.',
    images: [{ url: 'https://images.unsplash.com/photo-1557683311-e1ea197b1e9d?w=1200&q=80', width: 1200, height: 630, alt: 'Tips Keamanan Berkendara' }],
  },
};

const sections = [
  { id: 'helm-pelindung', label: '1. Gunakan Helm dan Pelindung' },
  { id: 'rambu-lalu-lintas', label: '2. Patuhi Rambu Lalu Lintas' },
  { id: 'lampu-reflektor', label: '3. Gunakan Lampu dan Reflektor' },
  { id: 'kondisi-jalan', label: '4. Perhatikan Kondisi Jalan' },
  { id: 'jarak-aman', label: '5. Jaga Jarak Aman' },
  { id: 'perlengkapan-darurat', label: '6. Bawa Perlengkapan Darurat' },
];

export default function TipsKeamananBerkendaraPage() {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] leading-tight">
          Tips Keamanan Berkendara
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            18 Juni 2026
          </span>
          <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            6 menit membaca
          </span>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-52 sm:h-64 lg:h-80 rounded-2xl overflow-hidden mb-8">
        <Image
          src="https://images.unsplash.com/photo-1557683311-e1ea197b1e9d?w=1200&q=80"
          alt="Tips Keamanan Berkendara"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Table of Contents */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 mb-8">
        <h2 className="text-sm font-semibold text-[#0F172A] mb-3">Daftar Isi</h2>
        <nav aria-label="Table of contents">
          <ul className="space-y-1.5">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#F5A623] transition-colors py-1"
                >
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Introduction */}
      <div className="mb-8">
        <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
          Bersepeda adalah aktivitas yang menyenangkan dan menyehatkan, namun tetap perlu memperhatikan aspek keselamatan. 
          Baik Anda bersepeda di jalan raya, jalur sepeda, atau area publik, prioritas utama tetaplah keamanan. 
          Berikut tips penting yang harus Anda terapkan setiap kali bersepeda.
        </p>
      </div>

      {/* Section 1: Helm dan Pelindung */}
      <section id="helm-pelindung" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <HardHat className="w-5 h-5 text-[#F5A623]" />
          1. Gunakan Helm dan Pelindung
        </h2>
        <div className="prose-custom">
          <p>
            Helm adalah perlengkapan paling penting saat bersepeda. Pilihlah helm yang sesuai standar keamanan (SNI, CPSC, atau EN 1078) 
            dan pastikan ukurannya pas di kepala.
          </p>
        </div>
        <ul className="mt-3 space-y-2 text-[#475569]">
          {[
            'Pastikan helm duduk rata di kepala, tidak miring ke depan atau belakang.',
            'Kencangkan strap helm hingga pas — tidak terlalu longgar atau terlalu ketat.',
            'Ganti helm setiap 3-5 tahun atau setelah mengalami benturan keras.',
            'Selain helm, gunakan juga sarung tangan, pelindung siku dan lutut untuk keamanan ekstra.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 bg-amber-50 border border-amber-200/60 rounded-xl p-4 sm:p-5">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Rekomendasi Produk</h3>
              <p className="text-sm text-[#64748B] mt-1">
                Lindungi kepala Anda dengan{' '}
                <Link href="/produk/helm-sepedamania-pro" className="text-[#2563EB] hover:text-[#1D4ED8] underline">
                  Helm SEPEDAMANIA Pro
                </Link>
                {' '}— helm dengan standar keamanan internasional, desain aerodinamis, dan sistem ventilasi optimal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Rambu Lalu Lintas */}
      <section id="rambu-lalu-lintas" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <TrafficCone className="w-5 h-5 text-[#F5A623]" />
          2. Patuhi Rambu Lalu Lintas
        </h2>
        <div className="prose-custom">
          <p>
            Sebagai pengguna jalan, pesepeda memiliki hak dan kewajiban yang sama dengan pengendara lain. Mematuhi rambu lalu lintas adalah mutlak.
          </p>
        </div>
        <ul className="mt-3 space-y-2 text-[#475569]">
          {[
            'Berhenti saat lampu merah dan ikuti marka jalan yang ada.',
            'Gunakan tangan untuk memberi isyarat saat akan berbelok atau berhenti.',
            'Jangan bersepeda melawan arah arus lalu lintas.',
            'Gunakan jalur sepeda jika tersedia. Jika tidak, ambil posisi di lajur paling kiri.',
            'Hindari bersepeda di trotoar yang diperuntukkan bagi pejalan kaki.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 3: Lampu dan Reflektor */}
      <section id="lampu-reflektor" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Lamp className="w-5 h-5 text-[#F5A623]" />
          3. Gunakan Lampu dan Reflektor
        </h2>
        <div className="prose-custom">
          <p>
            Visibilitas adalah kunci keselamatan, terutama saat berkendara di malam hari atau kondisi cuaca buruk. Pastikan sepeda Anda dilengkapi dengan:
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0">
              <Lamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Lampu Depan (Putih)</h3>
              <p className="text-sm text-[#64748B] mt-0.5">Agar Anda terlihat oleh pengendara dari arah depan. Minimal 200 lumen untuk penggunaan malam hari.</p>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <Lamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Lampu Belakang (Merah)</h3>
              <p className="text-sm text-[#64748B] mt-0.5">Lampu belakang yang terang akan membuat Anda terlihat dari arah belakang, terutama saat rem.</p>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Reflektor</h3>
              <p className="text-sm text-[#64748B] mt-0.5">Reflektor di pedal, roda, dan bagian belakang membantu visibilitas pasif saat ada cahaya dari kendaraan lain.</p>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Backpack className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Rompi Reflektif</h3>
              <p className="text-sm text-[#64748B] mt-0.5">Gunakan rompi atau jaket dengan bahan reflektif untuk visibilitas maksimal dari segala arah.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200/60 rounded-xl p-4 sm:p-5">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Tips</h3>
              <p className="text-sm text-[#64748B] mt-1">
                Bawalah lampu cadangan atau power bank untuk mengisi ulang baterai lampu jika Anda berencana bersepeda hingga malam hari.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Kondisi Jalan */}
      <section id="kondisi-jalan" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#F5A623]" />
          4. Perhatikan Kondisi Jalan
        </h2>
        <div className="prose-custom">
          <p>
            Selalu waspada terhadap kondisi jalan di sekitar Anda. Hal-hal yang perlu diperhatikan:
          </p>
        </div>
        <ul className="mt-3 space-y-2 text-[#475569]">
          {[
            'Lubang, retakan, dan permukaan jalan tidak rata — kurangi kecepatan dan hindari secara hati-hati.',
            'Tutup got, drainase, dan rel kereta — biasanya licin dan dapat menyebabkan ban selip.',
            'Kerikil, pasir, dan daun basah — sangat licin, hindari rem mendadak di atas permukaan ini.',
            'Genangan air — bisa menutupi lubang atau bahaya lain di jalan.',
            'Kendaraan parkir — waspada terhadap pintu yang tiba-tiba terbuka (dooring).',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 5: Jarak Aman */}
      <section id="jarak-aman" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#F5A623]" />
          5. Jaga Jarak Aman
        </h2>
        <div className="prose-custom">
          <p>
            Menjaga jarak aman adalah prinsip dasar keselamatan berkendara yang berlaku juga untuk pesepeda.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F5A623]">1,5 m</div>
            <p className="text-xs text-[#64748B] mt-1">Jarak minimal dengan kendaraan yang diparkir (hindari dooring)</p>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F5A623]">2 dtk</div>
            <p className="text-xs text-[#64748B] mt-1">Jarak waktu dengan kendaraan di depan Anda</p>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F5A623]">3 m</div>
            <p className="text-xs text-[#64748B] mt-1">Jarak aman saat mendahului kendaraan lain</p>
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-[#475569]">
          {[
            'Selalu antisipasi jika kendaraan di depan Anda tiba-tiba berhenti atau berbelok.',
            'Jangan bersepeda terlalu rapat dengan pesepeda lain, beri ruang untuk manuver darurat.',
            'Saat menuruni bukit, jaga kecepatan dan tambah jarak dengan kendaraan di depan.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 6: Perlengkapan Darurat */}
      <section id="perlengkapan-darurat" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Backpack className="w-5 h-5 text-[#F5A623]" />
          6. Bawa Perlengkapan Darurat
        </h2>
        <div className="prose-custom">
          <p>
            Selalu siapkan perlengkapan darurat saat bersepeda, terutama jika Anda bepergian jauh atau ke area yang jauh dari bengkel sepeda.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: '🛠️', label: 'Tool set multi-fungsi' },
            { icon: '🔧', label: 'Ban dalam cadangan' },
            { icon: '💨', label: 'Pompa mini / CO2' },
            { icon: '🩹', label: 'Patch kit (tambal ban)' },
            { icon: '💊', label: 'P3K (kotak P3K mini)' },
            { icon: '📱', label: 'HP terisi penuh' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-xs font-medium text-[#0F172A]">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-200/60 rounded-xl p-4 sm:p-5">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Tips</h3>
              <p className="text-sm text-[#64748B] mt-1">
                Simpan nomor darurat di ponsel Anda: kontak keluarga, ambulans (118/119), dan bengkel sepeda terdekat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-2xl p-6 sm:p-8 text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Lengkapi Perlengkapan Keamanan Anda
        </h3>
        <p className="text-[#94A3B8] text-sm sm:text-base mb-5 max-w-md mx-auto">
          SEPEDAMANIA menyediakan helm, lampu, reflektor, dan berbagai perlengkapan keamanan berkendara lainnya dengan kualitas terbaik.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/kategori"
            className="inline-flex items-center gap-2 bg-[#F5A623] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#E0951F] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Lihat Koleksi Keamanan
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/6281318986320?text=Halo%20SEPEDAMANIA%2C%20saya%20ingin%20konsultasi%20tentang%20perlengkapan%20keamanan%20sepeda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/10"
          >
            <MessageCircle className="w-5 h-5" />
            Konsultasi via WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
