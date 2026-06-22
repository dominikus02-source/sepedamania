import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, Lightbulb, ArrowRight, ChevronRight, Bike, ShoppingCart, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Panduan Memilih Sepeda Pertama',
  description: 'Bingung memilih sepeda pertama? Simak panduan lengkap mulai dari menentukan budget, jenis sepeda, ukuran frame, hingga tips test ride.',
  openGraph: {
    title: 'Panduan Memilih Sepeda Pertama | SEPEDAMANIA',
    description: 'Bingung memilih sepeda pertama? Simak panduan lengkap mulai dari menentukan budget, jenis sepeda, ukuran frame, hingga tips test ride.',
    images: [{ url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=80', width: 1200, height: 630, alt: 'Panduan Memilih Sepeda Pertama' }],
  },
};

const sections = [
  { id: 'tentukan-budget', label: '1. Tentukan Budget' },
  { id: 'kenali-jenis-sepeda', label: '2. Kenali Jenis Sepeda' },
  { id: 'sesuaikan-kebutuhan', label: '3. Sesuaikan dengan Kebutuhan' },
  { id: 'ukuran-frame', label: '4. Ukuran Frame yang Tepat' },
  { id: 'cek-komponen', label: '5. Cek Komponen' },
  { id: 'test-ride', label: '6. Test Ride Sebelum Membeli' },
];

export default function MemilihSepedaPertamaPage() {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] leading-tight">
          Panduan Memilih Sepeda Pertama
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            12 Juni 2026
          </span>
          <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            8 menit membaca
          </span>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-52 sm:h-64 lg:h-80 rounded-2xl overflow-hidden mb-8">
        <Image
          src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=80"
          alt="Panduan Memilih Sepeda Pertama"
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
      <div className="prose-custom mb-8">
        <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
          Membeli sepeda pertama adalah momen yang menyenangkan sekaligus membingungkan. Dengan begitu banyak pilihan jenis, ukuran, dan merek, wajar jika Anda merasa kewalahan. Panduan ini akan membantu Anda memilih sepeda yang tepat sesuai kebutuhan, budget, dan postur tubuh.
        </p>
      </div>

      {/* Section 1: Budget */}
      <section id="tentukan-budget" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3">1. Tentukan Budget</h2>
        <div className="prose-custom">
          <p>
            Langkah pertama yang paling penting adalah menentukan anggaran. Harga sepeda sangat bervariasi, mulai dari 1 jutaan hingga puluhan juta. Dengan mengetahui budget, Anda bisa mempersempit pilihan dan fokus pada sepeda yang benar-benar terjangkau.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9]">
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A] rounded-l-lg">Kategori Harga</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Kisaran Harga</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A] rounded-r-lg">Cocok Untuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium">Entry Level</td>
                <td className="px-4 py-3 text-[#64748B]">Rp 1 – 3 Juta</td>
                <td className="px-4 py-3 text-[#64748B]">Pemula, bersepeda santai</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium">Mid Range</td>
                <td className="px-4 py-3 text-[#64748B]">Rp 3 – 8 Juta</td>
                <td className="px-4 py-3 text-[#64748B]">Hobi rutin, komuter</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium">Premium</td>
                <td className="px-4 py-3 text-[#64748B]">Rp 8 – 20 Juta</td>
                <td className="px-4 py-3 text-[#64748B]">Serius, touring, kompetisi</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200/60 rounded-xl p-4 sm:p-5">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Tips</h3>
              <p className="text-sm text-[#64748B] mt-1">
                Jangan lupa sisihkan sekitar 10-15% dari budget untuk perlengkapan tambahan seperti helm, lampu, kunci sepeda, dan pompa ban.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Kenali Jenis Sepeda */}
      <section id="kenali-jenis-sepeda" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3">2. Kenali Jenis Sepeda</h2>
        <div className="prose-custom">
          <p>Setiap jenis sepeda dirancang untuk kebutuhan yang berbeda. Berikut adalah jenis-jenis sepeda yang umum:</p>
        </div>

        <div className="mt-4 space-y-4">
          {/* MTB */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex-shrink-0">
                <Bike className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A]">MTB (Mountain Bike)</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  Cocok untuk medan off-road, trail, dan jalanan tidak rata. Ban lebar dengan grip kuat, suspensi depan atau full. 
                  Pilihan tepat jika Anda suka petualangan di alam terbuka.
                </p>
              </div>
            </div>
          </div>

          {/* Road Bike */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                <Bike className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A]">Road Bike</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  Sepeda balap dengan ban tipis, rangka ringan, dan posisi membungkuk. Cocok untuk kecepatan di jalan aspal. 
                  Ideal untuk olahraga dan touring jarak jauh.
                </p>
              </div>
            </div>
          </div>

          {/* BMX */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex-shrink-0">
                <Bike className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A]">BMX</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  Sepeda kecil dengan roda 20 inci, cocok untuk trik, gaya bebas, dan balap BMX. 
                  Jika Anda tertarik dengan aksi dan stunt, BMX adalah jawabannya.
                </p>
              </div>
            </div>
          </div>

          {/* Fixie */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex-shrink-0">
                <Bike className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A]">Fixie / Single Speed</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  Sepeda minimalis tanpa gigi, ringan, dan perawatan mudah. Populer di kalangan anak muda untuk gaya hidup urban. 
                  Cocok untuk jalan datar di perkotaan.
                </p>
              </div>
            </div>
          </div>

          {/* City Bike */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex-shrink-0">
                <Bike className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A]">City Bike / Hybrid</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  Kombinasi antara MTB dan Road Bike. Posisi duduk tegak, nyaman untuk perjalanan harian di perkotaan. 
                  Dilengkapi dengan rak dan fender untuk kepraktisan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200/60 rounded-xl p-4 sm:p-5">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Tips</h3>
              <p className="text-sm text-[#64748B] mt-1">
                Untuk pemula, City Bike atau MTB entry-level adalah pilihan paling serbaguna. Anda bisa mulai dengan sepeda ini sambil mempelajari gaya bersepeda yang Anda sukai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Sesuaikan Kebutuhan */}
      <section id="sesuaikan-kebutuhan" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3">3. Sesuaikan dengan Kebutuhan</h2>
        <div className="prose-custom">
          <p>Tanyakan pada diri Anda pertanyaan-pertanyaan berikut sebelum memutuskan:</p>
        </div>
        <ul className="mt-3 space-y-2 text-[#475569]">
          {[
            'Untuk apa sepeda ini digunakan? (rekreasi, olahraga, komuter, touring)',
            'Di mana Anda akan bersepeda? (jalan raya, perkotaan, pegunungan, trail)',
            'Seberapa sering Anda akan bersepeda? (akhir pekan, setiap hari)',
            'Apakah Anda membutuhkan sepeda yang mudah dibawa atau disimpan?',
            'Apakah ada fitur khusus yang Anda butuhkan? (rak, lampu, fender)',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 4: Ukuran Frame */}
      <section id="ukuran-frame" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3">4. Ukuran Frame yang Tepat</h2>
        <div className="prose-custom">
          <p>
            Ukuran frame sangat mempengaruhi kenyamanan bersepeda. Pastikan Anda memilih frame yang sesuai dengan tinggi badan. 
            Untuk panduan ukuran frame yang lebih detail, baca artikel{' '}
            <Link href="/panduan/panduan-ukuran-sepeda" className="text-[#2563EB] hover:text-[#1D4ED8] underline">
              Panduan Ukuran Sepeda
            </Link>
            .
          </p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9]">
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A] rounded-l-lg">Tinggi Badan</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Ukuran Frame (MTB)</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A] rounded-r-lg">Ukuran Frame (Road Bike)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr><td className="px-4 py-3 text-[#0F172A] font-medium">150-160 cm</td><td className="px-4 py-3 text-[#64748B]">S (14-15 inch)</td><td className="px-4 py-3 text-[#64748B]">47-51 cm</td></tr>
              <tr><td className="px-4 py-3 text-[#0F172A] font-medium">160-170 cm</td><td className="px-4 py-3 text-[#64748B]">M (16-17 inch)</td><td className="px-4 py-3 text-[#64748B]">52-54 cm</td></tr>
              <tr><td className="px-4 py-3 text-[#0F172A] font-medium">170-180 cm</td><td className="px-4 py-3 text-[#64748B]">L (18-19 inch)</td><td className="px-4 py-3 text-[#64748B]">55-57 cm</td></tr>
              <tr><td className="px-4 py-3 text-[#0F172A] font-medium">180-190 cm</td><td className="px-4 py-3 text-[#64748B]">XL (20-21 inch)</td><td className="px-4 py-3 text-[#64748B]">58-61 cm</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Cek Komponen */}
      <section id="cek-komponen" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3">5. Cek Komponen</h2>
        <div className="prose-custom">
          <p>Perhatikan komponen-komponen berikut saat memilih sepeda:</p>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Rangka (Frame)', desc: 'Material rangka: steel (berat, kuat), aluminium (ringan, populer), carbon (sangat ringan, mahal).' },
            { label: 'Sistem Rem', desc: 'Rem disc (cakram) lebih baik dari rem V-brake, terutama untuk kondisi basah atau menurun.' },
            { label: 'Suspensi', desc: 'Untuk MTB, suspensi depan (hardtail) cukup untuk pemula. Full suspension lebih mahal dan berat.' },
            { label: 'Drivetrain', desc: 'Jumlah gir dan kualitas derailleur mempengaruhi kelancaran perpindahan gigi. Shimano dan SRAM adalah merek umum.' },
            { label: 'Ban', desc: 'Ban lebar untuk traksi lebih baik, ban tipis untuk kecepatan. Periksa juga apakah tubeless-ready.' },
            { label: 'Sadel & Stang', desc: 'Kenyamanan adalah prioritas. Pilih sadel yang sesuai dengan postur dan stang dengan reach yang pas.' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <h3 className="text-sm font-semibold text-[#0F172A]">{item.label}</h3>
              <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Test Ride */}
      <section id="test-ride" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3">6. Test Ride Sebelum Membeli</h2>
        <div className="prose-custom">
          <p>
            Ini adalah langkah yang sering dilewatkan tapi sangat penting. Test ride akan memberi Anda gambaran nyata tentang 
            kenyamanan dan handling sepeda. Berikut hal-hal yang perlu diperhatikan saat test ride:
          </p>
        </div>
        <ul className="mt-3 space-y-2 text-[#475569]">
          {[
            'Rasakan posisi duduk — pastikan nyaman dan tidak terlalu membungkuk.',
            'Coba rem di berbagai kecepatan — pastikan responsif dan tidak berisik.',
            'Tes perpindahan gigi naik-turun — pastikan halus dan tidak loncat-loncat.',
            'Perhatikan berat sepeda — apakah terlalu berat untuk diangkat atau dibawa?',
            'Coba belok tajam — pastikan handling stabil dan tidak limbung.',
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
              <h3 className="text-sm font-semibold text-[#0F172A]">Tips</h3>
              <p className="text-sm text-[#64748B] mt-1">
                Bawa teman yang lebih berpengalaman saat test ride. Mereka bisa memberikan masukan objektif tentang sepeda yang Anda coba.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-2xl p-6 sm:p-8 text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Siap Memilih Sepeda Pertama?
        </h3>
        <p className="text-[#94A3B8] text-sm sm:text-base mb-5 max-w-md mx-auto">
          Temukan koleksi sepeda terlengkap di SEPEDAMANIA. Dari MTB, Road Bike, hingga City Bike — semua ada di sini.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/kategori"
            className="inline-flex items-center gap-2 bg-[#F5A623] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#E0951F] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Lihat Koleksi Kami
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/6281318986320?text=Halo%20SEPEDAMANIA%2C%20saya%20ingin%20konsultasi%20tentang%20sepeda"
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
