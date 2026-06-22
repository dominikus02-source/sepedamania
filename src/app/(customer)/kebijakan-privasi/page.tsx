import type { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Mail, MessageCircle, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — SEPEDAMANIA',
  description: 'Kebijakan privasi SEPEDAMANIA. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
};

const sections = [
  {
    id: 'informasi-dikumpulkan',
    title: 'Informasi yang Dikumpulkan',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          Kami mengumpulkan informasi yang Anda berikan secara langsung saat menggunakan layanan
          SEPEDAMANIA, termasuk:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Nama lengkap</li>
          <li>Alamat email</li>
          <li>Nomor telepon</li>
          <li>Alamat pengiriman</li>
          <li>Data pesanan dan riwayat pembelian</li>
          <li>Informasi pembayaran (diproses melalui mitra pembayaran yang aman)</li>
        </ul>
        <p>
          Selain itu, kami juga secara otomatis mengumpulkan data tertentu seperti alamat IP,
          tipe peramban, halaman yang dikunjungi, dan durasi kunjungan untuk meningkatkan
          pengalaman pengguna.
        </p>
      </div>
    ),
  },
  {
    id: 'penggunaan-informasi',
    title: 'Penggunaan Informasi',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>Informasi yang kami kumpulkan digunakan untuk tujuan berikut:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Memproses dan mengkonfirmasi pesanan Anda</li>
          <li>Mengirimkan notifikasi status pesanan dan pengiriman</li>
          <li>Memberikan layanan pelanggan dan dukungan teknis</li>
          <li>Mengirimkan informasi promo dan penawaran (dengan persetujuan Anda)</li>
          <li>Meningkatkan kualitas produk dan layanan kami</li>
          <li>Mencegah dan mendeteksi aktivitas penipuan</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'penyimpanan-keamanan',
    title: 'Penyimpanan &amp; Keamanan',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          Data pribadi Anda disimpan di server yang aman dengan sistem enkripsi dan firewall
          untuk melindungi dari akses tidak sah, penyalahgunaan, atau kebocoran data.
        </p>
        <p>
          Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai dengan
          standar industri untuk memastikan keamanan data Anda. Namun, tidak ada metode
          transmisi data melalui internet yang 100% aman, sehingga kami tidak dapat menjamin
          keamanan absolut.
        </p>
      </div>
    ),
  },
  {
    id: 'cookie',
    title: 'Cookie',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          SEPEDAMANIA menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan
          pengalaman Anda saat menjelajahi website kami. Cookie membantu kami:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Mengingat preferensi dan pengaturan Anda</li>
          <li>Memahami bagaimana Anda berinteraksi dengan website</li>
          <li>Menyajikan konten dan rekomendasi yang relevan</li>
          <li>Menganalisis lalu lintas dan tren penggunaan</li>
        </ul>
        <p>
          Anda dapat mengontrol penggunaan cookie melalui pengaturan peramban Anda. Namun,
          menonaktifkan cookie dapat memengaruhi fungsionalitas website.
        </p>
      </div>
    ),
  },
  {
    id: 'hak-pengguna',
    title: 'Hak Pengguna',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          Anda memiliki hak penuh atas data pribadi yang kami kumpulkan, termasuk:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Hak untuk mengakses data pribadi yang kami miliki</li>
          <li>Hak untuk memperbaiki data yang tidak akurat atau tidak lengkap</li>
          <li>Hak untuk menghapus data pribadi Anda (dengan batasan tertentu)</li>
          <li>Hak untuk membatasi atau menolak pemrosesan data</li>
          <li>Hak untuk menarik persetujuan kapan saja</li>
        </ul>
        <p>
          Untuk mengakses, memperbaiki, atau menghapus data Anda, silakan hubungi tim kami
          melalui kontak yang tersedia.
        </p>
      </div>
    ),
  },
  {
    id: 'pihak-ketiga',
    title: 'Pihak Ketiga',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          SEPEDAMANIA <strong className="text-[#1C1C1E]">tidak menjual</strong> data pribadi Anda
          kepada pihak ketiga untuk tujuan pemasaran mereka sendiri.
        </p>
        <p>
          Kami dapat membagikan informasi Anda dengan mitra terpercaya yang membantu kami
          dalam menjalankan bisnis, seperti:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Mitra pengiriman (JNE, J&amp;T, SiCepat, Anteraja, Pos Indonesia)</li>
          <li>Mitra pembayaran (bank, e-wallet, gerai minimarket)</li>
          <li>Penyedia layanan teknologi dan hosting</li>
        </ul>
        <p>
          Mitra-mitra ini terikat oleh perjanjian kerahasiaan dan hanya menggunakan data Anda
          untuk keperluan yang spesifik dan terbatas.
        </p>
      </div>
    ),
  },
  {
    id: 'perubahan',
    title: 'Perubahan',
    content: (
      <p className="text-[#8E8E93] leading-relaxed">
        SEPEDAMANIA dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Setiap perubahan
        akan diumumkan melalui halaman ini dan akan berlaku segera setelah dipublikasikan.
        Kami mendorong Anda untuk meninjau halaman ini secara berkala agar tetap mengetahui
        bagaimana kami melindungi data Anda.
      </p>
    ),
  },
  {
    id: 'kontak',
    title: 'Kontak',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi
          ini atau cara kami menangani data Anda, silakan hubungi kami:
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href="https://wa.me/6281318986320"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F5A623]/10 text-[#F5A623] rounded-xl hover:bg-[#F5A623]/20 transition-colors font-medium text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp +62 813-1898-6320
          </a>
          <a
            href="mailto:sepedamania7@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F2F2F7] text-[#1C1C1E] rounded-xl hover:bg-[#E5E5EA] transition-colors font-medium text-sm"
          >
            <Mail className="w-4 h-4" />
            sepedamania7@gmail.com
          </a>
        </div>
      </div>
    ),
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F5A623]/10 text-[#F5A623]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E]">
              Kebijakan Privasi
            </h1>
            <p className="text-sm text-[#8E8E93] mt-1">Terakhir diperbarui: 1 Juni 2026</p>
          </div>
        </div>
        <p className="text-[#8E8E93] leading-relaxed max-w-3xl">
          SEPEDAMANIA berkomitmen untuk melindungi privasi Anda. Kebijakan ini menjelaskan
          bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
        </p>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden">
        <div className="divide-y divide-[#E5E5EA]">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id}>
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-start gap-4">
                  <span className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-[#F5A623]/10 text-[#F5A623] text-sm font-bold shrink-0 mt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1E] mb-3">
                      {section.title}
                    </h2>
                    {section.content}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-8 p-4 sm:p-6 bg-[#F2F2F7] rounded-2xl border border-[#E5E5EA]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#F5A623] shrink-0 mt-0.5" />
          <p className="text-sm text-[#8E8E93] leading-relaxed">
            Privasi Anda adalah prioritas kami. Kami terus berupaya menjaga kepercayaan yang
            Anda berikan dengan melindungi data pribadi Anda sesuai dengan standar keamanan
            tertinggi.
          </p>
        </div>
      </div>
    </div>
  );
}
