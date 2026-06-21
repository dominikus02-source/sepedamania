'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, [field]: value });

    if (field === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mendaftar');
        setLoading(false);
      } else {
        // Success - redirect to login with success message
        router.push('/masuk?registered=true');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-[#E2E8F0]';
    if (passwordStrength === 1) return 'bg-[#EF4444]';
    if (passwordStrength === 2) return 'bg-[#F59E0B]';
    if (passwordStrength === 3) return 'bg-[#2563EB]';
    return 'bg-[#16A34A]';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Lemah';
    if (passwordStrength === 2) return 'Sedang';
    if (passwordStrength === 3) return 'Kuat';
    return 'Sangat kuat';
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF]">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0F172A] flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A]">Buat Akun Sepedamania</h1>
          <p className="text-sm text-[#64748B] mt-1">Daftar untuk mulai belanja sepeda</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input
                id="name"
                value={form.name}
                onChange={update('name')}
                placeholder="Nama kamu"
                className="pl-9"
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="nama@email.com"
                className="pl-9"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">No. HP <span className="text-[#94A3B8] font-normal">(opsional)</span></Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                placeholder="08123456789"
                className="pl-9"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="Minimal 8 karakter"
                className="pl-9 pr-10"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {form.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength >= level ? getStrengthColor() : 'bg-[#E2E8F0]'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#64748B]">
                  Kekuatan password: <span className="font-medium">{getStrengthText()}</span>
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#991B1B]">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </Button>

          {/* Terms */}
          <p className="text-xs text-[#64748B] text-center">
            Dengan mendaftar, kamu setuju dengan{' '}
            <Link href="/syarat-ketentuan" className="text-[#2563EB] hover:text-[#1D4ED8]">
              Syarat & Ketentuan
            </Link>{' '}
            dan{' '}
            <Link href="/kebijakan-privasi" className="text-[#2563EB] hover:text-[#1D4ED8]">
              Kebijakan Privasi
            </Link>
            .
          </p>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-[#64748B] mt-6">
          Sudah punya akun?{' '}
          <Link href="/masuk" className="text-[#2563EB] font-medium hover:text-[#1D4ED8]">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
