import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun SEPEDAMANIA untuk melanjutkan belanja.',
};

export default function LoginPage() {
  return <LoginForm />;
}
