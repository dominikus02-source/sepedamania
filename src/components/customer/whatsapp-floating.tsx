'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

const WA_NUMBER = '6281318986320';
const WA_URL = `https://wa.me/${WA_NUMBER}`;

export function WhatsAppFloating() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 group">
      {/* Tooltip */}
      <div className="absolute bottom-full mb-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-[#1A1A1A] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap relative">
          Butuh bantuan?
          <div className="absolute top-full right-4 w-2 h-2 bg-[#1A1A1A] rotate-45 -mt-1" />
        </div>
      </div>

      {/* Pulsing ring */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping pointer-events-none" />

      {/* WhatsApp Button */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:bg-[#1DA851] transition-all duration-300 hover:scale-110 hover:shadow-xl animate-[whatsappEnter_0.4s_ease-out_forwards]"
        aria-label="Hubungi via WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      <style>{`
        @keyframes whatsappEnter {
          from {
            opacity: 0;
            transform: scale(0.5) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
