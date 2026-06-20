'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle, Send, Phone, ExternalLink } from 'lucide-react';

interface ChatUser {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

const chatUsers: ChatUser[] = [
  { id: 'u1', name: 'Budi Santoso', phone: '6281234567890', lastMessage: 'Sudah saya transfer nih kak', lastMessageAt: new Date().toISOString(), unread: 2 },
  { id: 'u2', name: 'Ani Wijaya', phone: '6281234567891', lastMessage: 'Ukuran M tersedia?', lastMessageAt: new Date(Date.now() - 3600000).toISOString(), unread: 0 },
  { id: 'u3', name: 'Citra Dewi', phone: '6281234567892', lastMessage: 'Kapan dikirim pak?', lastMessageAt: new Date(Date.now() - 7200000).toISOString(), unread: 1 },
  { id: 'u4', name: 'Deni Pratama', phone: '6281234567893', lastMessage: 'Terima kasih', lastMessageAt: new Date(Date.now() - 86400000).toISOString(), unread: 0 },
  { id: 'u5', name: 'Eka Putri', phone: '6281234567894', lastMessage: 'Mau order lagi dong', lastMessageAt: new Date(Date.now() - 172800000).toISOString(), unread: 0 },
];

export default function AdminChatPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ChatUser | null>(null);
  const [message, setMessage] = useState('');

  const filtered = chatUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  const sendWhatsApp = () => {
    if (!selected || !message) return;
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${selected.phone}?text=${text}`, '_blank');
    setMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4">
      <div className="w-80 bg-white rounded-xl border border-[#E5E5EA] overflow-hidden flex flex-col shrink-0">
        <div className="p-3 border-b border-[#E5E5EA]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
            <Input
              placeholder="Cari pelanggan..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelected(u)}
              className={`w-full text-left p-3 border-b border-[#E5E5EA] hover:bg-[#F2F2F7] transition-colors ${selected?.id === u.id ? 'bg-[#F5A623]/5' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-[#1C1C1E]">{u.name}</span>
                <span className="text-[10px] text-[#8E8E93]">{formatDate(u.lastMessageAt)}</span>
              </div>
              <p className="text-xs text-[#8E8E93] truncate">{u.lastMessage}</p>
              {u.unread > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F5A623] text-white text-[10px] font-bold mt-1">
                  {u.unread}
                </span>
              )}
            </button>
          ))}
          {filtered.length === 0 && <p className="text-sm text-[#8E8E93] text-center py-8">Pelanggan tidak ditemukan</p>}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-[#E5E5EA] overflow-hidden flex flex-col">
        {selected ? (
          <>
            <div className="p-3 border-b border-[#E5E5EA] flex items-center justify-between bg-[#F2F2F7]">
              <div>
                <h2 className="font-semibold text-[#1C1C1E]">{selected.name}</h2>
                <p className="text-xs text-[#8E8E93]">{selected.phone}</p>
              </div>
              <a
                href={`https://wa.me/${selected.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-[#25D366] hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>Buka WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <MessageCircle className="w-12 h-12 text-[#25D366] mb-3" />
              <p className="text-sm text-[#8E8E93]">
                Kirim pesan WhatsApp ke <span className="font-medium text-[#1C1C1E]">{selected.name}</span>
              </p>
              <p className="text-xs text-[#8E8E93] mt-1">
                Pesan akan terbuka di WhatsApp Web / App
              </p>
            </div>

            <div className="p-3 border-t border-[#E5E5EA] flex gap-2">
              <Input
                placeholder="Ketik pesan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendWhatsApp()}
              />
              <Button onClick={sendWhatsApp} className="bg-[#25D366] hover:bg-[#1DA851] shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-3">
            <MessageCircle className="w-16 h-16 text-[#E5E5EA]" />
            <p className="text-sm text-[#8E8E93]">Pilih pelanggan untuk memulai chat</p>
          </div>
        )}
      </div>
    </div>
  );
}
