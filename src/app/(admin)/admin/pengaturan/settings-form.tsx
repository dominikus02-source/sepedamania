'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toaster';
import { Save, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

interface StoreSettings {
  id: string;
  storeName: string;
  storeLogo: string | null;
  storeDescription: string;
  storeAddress: string;
  storeCity: string;
  storeProvince: string;
  storePostalCode: string;
  waNumber: string;
  email: string;
  rajaongkirKey: string;
  rajaongkirOriginCity: string;
  xenditSecretKey: string;
  xenditWebhookToken: string;
  codEnabled: boolean;
  maintenanceMode: boolean;
  updatedAt: string;
}

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const { toast } = useToast();
  const [form, setForm] = useState<StoreSettings>(settings);
  const [loading, setLoading] = useState(false);
  const [apiKeysOpen, setApiKeysOpen] = useState(false);
  const [showRajaongkir, setShowRajaongkir] = useState(false);
  const [showXenditKey, setShowXenditKey] = useState(false);
  const [showXenditWebhook, setShowXenditWebhook] = useState(false);
  const [codEnabled, setCodEnabled] = useState(settings.codEnabled);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);

  const update = (field: keyof StoreSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, codEnabled, maintenanceMode };
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
      toast('Pengaturan berhasil disimpan', 'success');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleCod = () => {
    const next = !codEnabled;
    setCodEnabled(next);
    toast(next ? 'COD telah diaktifkan' : 'COD telah dinonaktifkan', 'info');
  };

  const toggleMaintenance = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    toast(
      next ? 'Mode pemeliharaan diaktifkan' : 'Mode pemeliharaan dinonaktifkan',
      'info'
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-6">Pengaturan Toko</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* ── Informasi Toko ── */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1C1C1E]">Informasi Toko</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Toko</Label>
              <Input value={form.storeName} onChange={update('storeName')} />
            </div>
            <div className="space-y-2">
              <Label>Nomor WhatsApp CS</Label>
              <Input value={form.waNumber} onChange={update('waNumber')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email Toko</Label>
              <Input type="email" value={form.email} onChange={update('email')} />
            </div>
            <div className="space-y-2">
              <Label>Kode Pos</Label>
              <Input value={form.storePostalCode} onChange={update('storePostalCode')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Alamat Toko</Label>
            <Input value={form.storeAddress} onChange={update('storeAddress')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kota</Label>
              <Input value={form.storeCity} onChange={update('storeCity')} />
            </div>
            <div className="space-y-2">
              <Label>Provinsi</Label>
              <Input value={form.storeProvince} onChange={update('storeProvince')} />
            </div>
          </div>
        </div>

        {/* ── API Keys (collapsible) ── */}
        <div className="pt-4 border-t border-[#E5E5EA]">
          <button
            type="button"
            onClick={() => setApiKeysOpen(!apiKeysOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-semibold text-[#1C1C1E]">API Keys</h3>
            {apiKeysOpen ? (
              <ChevronUp className="w-4 h-4 text-[#8E8E93]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8E8E93]" />
            )}
          </button>
          {apiKeysOpen && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>RajaOngkir API Key</Label>
                  <div className="relative">
                    <Input
                      type={showRajaongkir ? 'text' : 'password'}
                      value={form.rajaongkirKey || ''}
                      onChange={update('rajaongkirKey')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRajaongkir(!showRajaongkir)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1C1C1E]"
                    >
                      {showRajaongkir ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Origin City ID</Label>
                  <Input
                    value={form.rajaongkirOriginCity || ''}
                    onChange={update('rajaongkirOriginCity')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Midtrans Server Key</Label>
                  <div className="relative">
                    <Input
                      type="password"
                      value={form.xenditSecretKey || ''}
                      onChange={update('xenditSecretKey')}
                      placeholder="Set via env MIDTRANS_SERVER_KEY"
                    />
                  </div>
                  <p className="text-[10px] text-[#8E8E93]">Digunakan dari environment variable MIDTRANS_SERVER_KEY</p>
                </div>
                <div className="space-y-2">
                  <Label>Midtrans Client Key</Label>
                  <div className="relative">
                    <Input
                      type="password"
                      value={form.xenditWebhookToken || ''}
                      onChange={update('xenditWebhookToken')}
                      placeholder="Set via env MIDTRANS_CLIENT_KEY"
                    />
                  </div>
                  <p className="text-[10px] text-[#8E8E93]">Digunakan dari environment variable MIDTRANS_CLIENT_KEY</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Konfigurasi Toko ── */}
        <div className="pt-4 border-t border-[#E5E5EA] space-y-4">
          <h3 className="text-sm font-semibold text-[#1C1C1E]">Konfigurasi Toko</h3>
          <div className="space-y-3">
            {/* Toggle: COD */}
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer">Aktifkan COD</Label>
              <button
                type="button"
                onClick={toggleCod}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  codEnabled ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                    codEnabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
                  }`}
                />
              </button>
            </div>

            {/* Toggle: Maintenance Mode */}
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer">Mode Pemeliharaan</Label>
              <button
                type="button"
                onClick={toggleMaintenance}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  maintenanceMode ? 'bg-[#FF9500]' : 'bg-[#E5E5EA]'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                    maintenanceMode ? 'translate-x-[22px]' : 'translate-x-[2px]'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="pt-2">
          <Button type="submit" variant="accent" disabled={loading}>
            <Save className="w-4 h-4 mr-1" />
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </div>
      </form>
    </div>
  );
}
