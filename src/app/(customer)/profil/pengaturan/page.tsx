'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Eye, EyeOff, User, Mail, Phone, Lock, Save } from 'lucide-react';

export default function AccountSettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/profil" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-[#0F172A]">Pengaturan Akun</h1>
      </div>

      <div className="space-y-4">
        {/* Profil */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-3">
          <h2 className="font-semibold text-[#0F172A] flex items-center gap-2">
            <User className="w-4 h-4" /> Profil
          </h2>
          <div>
            <Label>Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama kamu" className="pl-9" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@domain.com" className="pl-9" />
            </div>
          </div>
          <div>
            <Label>No. HP</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08123456789" className="pl-9" />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-3">
          <h2 className="font-semibold text-[#0F172A] flex items-center gap-2">
            <Lock className="w-4 h-4" /> Ubah Password
          </h2>
          <div>
            <Label>Password Saat Ini</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input type={showPassword ? 'text' : 'password'} value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} placeholder="******" className="pl-9 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label>Password Baru</Label>
            <Input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="Minimal 8 karakter" />
          </div>
          <div>
            <Label>Konfirmasi Password</Label>
            <Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Ulangi password baru" />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white">
          {saved ? (
            <><Save className="w-4 h-4 mr-2" /> Tersimpan</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>
          )}
        </Button>
      </div>
    </div>
  );
}
