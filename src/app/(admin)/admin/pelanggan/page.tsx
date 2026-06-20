import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminCustomersPage() {
  const customers = [
    { id: 'u1', name: 'Budi Santoso', email: 'budi@email.com', phone: '081234567890', createdAt: new Date('2025-01-15').toISOString(), orders: 5, total: 25000000 },
    { id: 'u2', name: 'Ani Wijaya', email: 'ani@email.com', phone: '081234567891', createdAt: new Date('2025-02-20').toISOString(), orders: 3, total: 15000000 },
    { id: 'u3', name: 'Citra Dewi', email: 'citra@email.com', phone: '081234567892', createdAt: new Date('2025-03-10').toISOString(), orders: 8, total: 42000000 },
    { id: 'u4', name: 'Deni Pratama', email: 'deni@email.com', phone: '081234567893', createdAt: new Date('2025-03-25').toISOString(), orders: 2, total: 5000000 },
    { id: 'u5', name: 'Eka Putri', email: 'eka@email.com', phone: '081234567894', createdAt: new Date('2025-04-01').toISOString(), orders: 1, total: 4000000 },
    { id: 'u6', name: 'Fajar Hidayat', email: 'fajar@email.com', phone: '081234567895', createdAt: new Date('2025-04-15').toISOString(), orders: 4, total: 18000000 },
    { id: 'u7', name: 'Gita Permata', email: 'gita@email.com', phone: '081234567896', createdAt: new Date('2025-05-01').toISOString(), orders: 6, total: 32000000 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-6">Pelanggan</h1>
      <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
              <th className="text-left p-3 font-medium text-[#8E8E93]">Nama</th>
              <th className="text-left p-3 font-medium text-[#8E8E93]">Email</th>
              <th className="text-left p-3 font-medium text-[#8E8E93]">No. HP</th>
              <th className="text-right p-3 font-medium text-[#8E8E93]">Pesanan</th>
              <th className="text-right p-3 font-medium text-[#8E8E93]">Total Belanja</th>
              <th className="text-right p-3 font-medium text-[#8E8E93]">Bergabung</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50">
                <td className="p-3 font-medium text-[#1C1C1E]">{c.name}</td>
                <td className="p-3 text-[#8E8E93]">{c.email}</td>
                <td className="p-3 text-[#8E8E93]">{c.phone}</td>
                <td className="p-3 text-right">{c.orders}</td>
                <td className="p-3 text-right font-medium">{formatPrice(c.total)}</td>
                <td className="p-3 text-right text-[#8E8E93] text-xs">{formatDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
