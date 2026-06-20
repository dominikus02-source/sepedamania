import { NextResponse } from 'next/server';

const mockProvinces = [
  { province_id: '1', province: 'DKI Jakarta' },
  { province_id: '2', province: 'Jawa Barat' },
  { province_id: '3', province: 'Jawa Tengah' },
  { province_id: '4', province: 'Jawa Timur' },
  { province_id: '5', province: 'Banten' },
  { province_id: '6', province: 'Bali' },
  { province_id: '7', province: 'Yogyakarta' },
  { province_id: '8', province: 'Sumatera Utara' },
  { province_id: '9', province: 'Sulawesi Selatan' },
  { province_id: '10', province: 'Kalimantan Timur' },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (type === 'provinces') {
    return NextResponse.json({ provinces: mockProvinces });
  }

  return NextResponse.json({ provinces: mockProvinces });
}
