import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun SEPEDAMANIA untuk melanjutkan belanja.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#64748B]">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}
