'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Phone } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Gagal mendaftar'); setLoading(false); }
    else router.push('/masuk');
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen flex flex-col justify-center p-6">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] font-display">SEPEDAMANIA</h1>
          <p className="text-sm text-[#8E8E93] mt-1">Buat akun baru</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" /><Input id="name" value={form.name} onChange={update('name')} placeholder="Nama kamu" className="pl-9" required /></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" /><Input id="email" type="email" value={form.email} onChange={update('email')} placeholder="nama@email.com" className="pl-9" required /></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">No. HP</Label>
            <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" /><Input id="phone" type="tel" value={form.phone} onChange={update('phone')} placeholder="08123456789" className="pl-9" /></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" /><Input id="password" type="password" value={form.password} onChange={update('password')} placeholder="Minimal 6 karakter" className="pl-9" required /></div>
          </div>
          {error && <p className="text-sm text-[#FF3B30]">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Memproses...' : 'Daftar'}</Button>
        </form>
        <p className="text-center text-sm text-[#8E8E93] mt-6">Sudah punya akun? <Link href="/masuk" className="text-[#F5A623] font-medium">Masuk</Link></p>
      </div>
    </div>
  );
}
