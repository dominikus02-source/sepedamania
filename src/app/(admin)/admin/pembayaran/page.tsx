export default function AdminPaymentPage() {
  const methods = [
    { name: 'BCA Virtual Account', active: true },
    { name: 'BNI Virtual Account', active: true },
    { name: 'BRI Virtual Account', active: true },
    { name: 'Mandiri Virtual Account', active: true },
    { name: 'QRIS', active: true },
    { name: 'OVO', active: true },
    { name: 'GoPay', active: true },
    { name: 'DANA', active: true },
    { name: 'ShopeePay', active: true },
    { name: 'Kartu Kredit/Debit', active: true },
    { name: 'COD (Bayar di Tempat)', active: false },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-6">Pembayaran</h1>
      <div className="bg-white rounded-xl border border-[#E5E5EA] p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-[#1C1C1E] mb-4">Metode Pembayaran</h2>
        <div className="space-y-2">
          {methods.map((m) => (
            <div key={m.name} className="flex items-center justify-between py-2 border-b border-[#E5E5EA] last:border-0">
              <span className="text-sm text-[#1C1C1E]">{m.name}</span>
              <span className={`text-xs font-medium ${m.active ? 'text-[#34C759]' : 'text-[#8E8E93]'}`}>{m.active ? 'Aktif' : 'Nonaktif'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
