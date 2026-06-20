import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/masuk');
  if (session.user.role !== 'ADMIN') redirect('/');

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <AdminHeader user={session.user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}
