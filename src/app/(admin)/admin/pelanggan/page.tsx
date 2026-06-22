import { Users } from 'lucide-react';

export default function AdminCustomersPage() {
  const customers: {
    id: string; name: string; email: string; phone: string;
    createdAt: string; orders: number; total: number;
  }[] = [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-6">Pelanggan</h1>
      <div className="bg-white rounded-xl border border-[#E5E5EA] p-12 text-center">
        <Users className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
        <p className="text-[#64748B] text-sm">Belum ada pelanggan terdaftar.</p>
        <p className="text-[#94A3B8] text-xs mt-1">Data pelanggan akan muncul setelah ada yang melakukan registrasi dan checkout.</p>
      </div>
    </div>
  );
}
