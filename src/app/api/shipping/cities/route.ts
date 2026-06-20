import { NextResponse } from 'next/server';

const mockCitiesByProvince: Record<string, { city_id: string; city_name: string }[]> = {
  '1': [
    { city_id: '1', city_name: 'Jakarta Pusat' },
    { city_id: '2', city_name: 'Jakarta Utara' },
    { city_id: '3', city_name: 'Jakarta Barat' },
    { city_id: '4', city_name: 'Jakarta Selatan' },
    { city_id: '5', city_name: 'Jakarta Timur' },
  ],
  '2': [
    { city_id: '6', city_name: 'Bandung' },
    { city_id: '7', city_name: 'Bekasi' },
    { city_id: '8', city_name: 'Bogor' },
    { city_id: '9', city_name: 'Depok' },
    { city_id: '10', city_name: 'Cimahi' },
  ],
  '3': [
    { city_id: '11', city_name: 'Semarang' },
    { city_id: '12', city_name: 'Surakarta' },
    { city_id: '13', city_name: 'Purwokerto' },
    { city_id: '14', city_name: 'Magelang' },
  ],
  '4': [
    { city_id: '15', city_name: 'Surabaya' },
    { city_id: '16', city_name: 'Malang' },
    { city_id: '17', city_name: 'Sidoarjo' },
    { city_id: '18', city_name: 'Gresik' },
  ],
  '5': [
    { city_id: '19', city_name: 'Tangerang' },
    { city_id: '20', city_name: 'Tangerang Selatan' },
    { city_id: '21', city_name: 'Cilegon' },
  ],
  '6': [
    { city_id: '22', city_name: 'Denpasar' },
    { city_id: '23', city_name: 'Badung' },
  ],
  '7': [
    { city_id: '24', city_name: 'Yogyakarta' },
    { city_id: '25', city_name: 'Sleman' },
  ],
  '8': [
    { city_id: '26', city_name: 'Medan' },
    { city_id: '27', city_name: 'Binjai' },
  ],
  '9': [
    { city_id: '28', city_name: 'Makassar' },
  ],
  '10': [
    { city_id: '29', city_name: 'Samarinda' },
    { city_id: '30', city_name: 'Balikpapan' },
  ],
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const provinceId = searchParams.get('provinceId') || '';

  const cities = mockCitiesByProvince[provinceId] || [];
  return NextResponse.json({ cities });
}
