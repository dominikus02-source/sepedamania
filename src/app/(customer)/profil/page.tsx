import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ProfilePage } from './profile-client';

export const dynamic = 'force-dynamic';

export default async function ProfilePageServer() {
  const session = await auth();

  if (!session?.user) {
    redirect('/masuk');
  }

  let userData: {
    id: string;
    name: string;
    email: string;
    phone: string;
    image: string | null;
    role: string;
    createdAt: string;
    _count: { orders: number; reviews: number };
    addresses: unknown[];
  } = {
    id: session.user.id ?? '',
    name: session.user.name ?? 'Pengunjung',
    email: session.user.email ?? '',
    phone: '',
    image: session.user.image ?? null,
    role: session.user.role ?? 'CUSTOMER',
    createdAt: new Date().toISOString(),
    _count: { orders: 0, reviews: 0 },
    addresses: [],
  };

  // Try to fetch real data from database
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email ?? '' },
      include: {
        _count: { select: { orders: true, reviews: true } },
        addresses: true,
      },
    });

    if (dbUser) {
      userData = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone ?? '',
        image: dbUser.image ?? null,
        role: dbUser.role,
        createdAt: dbUser.createdAt.toISOString(),
        _count: { orders: dbUser._count.orders, reviews: dbUser._count.reviews },
        addresses: dbUser.addresses,
      };
    }
  } catch {
    // Database unavailable — use session data
    userData = {
      ...userData,
      name: session.user.name ?? 'Pengunjung',
      email: session.user.email ?? '',
      role: session.user.role ?? 'CUSTOMER',
    };
  }

  return <ProfilePage user={userData} />;
}
