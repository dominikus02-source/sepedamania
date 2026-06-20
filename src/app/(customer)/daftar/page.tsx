import type { Metadata } from 'next';
import { RegisterForm } from './register-form';

export const metadata: Metadata = {
  title: 'Daftar Akun',
  description: 'Buat akun SEPEDAMANIA dan nikmati kemudahan berbelanja sepeda online.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
