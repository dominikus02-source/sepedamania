// RajaOngkir (Komerce) v1. The legacy api.rajaongkir.com/starter endpoints are
// dead — this API is subdistrict-based, so a destination is a numeric id from
// the search endpoint rather than a city name.

const BASE_URL = 'https://rajaongkir.komerce.id/api/v1';

/** Store pickup point. Every quote is measured from here. */
export const ORIGIN_ID = process.env.RAJAONGKIR_ORIGIN_ID || '';

export interface Destination {
  id: number;
  label: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  subdistrictName: string;
  zipCode: string;
}

export interface ShippingRate {
  courier: string;
  courierName: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

/** Couriers quoted by default. */
export const DEFAULT_COURIERS = ['jne', 'jnt', 'sicepat', 'anteraja', 'pos'];

export const COURIER_NAMES: Record<string, string> = {
  jne: 'JNE',
  jnt: 'J&T',
  sicepat: 'SiCepat',
  anteraja: 'Anteraja',
  pos: 'Pos Indonesia',
};

function apiKey(): string {
  const key = process.env.RAJAONGKIR_API_KEY;
  if (!key) throw new Error('RAJAONGKIR_API_KEY belum dikonfigurasi');
  return key;
}

export function isConfigured(): boolean {
  return Boolean(process.env.RAJAONGKIR_API_KEY && ORIGIN_ID);
}

interface RawDestination {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

/**
 * Looks up delivery destinations by free text (village, district or postcode).
 * The chosen entry's id is what the cost endpoint needs.
 */
export async function searchDestinations(query: string, limit = 10): Promise<Destination[]> {
  const url = `${BASE_URL}/destination/domestic-destination?search=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url, {
    headers: { key: apiKey() },
    // Destination data is effectively static; cache to stay inside rate limits.
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) throw new Error(`Pencarian alamat gagal (${res.status})`);

  const json = await res.json();
  const rows: RawDestination[] = json?.data ?? [];
  return rows.map((d) => ({
    id: d.id,
    label: d.label,
    provinceName: d.province_name,
    cityName: d.city_name,
    districtName: d.district_name,
    subdistrictName: d.subdistrict_name,
    zipCode: d.zip_code,
  }));
}

interface RawRate {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

/** Turns the API's loose etd ("3 day", "", "1-2") into something displayable. */
function formatEtd(etd: string): string {
  const trimmed = (etd || '').trim();
  if (!trimmed) return '-';
  const days = trimmed.replace(/\s*days?/i, '').trim();
  return /^\d+(-\d+)?$/.test(days) ? `${days} hari` : trimmed;
}

/**
 * Real distance- and weight-based rates for a destination.
 * `weightGrams` is in grams; the API bills per kilogram, rounded up.
 */
export async function calculateCost(
  destinationId: string | number,
  weightGrams: number,
  couriers: string[] = DEFAULT_COURIERS,
): Promise<ShippingRate[]> {
  if (!ORIGIN_ID) throw new Error('RAJAONGKIR_ORIGIN_ID belum dikonfigurasi');

  const body = new URLSearchParams({
    origin: ORIGIN_ID,
    destination: String(destinationId),
    weight: String(Math.max(1, Math.round(weightGrams))),
    courier: couriers.join(':'),
  });

  const res = await fetch(`${BASE_URL}/calculate/domestic-cost`, {
    method: 'POST',
    headers: {
      key: apiKey(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) throw new Error(`Perhitungan ongkir gagal (${res.status})`);

  const json = await res.json();
  const rows: RawRate[] = json?.data ?? [];

  return rows
    // Some services quote 0 when the route is unserved; those are not real options.
    .filter((r) => r.cost > 0)
    .map((r) => ({
      courier: r.code,
      courierName: r.name,
      service: r.service,
      description: r.description || r.service,
      cost: r.cost,
      etd: formatEtd(r.etd),
    }))
    .sort((a, b) => a.cost - b.cost);
}
