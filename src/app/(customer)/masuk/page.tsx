'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Globe } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) { setError('Email atau password salah'); setLoading(false); }
    else router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] font-display">SEPEDAMANIA</h1>
          <p className="text-sm text-[#8E8E93] mt-1">Masuk ke akun kamu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className="pl-9" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9" required />
            </div>
          </div>
          {error && <p className="text-sm text-[#FF3B30]">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Memproses...' : 'Masuk'}</Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E5EA]" /></div>
          <div className="relative flex justify-center"><span className="bg-[#F2F2F7] px-2 text-xs text-[#8E8E93]">atau</span></div>
        </div>

        <Button variant="outline" className="w-full" onClick={() => signIn('google', { callbackUrl: '/' })}>
          <Globe className="w-4 h-4 mr-2" /> Lanjutkan dengan Google
        </Button>

        <p className="text-center text-sm text-[#8E8E93] mt-6">
          Belum punya akun? <Link href="/daftar" className="text-[#F5A623] font-medium">Daftar</Link>
        </p>
      </div>
    </div>
  );
}
