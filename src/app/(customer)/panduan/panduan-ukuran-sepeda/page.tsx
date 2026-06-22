import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, Lightbulb, ArrowRight, ChevronRight, ShoppingCart, MessageCircle, Ruler, User, Bike, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Panduan Ukuran Sepeda',
  description: 'Temukan ukuran frame sepeda yang paling pas untuk tubuh Anda. Panduan lengkap dengan tabel ukuran untuk berbagai jenis sepeda.',
  openGraph: {
    title: 'Panduan Ukuran Sepeda | SEPEDAMANIA',
    description: 'Temukan ukuran frame sepeda yang paling pas untuk tubuh Anda. Panduan lengkap dengan tabel ukuran untuk berbagai jenis sepeda.',
    images: [{ url: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1200&q=80', width: 1200, height: 630, alt: 'Panduan Ukuran Sepeda' }],
  },
};

const sections = [
  { id: 'mengukur-tubuh', label: '1. Cara Mengukur Tinggi Badan & Inseam' },
  { id: 'ukuran-frame-tabel', label: '2. Ukuran Frame Berdasarkan Tinggi Badan' },
  { id: 'perbedaan-jenis', label: '3. Perbedaan Ukuran MTB vs Road Bike vs City Bike' },
  { id: 'tips-memilih', label: '4. Tips Memilih Ukuran yang Pas' },
  { id: 'test-geometri', label: '5. Test Geometri Sepeda' },
  { id: 'konsekuensi-salah-ukuran', label: '6. Konsekuensi Ukuran Salah' },
];

export default function PanduanUkuranSepedaPage() {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] leading-tight">
          Panduan Ukuran Sepeda
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            20 Juni 2026
          </span>
          <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            5 menit membaca
          </span>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-52 sm:h-64 lg:h-80 rounded-2xl overflow-hidden mb-8">
        <Image
          src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1200&q=80"
          alt="Panduan Ukuran Sepeda"
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
          Memilih ukuran sepeda yang tepat adalah salah satu faktor paling penting untuk kenyamanan dan performa bersepeda. 
          Ukuran frame yang salah bisa menyebabkan nyeri punggung, leher, lutut, dan mengurangi pengalaman bersepeda Anda. 
          Panduan ini akan membantu Anda menemukan ukuran yang paling pas.
        </p>
      </div>

      {/* Section 1: Mengukur Tubuh */}
      <section id="mengukur-tubuh" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-[#F5A623]" />
          1. Cara Mengukur Tinggi Badan &amp; Inseam
        </h2>
        <div className="prose-custom">
          <p>
            Ada dua ukuran tubuh yang penting untuk menentukan ukuran frame sepeda: <strong>tinggi badan</strong> dan <strong>inseam</strong> 
            (panjang kaki bagian dalam dari selangkangan ke telapak kaki).
          </p>
        </div>

        <div className="mt-4 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                <Ruler className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A]">Mengukur Tinggi Badan</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  Berdiri tegak tanpa sepatu dengan punggung menempel di dinding. Gunakan penggaris atau buku untuk menandai posisi puncak kepala, 
                  lalu ukur jarak dari lantai ke tanda tersebut.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 text-green-600 flex-shrink-0">
                <Ruler className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A]">Mengukur Inseam</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  Berdiri tegak dengan kaki sedikit renggang (sekitar 15 cm). Letakkan buku di antara kedua kaki, rapatkan ke selangkangan 
                  (seperti posisi sadel). Ukur jarak dari punggung buku ke lantai. Inseam adalah ukuran yang lebih akurat untuk menentukan 
                  tinggi sadel dan ukuran frame.
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
                Ukur inseam 2-3 kali untuk memastikan akurasi. Catat angka rata-ratanya. Inseam adalah ukuran yang lebih penting daripada tinggi badan untuk menentukan ukuran frame.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Ukuran Frame Tabel */}
      <section id="ukuran-frame-tabel" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-[#F5A623]" />
          2. Ukuran Frame Berdasarkan Tinggi Badan
        </h2>
        <div className="prose-custom">
          <p>
            Tabel berikut adalah panduan umum ukuran frame berdasarkan tinggi badan. Namun perlu diingat bahwa ini hanya panduan awal — 
            ukuran ideal bisa berbeda tergantung proporsi tubuh dan preferensi berkendara.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9]">
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A] rounded-l-lg">Tinggi Badan</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Ukuran</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">MTB (inch)</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Road Bike (cm)</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A] rounded-r-lg">City Bike</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium whitespace-nowrap">140 - 155 cm</td>
                <td className="px-4 py-3 text-[#64748B]">XXS / XS</td>
                <td className="px-4 py-3 text-[#64748B]">13 - 14"</td>
                <td className="px-4 py-3 text-[#64748B]">44 - 47 cm</td>
                <td className="px-4 py-3 text-[#64748B]">S</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium whitespace-nowrap">155 - 165 cm</td>
                <td className="px-4 py-3 text-[#64748B]">S</td>
                <td className="px-4 py-3 text-[#64748B]">15 - 16"</td>
                <td className="px-4 py-3 text-[#64748B]">48 - 51 cm</td>
                <td className="px-4 py-3 text-[#64748B]">S / M</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium whitespace-nowrap">165 - 175 cm</td>
                <td className="px-4 py-3 text-[#64748B]">M</td>
                <td className="px-4 py-3 text-[#64748B]">17 - 18"</td>
                <td className="px-4 py-3 text-[#64748B]">52 - 55 cm</td>
                <td className="px-4 py-3 text-[#64748B]">M</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium whitespace-nowrap">175 - 185 cm</td>
                <td className="px-4 py-3 text-[#64748B]">L</td>
                <td className="px-4 py-3 text-[#64748B]">19 - 20"</td>
                <td className="px-4 py-3 text-[#64748B]">56 - 59 cm</td>
                <td className="px-4 py-3 text-[#64748B]">L</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium whitespace-nowrap">185 - 200 cm</td>
                <td className="px-4 py-3 text-[#64748B]">XL</td>
                <td className="px-4 py-3 text-[#64748B]">21 - 22"</td>
                <td className="px-4 py-3 text-[#64748B]">60 - 63 cm</td>
                <td className="px-4 py-3 text-[#64748B]">XL</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-[#64748B]">
          * Tabel ini bersifat indikatif. Ukuran ideal dapat bervariasi tergantung merek dan model sepeda.
        </p>
      </section>

      {/* Section 3: Perbedaan Jenis */}
      <section id="perbedaan-jenis" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Bike className="w-5 h-5 text-[#F5A623]" />
          3. Perbedaan Ukuran MTB vs Road Bike vs City Bike
        </h2>
        <div className="prose-custom">
          <p>
            Setiap jenis sepeda memiliki geometri dan cara pengukuran frame yang berbeda. Penting untuk memahami perbedaan ini agar tidak salah pilih.
          </p>
        </div>

        <div className="mt-4 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex-shrink-0">
                <Bike className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A]">MTB (Mountain Bike)</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  Diukur dalam <strong>inch</strong> dari center bottom bracket ke ujung seat tube. Ukuran berkisar 13" - 22". 
                  Geometri MTB lebih tegak dengan jarak wheelbase yang lebih panjang untuk stabilitas di medan berat. 
                  Umumnya, Anda bisa memilih ukuran yang lebih kecil untuk handling yang lebih lincah.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                <Bike className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A]">Road Bike</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  Diukur dalam <strong>sentimeter</strong> dari center bottom bracket ke ujung seat tube. Ukuran berkisar 44 - 63 cm. 
                  Road bike memiliki geometri yang lebih agresif dengan posisi membungkuk untuk aerodinamika. 
                  Ukuran frame road bike sangat kritis karena posisi berkendara yang lebih terentang.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex-shrink-0">
                <Bike className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A]">City Bike / Hybrid</h3>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  Biasanya menggunakan ukuran huruf (S, M, L, XL) yang setara dengan rentang tinggi badan tertentu. 
                  Geometri city bike lebih tegak dan santai, sehingga toleransi ukuran lebih longgar. 
                  Namun tetap penting memilih ukuran yang sesuai untuk kenyamanan maksimal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Tips Memilih */}
      <section id="tips-memilih" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#F5A623]" />
          4. Tips Memilih Ukuran yang Pas
        </h2>
        <div className="mt-4 space-y-3">
          {[
            { label: 'Utamakan Inseam', desc: 'Gunakan ukuran inseam sebagai patokan utama, bukan hanya tinggi badan. Inseam lebih akurat menentukan tinggi frame yang pas.' },
            { label: 'Cek Reach', desc: 'Reach adalah jarak dari sadel ke stang. Pastikan Anda tidak terlalu membungkuk atau terlalu tegak. Tangan harus bisa mencapai stang dengan nyaman.' },
            { label: 'Perhatikan Standover Height', desc: 'Berdiri di atas sepeda (top tube). Pastikan ada jarak 2-5 cm antara tubuh bagian bawah dengan top tube untuk keamanan.' },
            { label: 'Sesuaikan Gaya Berkendara', desc: 'Untuk touring yang santai, pilih ukuran yang lebih kecil. Untuk kecepatan, pilih ukuran yang pas atau sedikit lebih besar.' },
            { label: 'Jangan Takut Mencoba', desc: 'Jika ragu antara dua ukuran, cobalah keduanya. Ukuran yang lebih kecil biasanya lebih mudah dimanuver, ukuran lebih besar lebih stabil.' },
            { label: 'Konsultasi dengan Ahli', desc: 'Jika masih bingung, konsultasikan dengan mekanik sepeda atau staf toko sepeda terdekat.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-xl p-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F5A623]/10 text-[#F5A623] text-sm font-bold flex-shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-sm text-[#0F172A]">{item.label}</h3>
                <p className="text-sm text-[#64748B] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Test Geometri */}
      <section id="test-geometri" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Bike className="w-5 h-5 text-[#F5A623]" />
          5. Test Geometri Sepeda
        </h2>
        <div className="prose-custom">
          <p>
            Cara terbaik untuk memastikan ukuran sepeda pas adalah dengan mencoba langsung. Berikut panduan test geometri yang bisa Anda lakukan:
          </p>
        </div>
        <ol className="mt-4 space-y-3 list-none pl-0">
          {[
            { title: 'Posisi Sadel', desc: 'Duduk di sadel dan tempatkan pedal di posisi sejajar horizontal. Kaki yang di depan harus sedikit ditekuk (10-15 derajat). Jika harus menjinjit, sadel terlalu tinggi.' },
            { title: 'Jangkauan Stang', desc: 'Pegang stang dengan posisi tangan sedikit ditekuk. Jika Anda harus meluruskan tangan sepenuhnya, reach terlalu panjang. Jika terlalu ditekuk, reach terlalu pendek.' },
            { title: 'Posisi Membungkuk', desc: 'Sudut punggung saat berkendara tergantung jenis sepeda. Road bike lebih membungkuk, city bike lebih tegak. Pastikan posisi ini nyaman untuk perjalanan panjang.' },
            { title: 'Tes Putaran Pedal', desc: 'Putar pedal ke belakang tanpa hambatan. Pastikan lutut tidak menyentuh stang atau bagian tubuh lain saat pedal berada di posisi paling depan.' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#64748B] text-sm font-bold flex-shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-sm text-[#0F172A]">{item.title}</h3>
                <p className="text-sm text-[#64748B] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Section 6: Konsekuensi */}
      <section id="konsekuensi-salah-ukuran" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#F5A623]" />
          6. Konsekuensi Ukuran Salah
        </h2>
        <div className="prose-custom">
          <p>
            Memilih ukuran sepeda yang salah tidak hanya mengurangi kenyamanan, tetapi juga bisa menyebabkan masalah kesehatan dan keselamatan.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-red-50 border border-red-200/60 rounded-xl p-4 sm:p-5">
            <h3 className="font-semibold text-[#0F172A] mb-2">Jika Ukuran Terlalu Besar</h3>
            <ul className="space-y-1.5 text-sm text-[#64748B]">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                Sulit mengontrol sepeda, terutama di tikungan
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                Nyeri punggung dan bahu karena terlalu membungkuk
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                Risiko cedera saat turun/berhenti karena tidak bisa menyentuh tanah
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                Leher tegang karena harus mendongak terus
              </li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200/60 rounded-xl p-4 sm:p-5">
            <h3 className="font-semibold text-[#0F172A] mb-2">Jika Ukuran Terlalu Kecil</h3>
            <ul className="space-y-1.5 text-sm text-[#64748B]">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                Posisi berkendara terlalu tegak, kurang efisien
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                Lutut bisa terbentur stang saat berbelok tajam
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                Kaki terlalu ditekuk, menyebabkan nyeri lutut
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                Distribusi berat badan tidak ideal, handling kurang stabil
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200/60 rounded-xl p-4 sm:p-5">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Ingat</h3>
              <p className="text-sm text-[#64748B] mt-1">
                Jika Anda berada di antara dua ukuran, pilih ukuran yang lebih kecil. Sepeda yang sedikit terlalu kecil lebih mudah diatur 
                (dengan menaikkan sadel atau mengganti stang) dibandingkan sepeda yang terlalu besar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-2xl p-6 sm:p-8 text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Temukan Sepeda dengan Ukuran yang Tepat
        </h3>
        <p className="text-[#94A3B8] text-sm sm:text-base mb-5 max-w-md mx-auto">
          SEPEDAMANIA menyediakan berbagai ukuran sepeda dari berbagai merek ternama. Dapatkan sepeda dengan ukuran yang paling pas untuk Anda.
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
            href="https://wa.me/6281318986320?text=Halo%20SEPEDAMANIA%2C%20saya%20ingin%20konsultasi%20tentang%20ukuran%20sepeda"
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
