import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, Lightbulb, ArrowRight, ChevronRight, ShoppingCart, MessageCircle, Wrench, Droplets, Wind, Cog, ShieldCheck, Warehouse } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cara Merawat Sepeda Agar Awet',
  description: 'Pelajari cara merawat sepeda yang benar agar tetap awet dan selalu siap pakai. Dari membersihkan, melumasi, hingga penyimpanan yang benar.',
  openGraph: {
    title: 'Cara Merawat Sepeda Agar Awet | SEPEDAMANIA',
    description: 'Pelajari cara merawat sepeda yang benar agar tetap awet dan selalu siap pakai.',
    images: [{ url: 'https://images.unsplash.com/photo-1557803178-4cf46c63cef6?w=1200&q=80', width: 1200, height: 630, alt: 'Cara Merawat Sepeda Agar Awet' }],
  },
};

const sections = [
  { id: 'membersihkan-sepeda', label: '1. Membersihkan Sepeda Setelah Dipakai' },
  { id: 'melumasi-rantai', label: '2. Melumasi Rantai Secara Rutin' },
  { id: 'tekanan-ban', label: '3. Mengecek Tekanan Ban' },
  { id: 'rem-drivetrain', label: '4. Perawatan Rem dan Drivetrain' },
  { id: 'servis-berkala', label: '5. Servis Berkala' },
  { id: 'penyimpanan', label: '6. Penyimpanan yang Benar' },
];

