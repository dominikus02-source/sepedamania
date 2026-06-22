import type { Metadata } from 'next';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, FileText, Mail, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan — SEPEDAMANIA',
  description: 'Syarat dan ketentuan penggunaan website SEPEDAMANIA. Baca ketentuan lengkap mengenai akun, pemesanan, pembayaran, pengiriman, dan lainnya.',
};

const sections = [
  {
    id: 'pendahuluan',
    title: 'Pendahuluan',
    content: (
      <p className="text-[#8E8E93] leading-relaxed">
        Selamat datang di <strong className="text-[#1C1C1E]">SEPEDAMANIA</strong>. Website{' '}
        <strong className="text-[#1C1C1E]">sepedamania.com</strong> adalah toko sepeda online
        yang menjual berbagai jenis sepeda dan aksesoris. Dengan mengakses dan menggunakan
        website ini, Anda menyetujui untuk terikat oleh Syarat &amp; Ketentuan yang telah
        ditetapkan. Jika Anda tidak setuju dengan sebagian atau seluruh ketentuan ini, mohon
        untuk tidak menggunakan layanan kami.
      </p>
    ),
  },
  {
    id: 'akun-pengguna',
    title: 'Akun Pengguna',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          Untuk dapat melakukan pemesanan, Anda diwajibkan untuk membuat akun terlebih dahulu.
          Informasi yang Anda berikan saat registrasi harus akurat, lengkap, dan terkini. Anda
          bertanggung jawab penuh atas keamanan akun, termasuk kata sandi dan segala aktivitas
          yang terjadi dalam akun Anda.
        </p>
        <p>
          SEPEDAMANIA berhak untuk menangguhkan atau menonaktifkan akun apabila ditemukan
          pelanggaran terhadap syarat dan ketentuan yang berlaku atau jika terdapat aktivitas
          mencurigakan yang merugikan pihak lain.
        </p>
      </div>
    ),
  },
  {
    id: 'pemesanan',
    title: 'Pemesanan',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          Proses pemesanan dilakukan melalui website sepedamania.com. Setelah Anda menyelesaikan
          pemesanan dan pembayaran, kami akan mengirimkan konfirmasi melalui email yang terdaftar.
        </p>
        <p>
          SEPEDAMANIA berhak untuk membatalkan pesanan apabila terdapat kesalahan harga,
          stok tidak tersedia, atau informasi produk yang tidak akurat. Pembatalan akan
          diinformasikan kepada Anda dan dana akan dikembalikan sesuai metode pembayaran.
        </p>
      </div>
    ),
  },
  {
    id: 'harga-pembayaran',
    title: 'Harga &amp; Pembayaran',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          Semua harga produk tercantum dalam mata uang <strong className="text-[#1C1C1E]">Rupiah (IDR)</strong> dan
          belum termasuk biaya pengiriman. Harga dapat berubah sewaktu-waktu tanpa pemberitahuan
          terlebih dahulu.
        </p>
        <p>
          Metode pembayaran yang tersedia meliputi transfer bank (BCA, Mandiri, BNI, BRI),
          kartu kredit, e-wallet (GoPay, OVO, Dana), dan pembayaran melalui minimarket
          (Indomaret, Alfamart). Pembayaran harus dilakukan dalam batas waktu yang ditentukan
          agar pesanan dapat diproses.
        </p>
      </div>
    ),
  },
  {
    id: 'pengiriman',
    title: 'Pengiriman',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          SEPEDAMANIA bekerja sama dengan berbagai jasa ekspedisi terpercaya seperti JNE, J&amp;T,
          SiCepat, Anteraja, dan Pos Indonesia untuk mengirimkan pesanan Anda ke seluruh
          wilayah Indonesia.
        </p>
        <p>
          Estimasi waktu pengiriman bervariasi tergantung lokasi tujuan dan jasa ekspedisi
          yang dipilih. Informasi lebih lengkap mengenai pengiriman dapat dilihat di halaman{' '}
          <Link href="/pengiriman" className="text-[#F5A623] hover:underline font-medium">
            Informasi Pengiriman
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    id: 'pengembalian',
    title: 'Pengembalian',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          SEPEDAMANIA memberikan kebijakan pengembalian barang sesuai dengan ketentuan yang
          berlaku. Produk yang rusak, cacat, atau tidak sesuai dengan pesanan dapat diajukan
          pengembalian dalam jangka waktu yang telah ditentukan.
        </p>
        <p>
          Untuk informasi lebih detail mengenai prosedur dan syarat pengembalian, silakan
          kunjungi halaman{' '}
          <Link href="/pengembalian" className="text-[#F5A623] hover:underline font-medium">
            Pengembalian Barang
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    id: 'hak-kekayaan-intelektual',
    title: 'Hak Kekayaan Intelektual',
    content: (
      <p className="text-[#8E8E93] leading-relaxed">
        Seluruh konten yang terdapat dalam website ini, termasuk namun tidak terbatas pada
        teks, gambar, logo, ikon, desain, dan perangkat lunak, adalah milik SEPEDAMANIA dan
        dilindungi oleh undang-undang hak cipta dan kekayaan intelektual yang berlaku.
        Dilarang menggunakan, menyalin, mendistribusikan, atau memodifikasi konten tanpa izin
        tertulis dari SEPEDAMANIA.
      </p>
    ),
  },
  {
    id: 'batasan-tanggung-jawab',
    title: 'Batasan Tanggung Jawab',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          SEPEDAMANIA tidak bertanggung jawab atas kerusakan atau kerugian yang timbul akibat
          penggunaan produk yang telah dibeli, termasuk namun tidak terbatas pada cedera,
          kerusakan properti, atau kehilangan lainnya.
        </p>
        <p>
          SEPEDAMANIA juga tidak bertanggung jawab atas gangguan akses website, keterlambatan
          pengiriman di luar kendali kami, atau kerugian akibat penggunaan informasi yang
          terdapat di website ini. Penggunaan website dan pembelian produk dilakukan atas
          risiko Anda sendiri.
        </p>
      </div>
    ),
  },
  {
    id: 'perubahan',
    title: 'Perubahan',
    content: (
      <p className="text-[#8E8E93] leading-relaxed">
        SEPEDAMANIA berhak untuk mengubah, menambah, atau memperbarui Syarat &amp; Ketentuan
        ini sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Perubahan akan berlaku segera
        setelah dipublikasikan di halaman ini. Kami menyarankan Anda untuk membaca halaman ini
        secara berkala agar selalu mengetahui ketentuan terkini.
      </p>
    ),
  },
  {
    id: 'kontak',
    title: 'Kontak',
    content: (
      <div className="text-[#8E8E93] leading-relaxed space-y-3">
        <p>
          Jika Anda memiliki pertanyaan mengenai Syarat &amp; Ketentuan ini, silakan hubungi
          kami melalui:
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

export default function SyaratKetentuanPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F5A623]/10 text-[#F5A623]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E]">
              Syarat &amp; Ketentuan
            </h1>
            <p className="text-sm text-[#8E8E93] mt-1">Terakhir diperbarui: 1 Juni 2026</p>
          </div>
        </div>
        <p className="text-[#8E8E93] leading-relaxed max-w-3xl">
          Harap baca Syarat &amp; Ketentuan ini dengan saksama sebelum menggunakan layanan
          SEPEDAMANIA. Dengan mengakses website ini, Anda menyetujui ketentuan yang berlaku.
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
            Dengan melanjutkan menggunakan website SEPEDAMANIA, Anda dianggap telah membaca,
            memahami, dan menyetujui seluruh Syarat &amp; Ketentuan yang berlaku. Jika Anda
            memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi tim kami.
          </p>
        </div>
      </div>
    </div>
  );
}
