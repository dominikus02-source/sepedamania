'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mengirim email reset');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF]">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 mx-auto max-w-[200px]">
            <img src="/images/logo-sepedamania.webp" alt="SEPEDAMANIA" className="w-full h-auto" onError={(e) => { e.currentTarget.src = '/logo.png'; }} />
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A]">Lupa Password</h1>
          <p className="text-sm text-[#64748B] mt-1">
            {success
              ? 'Link reset password telah dikirim ke email Anda'
              : 'Masukkan email untuk menerima link reset password'}
          </p>
        </div>

        {!success && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="pl-9"
                  required
                  autoComplete="email"
                />
              </div>
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
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </Button>
          </form>
        )}

        {success && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4 text-center">
            <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto" />
            <h3 className="text-lg font-semibold text-[#0F172A]">Email Terkirim</h3>
            <p className="text-sm text-[#64748B]">Cek inbox email Anda untuk link reset password</p>
            <Button variant="outline" onClick={() => router.push('/masuk')}>
              Kembali ke Login
            </Button>
          </div>
        )}

        <p className="text-center text-sm text-[#64748B] mt-6">
          Ingat password?{' '}
          <Link href="/masuk" className="text-[#2563EB] font-medium hover:text-[#1D4ED8]">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
