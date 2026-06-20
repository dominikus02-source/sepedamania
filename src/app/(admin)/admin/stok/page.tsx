'use client';

import { useState } from 'react';
import { mockProducts } from '@/lib/mock-data';
import { mockStockLogs, StockLog } from '@/lib/mock-admin-data';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toaster';
import { Search, Plus, ChevronDown, ChevronUp, PackageSearch } from 'lucide-react';

const stockColor = (stock: number) => {
  if (stock > 5) return '#34C759';
  if (stock > 0) return '#F5A623';
  return '#FF3B30';
};

const stockStatus = (stock: number) => {
  if (stock > 5) return 'Aman';
  if (stock > 0) return 'Kritis';
  return 'Habis';
};

const typeBadgeVariant = (type: StockLog['type']) => {
  switch (type) {
    case 'IN': return 'success' as const;
    case 'OUT': return 'destructive' as const;
    case 'ADJUSTMENT': return 'warning' as const;
  }
};

const typeLabel = (type: StockLog['type']) => {
  switch (type) {
    case 'IN': return 'IN';
    case 'OUT': return 'OUT';
    case 'ADJUSTMENT': return 'ADJUSTMENT';
  }
};

export default function AdminStockPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(() => [...mockProducts].sort((a, b) => a.stock - b.stock));
  const [stockLogs, setStockLogs] = useState<StockLog[]>([...mockStockLogs]);
  const [logOpen, setLogOpen] = useState(false);
  const [restockProduct, setRestockProduct] = useState<(typeof mockProducts)[number] | null>(null);
  const [restockQty, setRestockQty] = useState(1);
  const [restockNote, setRestockNote] = useState('');
  const [restockOpen, setRestockOpen] = useState(false);

  const filteredProducts = search
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  const openRestock = (product: (typeof mockProducts)[number]) => {
    setRestockProduct(product);
    setRestockQty(1);
    setRestockNote('');
    setRestockOpen(true);
  };

  const handleRestock = () => {
    if (!restockProduct || restockQty < 1) return;

    const stockBefore = restockProduct.stock;
    const stockAfter = stockBefore + restockQty;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === restockProduct.id ? { ...p, stock: stockAfter } : p
      )
    );

    const newLog: StockLog = {
      id: `sl-${Date.now()}`,
      productId: restockProduct.id,
      productName: restockProduct.name,
      type: 'IN',
      qty: restockQty,
      stockBefore,
      stockAfter,
      note: restockNote || 'Restok manual',
      createdAt: new Date().toISOString(),
    };

    setStockLogs((prev) => [newLog, ...prev]);
    setRestockOpen(false);
    toast('Restok berhasil', 'success');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Stok & Inventori</h1>
        <Button variant="accent" onClick={() => {}}>
          <PackageSearch className="w-4 h-4 mr-2" />
          Restok Massal
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
        <Input
          placeholder="Cari produk..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
                  <th className="text-left p-3 font-medium text-[#8E8E93]">Produk</th>
                  <th className="text-left p-3 font-medium text-[#8E8E93]">SKU</th>
                  <th className="text-right p-3 font-medium text-[#8E8E93]">Stok</th>
                  <th className="text-right p-3 font-medium text-[#8E8E93]">Terjual</th>
                  <th className="text-center p-3 font-medium text-[#8E8E93]">Status</th>
                  <th className="text-center p-3 font-medium text-[#8E8E93]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#8E8E93]">
                      Tidak ada produk ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50 transition-colors">
                      <td className="p-3 font-medium text-[#1C1C1E]">{p.name}</td>
                      <td className="p-3 text-[#8E8E93] font-mono text-xs">{p.sku}</td>
                      <td className="p-3 text-right">
                        <Badge
                          variant={p.stock > 5 ? 'success' : p.stock > 0 ? 'warning' : 'destructive'}
                        >
                          {p.stock}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-[#1C1C1E]">{p.sold}</td>
                      <td className="p-3 text-center">
                        <span
                          className="text-xs font-medium"
                          style={{ color: stockColor(p.stock) }}
                        >
                          {stockStatus(p.stock)}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRestock(p)}
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Restok
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Restock Modal */}
      <Dialog open={restockOpen} onOpenChange={setRestockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restok Produk</DialogTitle>
          </DialogHeader>
          {restockProduct && (
            <div className="space-y-4">
              <div>
                <p className="font-medium text-[#1C1C1E]">{restockProduct.name}</p>
                <p className="text-sm text-[#8E8E93]">
                  Stok saat ini:{' '}
                  <span
                    className="font-semibold"
                    style={{ color: stockColor(restockProduct.stock) }}
                  >
                    {restockProduct.stock}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restock-qty">Jumlah Stok Masuk</Label>
                <Input
                  id="restock-qty"
                  type="number"
                  min={1}
                  value={restockQty}
                  onChange={(e) => setRestockQty(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restock-note">Catatan</Label>
                <Input
                  id="restock-note"
                  placeholder="Misal: Restok dari supplier"
                  value={restockNote}
                  onChange={(e) => setRestockNote(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setRestockOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={handleRestock}
                >
                  Simpan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stock Log Section */}
      <Card className="mt-6">
        <CardHeader
          className="cursor-pointer select-none flex flex-row items-center justify-between"
          onClick={() => setLogOpen(!logOpen)}
        >
          <CardTitle>Riwayat Stok</CardTitle>
          <Button variant="ghost" size="sm">
            {logOpen ? (
              <ChevronUp className="w-4 h-4 text-[#8E8E93]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8E8E93]" />
            )}
          </Button>
        </CardHeader>
        {logOpen && (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
                    <th className="text-left p-3 font-medium text-[#8E8E93]">Tanggal</th>
                    <th className="text-left p-3 font-medium text-[#8E8E93]">Produk</th>
                    <th className="text-center p-3 font-medium text-[#8E8E93]">Tipe</th>
                    <th className="text-right p-3 font-medium text-[#8E8E93]">Qty</th>
                    <th className="text-right p-3 font-medium text-[#8E8E93]">Stok Akhir</th>
                    <th className="text-left p-3 font-medium text-[#8E8E93]">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {stockLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#8E8E93]">
                        Belum ada riwayat stok
                      </td>
                    </tr>
                  ) : (
                    stockLogs.map((log) => (
                      <tr key={log.id} className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50 transition-colors">
                        <td className="p-3 text-[#8E8E93] text-xs whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="p-3 font-medium text-[#1C1C1E]">{log.productName}</td>
                        <td className="p-3 text-center">
                          <Badge variant={typeBadgeVariant(log.type)}>
                            {typeLabel(log.type)}
                          </Badge>
                        </td>
                        <td className="p-3 text-right text-[#1C1C1E] font-medium">{log.qty}</td>
                        <td className="p-3 text-right text-[#1C1C1E]">{log.stockAfter}</td>
                        <td className="p-3 text-[#8E8E93] text-xs max-w-[200px] truncate" title={log.note}>
                          {log.note}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
