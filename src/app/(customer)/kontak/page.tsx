import type { Metadata } from 'next';
import { MessageCircle, Mail, MapPin, Clock, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hubungi Kami — SEPEDAMANIA',
  description: 'Hubungi tim SEPEDAMANIA melalui WhatsApp, email, atau kunjungi alamat kami. Kami siap membantu Anda.',
};

const contactCards = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+62 813-1898-6320',
    href: 'https://wa.me/6281318986320',
    color: 'text-[#25D366]',
    bgColor: 'bg-[#25D366]/10',
    description: 'Respons cepat dalam 1×24 jam',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'sepedamania7@gmail.com',
    href: 'mailto:sepedamania7@gmail.com',
    color: 'text-[#F5A623]',
    bgColor: 'bg-[#F5A623]/10',
    description: 'Kami akan membalas dalam 1×24 jam',
  },
  {
    icon: MapPin,
    label: 'Alamat',
    value: 'Jakarta Pusat, Indonesia',
    href: null,
    color: 'text-[#FF3B30]',
    bgColor: 'bg-[#FF3B30]/10',
    description: 'Kantor pusat SEPEDAMANIA',
  },
  {
    icon: Clock,
    label: 'Jam Operasional',
    value: 'Sen—Jum 08:00–17:00',
    href: null,
    color: 'text-[#34C759]',
    bgColor: 'bg-[#34C759]/10',
    description: 'Sabtu 08:00–14:00 | Minggu & hari libur tutup',
  },
];

export default function KontakPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F5A623]/10 text-[#F5A623]">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E]">
              Hubungi Kami
            </h1>
            <p className="text-sm text-[#8E8E93] mt-1">
              Punya pertanyaan atau butuh bantuan? Kami siap membantu Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {contactCards.map((card) => {
          const Icon = card.icon;
          const isLink = card.href !== null;

          const content = (
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 sm:p-6 h-full transition-all duration-200 hover:border-[#F5A623]/30 hover:shadow-lg hover:shadow-amber-500/5">
              <div className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.bgColor} ${card.color} shrink-0`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1C1C1E]">{card.label}</h3>
                  <p className="text-sm text-[#1C1C1E] font-medium mt-0.5 break-all">
                    {card.value}
                  </p>
                  <p className="text-xs text-[#8E8E93] mt-1">{card.description}</p>
                </div>
                {isLink && (
                  <ChevronRight className="w-5 h-5 text-[#8E8E93] shrink-0 mt-1" />
                )}
              </div>
            </div>
          );

          if (isLink) {
            return (
              <a
                key={card.label}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                {content}
              </a>
            );
          }

          return (
            <div key={card.label} className="block">
              {content}
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-5 sm:p-6 bg-[#F2F2F7] rounded-2xl border border-[#E5E5EA]">
        <h2 className="text-base font-bold text-[#1C1C1E] mb-2">
          Butuh bantuan lebih lanjut?
        </h2>
        <p className="text-sm text-[#8E8E93] leading-relaxed">
          Tim customer service SEPEDAMANIA siap membantu Anda dari hari Senin hingga Sabtu.
          Jangan ragu untuk menghubungi kami melalui WhatsApp atau email — kami akan merespons
          secepat mungkin.
        </p>
      </div>
    </div>
  );
}
