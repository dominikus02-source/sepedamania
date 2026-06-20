import { ProfilePage } from './profile-client';

export default function ProfilePageServer() {
  const mockUser = {
    id: 'guest',
    name: 'Pengunjung',
    email: 'guest@sepedamania.com',
    phone: '',
    image: null,
    role: 'CUSTOMER',
    createdAt: new Date().toISOString(),
    _count: { orders: 0, reviews: 0 },
    addresses: [],
  };

  return <ProfilePage user={mockUser} />;
}
