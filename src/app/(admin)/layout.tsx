import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminShell } from '@/components/admin/admin-shell';
import { AdminSessionGuard } from '@/components/admin/session-guard';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session;
  try {
    session = await auth();
  } catch {
    session = null;
  }
  if (!session?.user) redirect('/masuk');
  if (session.user.role !== 'ADMIN') redirect('/');

  return (
    <AdminShell user={session.user}>
      <AdminSessionGuard>
        {children}
      </AdminSessionGuard>
    </AdminShell>
  );
}
