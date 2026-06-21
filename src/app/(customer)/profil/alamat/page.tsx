'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, ChevronLeft } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  detail: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Rumah',
      recipient: 'Budi Santoso',
      phone: '081234567890',
      detail: 'Jl. Merdeka No. 123, RT 05/RW 02',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10310',
      isDefault: true,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: 'Rumah',
    recipient: '',
    phone: '',
    detail: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const resetForm = () => {
    setForm({ label: 'Rumah', recipient: '', phone: '', detail: '', city: '', province: '', postalCode: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
    } else {
      setAddresses((prev) => [...prev, { ...form, id: String(Date.now()), isDefault: prev.length === 0 }]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (addr: Address) => {
    setForm({ label: addr.label, recipient: addr.recipient, phone: addr.phone, detail: addr.detail, city: addr.city, province: addr.province, postalCode: addr.postalCode });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/profil" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-[#0F172A]">Daftar Alamat</h1>
      </div>

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-[#0F172A]">{addr.label}</span>
                {addr.isDefault && (
                  <span className="text-[10px] text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full font-medium">Utama</span>
                )}
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(addr)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]">
                  <Pencil className="w-3.5 h-3.5 text-[#64748B]" />
                </button>
                <button onClick={() => handleDelete(addr.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEF2F2]">
                  <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                </button>
              </div>
            </div>
            <p className="text-sm font-medium text-[#0F172A]">{addr.recipient}</p>
            <p className="text-xs text-[#64748B]">{addr.phone}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{addr.detail}, {addr.city}, {addr.province} {addr.postalCode}</p>
            {!addr.isDefault && (
              <button onClick={() => setDefault(addr.id)} className="text-xs text-[#2563EB] hover:text-[#1D4ED8] mt-2 font-medium">
                Jadikan Utama
              </button>
            )}
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="mt-4 bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-3">
          <h2 className="font-semibold text-[#0F172A]">{editingId ? 'Edit Alamat' : 'Alamat Baru'}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Label</Label>
              <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#2563EB]">
                <option>Rumah</option>
                <option>Kantor</option>
                <option>Lainnya</option>
              </select>
            </div>
            <div>
              <Label>Kode Pos</Label>
              <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="12345" maxLength={5} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nama Penerima</Label>
              <Input value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} placeholder="Nama lengkap" />
            </div>
            <div>
              <Label>No. HP</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08123456789" />
            </div>
          </div>
          <div>
            <Label>Alamat Lengkap</Label>
            <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} className="w-full min-h-[60px] rounded-lg border border-[#E2E8F0] p-3 text-sm resize-none outline-none focus:ring-1 focus:ring-[#2563EB]" placeholder="Jalan, nomor, RT/RW, gedung, dll." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Kota</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Jakarta Pusat" />
            </div>
            <div>
              <Label>Provinsi</Label>
              <Input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} placeholder="DKI Jakarta" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={resetForm}>Batal</Button>
            <Button className="flex-1 bg-[#0F172A] hover:bg-[#1E293B] text-white" onClick={handleSave}>
              {editingId ? 'Simpan' : 'Tambah Alamat'}
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#E2E8F0] text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:border-[#0F172A] transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Alamat Baru
        </button>
      )}
    </div>
  );
}
