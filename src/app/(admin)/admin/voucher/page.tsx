'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface AdminVoucher {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'NOMINAL';
  value: number;
  minPurchase: number;
  maxDiscount: number | null;
  quota: number | null;
  used: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

interface FlashProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  stock: number;
}
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toaster';
import { Plus, Zap } from 'lucide-react';

export default function AdminVoucherPage() {
  const { toast } = useToast();
  const [vouchers, setVouchers] = useState<AdminVoucher[]>([]);
  const [flashProducts, setFlashProducts] = useState<FlashProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'NOMINAL'>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [minPurchase, setMinPurchase] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [quota, setQuota] = useState('');
  const [expiresAt, setExpiresAt] = useState('');


  const load = useCallback(async (signal?: { cancelled: boolean }) => {
    try {
      const [vRes, pRes] = await Promise.all([
        fetch('/api/admin/vouchers', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' }),
      ]);
      if (!vRes.ok) throw new Error('Gagal memuat voucher');
      const vJson = await vRes.json();
      if (signal?.cancelled) return;
      setVouchers(vJson.vouchers ?? []);

      if (pRes.ok) {
        const pJson = await pRes.json();
        if (signal?.cancelled) return;
        setFlashProducts(
          (pJson.products ?? []).filter((p: FlashProduct) => p.salePrice !== null),
        );
      }
      setError('');
    } catch (err) {
      if (signal?.cancelled) return;
      setError(err instanceof Error ? err.message : 'Gagal memuat voucher');
    } finally {
      if (!signal?.cancelled) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    (async () => { await load(signal); })();
    return () => { signal.cancelled = true; };
  }, [load]);

  const resetForm = () => {
    setCode('');
    setType('PERCENTAGE');
    setValue('');
    setMinPurchase('');
    setMaxDiscount('');
    setQuota('');
    setExpiresAt('');
  };

  const toggleVoucherStatus = async (id: string) => {
    const voucher = vouchers.find((v) => v.id === id);
    if (!voucher) return;

    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/vouchers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !voucher.isActive }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Gagal mengubah status (${res.status})`);

      setVouchers((prev) => prev.map((v) => (v.id === id ? json.voucher : v)));
      toast(`Voucher ${voucher.code} ${voucher.isActive ? 'dinonaktifkan' : 'diaktifkan'}`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Gagal mengubah status', 'error');
    } finally {
      setBusyId('');
    }
  };

  const handleCreateVoucher = async () => {
    if (!code.trim()) {
      toast('Kode voucher wajib diisi', 'error');
      return;
    }
    if (!value || Number(value) <= 0) {
      toast('Nilai diskon harus lebih dari 0', 'error');
      return;
    }
    if (Number(minPurchase) < 0) {
      toast('Min. belanja tidak valid', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          type,
          value: Number(value),
          minPurchase: Number(minPurchase) || 0,
          maxDiscount: type === 'PERCENTAGE' && maxDiscount ? Number(maxDiscount) : null,
          quota: quota ? Number(quota) : null,
          // <input type="date"> gives YYYY-MM-DD; the API wants a full timestamp.
          expiresAt: expiresAt ? new Date(`${expiresAt}T23:59:59`).toISOString() : null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const details = json.details?.map((d: { message: string }) => d.message).join(', ');
        throw new Error(details || json.error || `Gagal membuat voucher (${res.status})`);
      }

      setVouchers((prev) => [json.voucher, ...prev]);
      setCreateOpen(false);
      resetForm();
      toast('Voucher berhasil dibuat', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Gagal membuat voucher', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3 text-sm text-[#991B1B] flex items-center justify-between gap-3">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => load()}>Coba lagi</Button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Diskon & Voucher</h1>
        <Button variant="accent" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Buat Voucher
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E5EA] bg-[#F2F2F7]">
                  <th className="text-left p-3 font-medium text-[#8E8E93]">Kode</th>
                  <th className="text-left p-3 font-medium text-[#8E8E93]">Tipe</th>
                  <th className="text-right p-3 font-medium text-[#8E8E93]">Nilai</th>
                  <th className="text-right p-3 font-medium text-[#8E8E93]">Min. Belanja</th>
                  <th className="text-right p-3 font-medium text-[#8E8E93]">Pemakaian</th>
                  <th className="text-right p-3 font-medium text-[#8E8E93]">Masa Berlaku</th>
                  <th className="text-center p-3 font-medium text-[#8E8E93]">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#8E8E93]">
                      Memuat voucher...
                    </td>
                  </tr>
                ) : vouchers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#8E8E93]">
                      Belum ada voucher
                    </td>
                  </tr>
                ) : (
                  vouchers.map((v) => (
                    <tr key={v.id} className="border-b border-[#E5E5EA] last:border-0 hover:bg-[#F2F2F7]/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#1C1C1E] uppercase">
                        {v.code}
                      </td>
                      <td className="p-3">
                        <Badge variant={v.type === 'PERCENTAGE' ? 'info' : 'primary'}>
                          {v.type === 'PERCENTAGE' ? 'Persentase' : 'Nominal'}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-[#1C1C1E] font-medium">
                        {v.type === 'PERCENTAGE' ? `${v.value}%` : formatPrice(v.value)}
                      </td>
                      <td className="p-3 text-right text-[#1C1C1E]">
                        {v.minPurchase > 0 ? formatPrice(v.minPurchase) : '-'}
                      </td>
                      <td className="p-3 text-right text-[#1C1C1E]">
                        {v.used}/{v.quota || '∞'}
                      </td>
                      <td className="p-3 text-right text-xs text-[#8E8E93] whitespace-nowrap">
                        {v.expiresAt ? formatDate(v.expiresAt) : 'Tanpa batas'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleVoucherStatus(v.id)}
                          disabled={busyId === v.id}
                          aria-label={v.isActive ? `Nonaktifkan ${v.code}` : `Aktifkan ${v.code}`}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2 ${
                            v.isActive ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              v.isActive ? 'translate-x-[22px]' : 'translate-x-[2px]'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Voucher Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voucher-code">Kode Voucher</Label>
              <Input
                id="voucher-code"
                placeholder="Contoh: DISKON50"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono font-bold uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voucher-type">Tipe</Label>
              <Select
                id="voucher-type"
                value={type}
                onChange={(e) => setType(e.target.value as 'PERCENTAGE' | 'NOMINAL')}
                options={[
                  { value: 'PERCENTAGE', label: 'Persentase (%)' },
                  { value: 'NOMINAL', label: 'Nominal (Rp)' },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voucher-value">
                Nilai {type === 'PERCENTAGE' ? 'Diskon (%)' : 'Diskon (Rp)'}
              </Label>
              <Input
                id="voucher-value"
                type="number"
                min={0}
                placeholder={type === 'PERCENTAGE' ? 'Contoh: 10' : 'Contoh: 50000'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voucher-minpurchase">Min. Belanja (Rp)</Label>
              <Input
                id="voucher-minpurchase"
                type="number"
                min={0}
                placeholder="0 = tanpa minimal"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
              />
            </div>
            {type === 'PERCENTAGE' && (
              <div className="space-y-2">
                <Label htmlFor="voucher-maxdiscount">Maks. Diskon (Rp)</Label>
                <Input
                  id="voucher-maxdiscount"
                  type="number"
                  min={0}
                  placeholder="Kosongkan jika tanpa maksimal"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="voucher-quota">Kuota Pemakaian</Label>
              <Input
                id="voucher-quota"
                type="number"
                min={0}
                placeholder="0 = tidak terbatas"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voucher-expires">Masa Berlaku</Label>
              <Input
                id="voucher-expires"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setCreateOpen(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleCreateVoucher}
                disabled={saving}
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#F5A623]" />
            <CardTitle>Flash Sale</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashProducts.slice(0, 3).map((p) => {
              const discountPercent = p.salePrice
                ? Math.round(((p.price - p.salePrice) / p.price) * 100)
                : 0;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[#E5E5EA] bg-[#F2F2F7]/50"
                >
                  <div className="relative w-16 h-16 rounded-lg bg-[#E5E5EA] overflow-hidden flex-shrink-0">
                    {p.images?.[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8E8E93] text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C1C1E] text-sm truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-[#FF3B30]">
                        {formatPrice(p.salePrice!)}
                      </span>
                      <span className="text-xs text-[#8E8E93] line-through">
                        {formatPrice(p.price)}
                      </span>
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        -{discountPercent}%
                      </Badge>
                    </div>
                    <p className="text-xs text-[#8E8E93] mt-0.5">
                      Stok: {p.stock}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {flashProducts.length === 0 && (
            <p className="text-center text-[#8E8E93] py-8">
              Tidak ada produk flash sale saat ini
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
