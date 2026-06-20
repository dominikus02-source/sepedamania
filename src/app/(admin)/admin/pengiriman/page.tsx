export default function AdminShippingPage() {
  const couriers = [
    { name: 'JNE', active: true },
    { name: 'J&T', active: true },
    { name: 'SiCepat', active: true },
    { name: 'Anteraja', active: true },
    { name: 'Pos Indonesia', active: true },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-6">Pengiriman</h1>
      <div className="bg-white rounded-xl border border-[#E5E5EA] p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-[#1C1C1E] mb-4">Kurir Aktif</h2>
        <div className="space-y-3">
          {couriers.map((c) => (
            <div key={c.name} className="flex items-center justify-between py-2 border-b border-[#E5E5EA] last:border-0">
              <span className="text-sm font-medium text-[#1C1C1E]">{c.name}</span>
              <div className={`w-10 h-6 rounded-full ${c.active ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'} relative cursor-pointer`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${c.active ? 'left-[18px]' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-[#F2F2F7] rounded-lg">
          <p className="text-xs text-[#8E8E93]">RajaOngkir API Key dan origin city dikonfigurasi di halaman Pengaturan.</p>
        </div>
      </div>
    </div>
  );
}
