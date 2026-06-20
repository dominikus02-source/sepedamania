import { mockCategories, mockBrands } from '@/lib/mock-data';

export default function AdminCategoriesPage() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1E] mb-4">Kategori</h1>
        <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]"><th className="text-left p-3 font-medium text-[#8E8E93]">Nama</th><th className="text-left p-3 font-medium text-[#8E8E93]">Slug</th><th className="text-right p-3 font-medium text-[#8E8E93]">Produk</th></tr></thead>
            <tbody>{mockCategories.map((c) => (<tr key={c.id} className="border-b border-[#E5E5EA] last:border-0"><td className="p-3 font-medium">{c.name}</td><td className="p-3 text-[#8E8E93]">{c.slug}</td><td className="p-3 text-right">{c.id === '1' ? 2 : c.id === '2' ? 2 : c.id === '6' ? 1 : 1}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1E] mb-4">Merek</h1>
        <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]"><th className="text-left p-3 font-medium text-[#8E8E93]">Nama</th><th className="text-left p-3 font-medium text-[#8E8E93]">Slug</th><th className="text-right p-3 font-medium text-[#8E8E93]">Produk</th></tr></thead>
            <tbody>{mockBrands.map((b) => (<tr key={b.id} className="border-b border-[#E5E5EA] last:border-0"><td className="p-3 font-medium">{b.name}</td><td className="p-3 text-[#8E8E93]">{b.slug}</td><td className="p-3 text-right">{b.id === '1' ? 2 : b.id === '2' ? 2 : b.id === '5' ? 2 : 1}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