export default function CaraMerawatSepedaPage() {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] leading-tight">
          Cara Merawat Sepeda Agar Awet
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            15 Juni 2026
          </span>
          <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            7 menit membaca
          </span>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-52 sm:h-64 lg:h-80 rounded-2xl overflow-hidden mb-8">
        <Image
          src="https://images.unsplash.com/photo-1557803178-4cf46c63cef6?w=1200&q=80"
          alt="Cara Merawat Sepeda Agar Awet"
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
          Sepeda adalah investasi. Dengan perawatan yang tepat, sepeda Anda bisa bertahan bertahun-tahun dan tetap memberikan performa terbaik. 
          Panduan ini akan membahas langkah-langkah perawatan rutin yang bisa Anda lakukan sendiri di rumah.
        </p>
      </div>

      {/* Section 1: Membersihkan */}
      <section id="membersihkan-sepeda" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-[#F5A623]" />
          1. Membersihkan Sepeda Setelah Dipakai
        </h2>
        <div className="prose-custom">
          <p>
            Membersihkan sepeda secara rutin adalah langkah perawatan paling dasar namun paling penting. 
            Kotoran, debu, dan lumpur yang menempel dapat mempercepat keausan komponen.
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {[
            { label: 'Bilas dengan air', desc: 'Gunakan air biasa untuk membilas kotoran kasar. Hindari semprotan bertekanan tinggi langsung ke bearing atau hub roda.' },
            { label: 'Gunakan sabun khusus', desc: 'Gunakan sabun khusus sepeda atau deterjen ringan. Hindari sabun cuci piring yang dapat menghilangkan pelumas.' },
            { label: 'Sikat bagian sulit', desc: 'Gunakan sikat gigi bekas atau kuas kecil untuk membersihkan drivetrain, sela-sela gir, dan celah-celah sempit.' },
            { label: 'Keringkan', desc: 'Lap sepeda dengan kain mikrofiber hingga kering. Jangan biarkan sepeda basah mengering sendiri karena bisa menyebabkan karat.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-xl p-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#64748B] text-sm font-bold flex-shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-sm text-[#0F172A]">{item.label}</h3>
                <p className="text-sm text-[#64748B] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-200/60 rounded-xl p-4 sm:p-5">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Tips</h3>
              <p className="text-sm text-[#64748B] mt-1">
                Untuk perawatan optimal, bersihkan sepeda setiap kali selesai digunakan di medan berlumpur atau setelah berkendara di tengah hujan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Melumasi Rantai */}
      <section id="melumasi-rantai" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Wind className="w-5 h-5 text-[#F5A623]" />
          2. Melumasi Rantai Secara Rutin
        </h2>
        <div className="prose-custom">
          <p>
            Rantai adalah komponen yang paling sering bergerak dan paling rentan aus. Pelumasan rutin akan memperpanjang umur rantai dan drivetrain secara keseluruhan.
          </p>
        </div>
        <ol className="mt-4 space-y-3 list-none pl-0">
          {[
            { title: 'Bersihkan rantai', desc: 'Bersihkan rantai dari kotoran dan sisa pelumas lama menggunakan degreaser dan kain bersih.' },
            { title: 'Oleskan pelumas', desc: 'Teteskan pelumas (lube) pada setiap mata rantai sambil memutar pedal ke belakang secara perlahan.' },
            { title: 'Diamkan sebentar', desc: 'Biarkan pelumas meresap selama beberapa menit agar bisa menembus sela-sela rantai.' },
            { title: 'Lap kelebihan', desc: 'Lap kelebihan pelumas dengan kain bersih. Pelumas berlebih hanya akan menarik kotoran.' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F5A623]/10 text-[#F5A623] text-sm font-bold flex-shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-sm text-[#0F172A]">{item.title}</h3>
                <p className="text-sm text-[#64748B] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 bg-amber-50 border border-amber-200/60 rounded-xl p-4 sm:p-5">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Frekuensi Pelumasan</h3>
              <p className="text-sm text-[#64748B] mt-1">
                Untuk penggunaan normal, lumasi rantai setiap 2 minggu sekali atau setiap 200 km. Jika sering hujan atau berdebu, lakukan seminggu sekali.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Tekanan Ban */}
      <section id="tekanan-ban" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Wind className="w-5 h-5 text-[#F5A623]" />
          3. Mengecek Tekanan Ban
        </h2>
        <div className="prose-custom">
          <p>
            Tekanan ban yang tepat sangat mempengaruhi kenyamanan, kecepatan, dan keselamatan berkendara. Ban yang kekurangan angin lebih cepat aus dan meningkatkan risiko <em>pinch flat</em>.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9]">
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A] rounded-l-lg">Jenis Sepeda</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Tekanan Ideal (PSI)</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A] rounded-r-lg">Frekuensi Cek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr><td className="px-4 py-3 text-[#0F172A] font-medium">MTB</td><td className="px-4 py-3 text-[#64748B]">30 - 50 PSI</td><td className="px-4 py-3 text-[#64748B]">Setiap akan bersepeda</td></tr>
              <tr><td className="px-4 py-3 text-[#0F172A] font-medium">Road Bike</td><td className="px-4 py-3 text-[#64748B]">80 - 120 PSI</td><td className="px-4 py-3 text-[#64748B]">Setiap akan bersepeda</td></tr>
              <tr><td className="px-4 py-3 text-[#0F172A] font-medium">City Bike / Hybrid</td><td className="px-4 py-3 text-[#64748B]">50 - 70 PSI</td><td className="px-4 py-3 text-[#64748B]">Seminggu sekali</td></tr>
              <tr><td className="px-4 py-3 text-[#0F172A] font-medium">BMX</td><td className="px-4 py-3 text-[#64748B]">40 - 60 PSI</td><td className="px-4 py-3 text-[#64748B]">Seminggu sekali</td></tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-[#64748B]">
          Cek juga kondisi bibir ban dan tapak ban. Jika sudah aus atau retak-retak, segera ganti ban baru.
        </p>
      </section>

      {/* Section 4: Rem dan Drivetrain */}
      <section id="rem-drivetrain" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Cog className="w-5 h-5 text-[#F5A623]" />
          4. Perawatan Rem dan Drivetrain
        </h2>
        <div className="prose-custom">
          <p>
            Rem dan drivetrain adalah komponen vital yang menunjang keselamatan dan performa sepeda. Berikut panduan perawatannya:
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F5A623]" />
              Perawatan Rem
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-[#64748B]">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
                Cek ketebalan kampas rem secara berkala.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
                Jika bunyi saat direm, mungkin kampas habis atau kotor.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
                Rem cakram: bersihkan disc rotor dengan alkohol.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
                Rem V-brake: periksa keausan karet rem.
              </li>
            </ul>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
              <Cog className="w-4 h-4 text-[#F5A623]" />
              Perawatan Drivetrain
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-[#64748B]">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
                Bersihkan cassette dan chainring secara rutin.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
                Gunakan chain wear indicator untuk cek keausan rantai.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
                Rantai yang sudah mulur akan merusak cassette.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
                Ganti rantai setiap 2000-3000 km.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5: Servis Berkala */}
      <section id="servis-berkala" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[#F5A623]" />
          5. Servis Berkala
        </h2>
        <div className="prose-custom">
          <p>
            Beberapa perawatan sebaiknya dilakukan oleh mekanik profesional di bengkel sepeda. Jadwal servis berkala yang disarankan:
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9]">
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A] rounded-l-lg">Jenis Servis</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Frekuensi</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0F172A] rounded-r-lg">Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium">Servis Ringan</td>
                <td className="px-4 py-3 text-[#64748B]">3 bulan</td>
                <td className="px-4 py-3 text-[#64748B]">Setel rem, setel gigi, bersihkan drivetrain, cek bearing</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium">Servis Berat</td>
                <td className="px-4 py-3 text-[#64748B]">6-12 bulan</td>
                <td className="px-4 py-3 text-[#64748B]">Overhaul bearing, ganti kabel/jaket, servis shock, ganti kampas rem</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[#0F172A] font-medium">Servis Besar</td>
                <td className="px-4 py-3 text-[#64748B]">2-3 tahun</td>
                <td className="px-4 py-3 text-[#64748B]">Overhaul total, ganti semua bearing, ganti bushing shock</td>
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
                Jika Anda tidak yakin melakukan perawatan sendiri, jangan ragu untuk membawa sepeda ke bengkel terpercaya. Biaya servis lebih murah dibandingkan mengganti komponen yang rusak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Penyimpanan */}
      <section id="penyimpanan" className="mb-10 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Warehouse className="w-5 h-5 text-[#F5A623]" />
          6. Penyimpanan yang Benar
        </h2>
        <div className="prose-custom">
          <p>
            Cara menyimpan sepeda sama pentingnya dengan perawatan rutin. Penyimpanan yang salah bisa menyebabkan karat, kempes ban, dan kerusakan komponen.
          </p>
        </div>
        <ul className="mt-3 space-y-2 text-[#475569]">
          {[
            'Simpan di tempat yang kering dan tidak lembab. Hindari menyimpan sepeda di luar ruangan atau terkena hujan langsung.',
            'Jika disimpan lama, kempiskan ban sedikit untuk mengurangi tekanan pada dinding ban.',
            'Gantung sepeda dengan wall mount atau gunakan stand sepeda agar tidak membebani ban dan suspensi.',
            'Lumasi rantai sebelum menyimpan sepeda untuk jangka waktu lama.',
            'Tutup sepeda dengan kain atau cover khusus sepeda untuk melindungi dari debu.',
            'Lepaskan baterai (untuk e-bike) jika tidak digunakan dalam waktu lama dan simpan di tempat sejuk.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-2xl p-6 sm:p-8 text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Butuh Perlengkapan Perawatan Sepeda?
        </h3>
        <p className="text-[#94A3B8] text-sm sm:text-base mb-5 max-w-md mx-auto">
          SEPEDAMANIA menyediakan berbagai perlengkapan perawatan sepeda: pelumas rantai, degreaser, pompa ban, hingga tools set.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/kategori"
            className="inline-flex items-center gap-2 bg-[#F5A623] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#E0951F] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Belanja Perlengkapan
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/6281318986320?text=Halo%20SEPEDAMANIA%2C%20saya%20ingin%20konsultasi%20perawatan%20sepeda"
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
