import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus, Search, Image as ImageIcon } from 'lucide-react';
import { mockProducts, mockCategories } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  let products = mockProducts;

  if (q) {
    products = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  }

  if (category) {
    products = products.filter((p) => p.categoryId === category);
  }

  const getCatName = (id: string) => mockCategories.find((c) => c.id === id)?.name || '-';
  const getBrandName = (id: string) => {
    const brandMap: Record<string, string> = {
      '1': 'Polygon',
      '2': 'United',
      '3': 'Wimcycle',
      '4': 'Pacific',
      '5': 'Element',
    };
    return brandMap[id] || '-';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Produk</h1>
        <Link href="/admin/produk/tambah">
          <Button variant="accent">
            <Plus className="w-4 h-4 mr-1" /> Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Filters: Search + Category */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <form className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
          <Input name="q" placeholder="Cari produk..." className="pl-9" defaultValue={q} />
        </form>
        <form>
          <Select
            name="category"
            defaultValue={category || ''}
            onChange={() => {
              // Submit on change via form submit
              const form = document.getElementById('category-form') as HTMLFormElement;
              form?.requestSubmit();
            }}
            options={[
              { value: '', label: 'Semua Kategori' },
              ...mockCategories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </form>
        {/* Hidden form to handle category filter submission */}
        <form id="category-form" method="GET" className="hidden">
          {q && <input type="hidden" name="q" value={q} />}
          <input type="hidden" name="category" id="category-input" />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5EA] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
              <th className="text-left p-3 font-medium text-[#8E8E93] w-12">Gbr</th>
              <th className="text-left p-3 font-medium text-[#8E8E93]">Produk</th>
              <th className="text-left p-3 font-medium text-[#8E8E93]">SKU</th>
              <th className="text-left p-3 font-medium text-[#8E8E93]">Kategori</th>
              <th className="text-left p-3 font-medium text-[#8E8E93]">Merek</th>
              <th className="text-right p-3 font-medium text-[#8E8E93]">Harga</th>
              <th className="text-right p-3 font-medium text-[#8E8E93]">Stok</th>
              <th className="text-center p-3 font-medium text-[#8E8E93]">Status</th>
              <th className="text-right p-3 font-medium text-[#8E8E93]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50 transition-colors"
              >
                {/* Thumbnail */}
                <td className="p-3">
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#E5E5EA]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#F2F2F7] flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-[#8E8E93]" />
                    </div>
                  )}
                </td>
                {/* Name */}
                <td className="p-3">
                  <span className="font-medium text-[#1C1C1E]">{p.name}</span>
                </td>
                {/* SKU */}
                <td className="p-3 text-[#8E8E93] font-mono text-xs">{p.sku}</td>
                {/* Category */}
                <td className="p-3 text-[#8E8E93]">{getCatName(p.categoryId)}</td>
                {/* Brand */}
                <td className="p-3 text-[#8E8E93]">{getBrandName(p.brandId)}</td>
                {/* Price */}
                <td className="p-3 text-right font-medium">
                  {p.salePrice ? (
                    <span>
                      <span className="text-[#FF3B30]">{formatPrice(p.salePrice)}</span>{' '}
                      <span className="text-[#8E8E93] line-through text-xs">{formatPrice(p.price)}</span>
                    </span>
                  ) : (
                    formatPrice(p.price)
                  )}
                </td>
                {/* Stock */}
                <td className="p-3 text-right">
                  <Badge variant={p.stock > 5 ? 'success' : 'destructive'}>{p.stock}</Badge>
                </td>
                {/* Status */}
                <td className="p-3 text-center">
                  <Badge variant={p.isActive ? 'success' : 'default'}>
                    {p.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </td>
                {/* Actions */}
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/produk/${p.slug}`}
                    className="text-xs font-medium text-[#F5A623] hover:text-[#E09E1F] hover:underline transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-[#8E8E93] text-sm">
            Tidak ada produk yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
