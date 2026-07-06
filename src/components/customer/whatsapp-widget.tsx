'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

const WA_NUMBER = '6281318986320';

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-white rounded-2xl shadow-xl border border-[#E5E5EA] p-4 w-64 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1C1C1E]">SEPEDAMANIA</p>
              <p className="text-xs text-[#8E8E93]">Online</p>
            </div>
          </div>
          <p className="text-sm text-[#1C1C1E] mb-3">Halo! Bingung pilih sepeda? Konsultasi gratis dulu aja, yuk!</p>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:bg-[#1DA851] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat via WhatsApp
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:bg-[#1DA851] transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
