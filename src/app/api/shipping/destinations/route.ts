import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { validateOrigin } from '@/lib/csrf';
import { searchDestinations, isConfigured } from '@/lib/rajaongkir';

export async function GET(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const search = new URL(req.url).searchParams.get('search')?.trim() ?? '';
  // Short queries match thousands of subdistricts and waste API quota.
  if (search.length < 3) {
    return NextResponse.json({ destinations: [] });
  }

  if (!isConfigured()) {
    console.error('Shipping lookup unavailable: RAJAONGKIR_API_KEY / RAJAONGKIR_ORIGIN_ID missing');
    return NextResponse.json(
      { error: 'Layanan alamat belum dikonfigurasi. Hubungi admin toko.' },
      { status: 503 },
    );
  }

  try {
    const destinations = await searchDestinations(search);
    return NextResponse.json(
      { destinations },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  } catch (err) {
    console.error('GET /api/shipping/destinations error:', err);
    return NextResponse.json({ error: 'Gagal mencari alamat' }, { status: 502 });
  }
}
