/**
 * Binderbyte Shipping API integration
 * Docs: https://docs.binderbyte.com/api/cek-ongkir & https://docs.binderbyte.com/api/cek-resi
 */

const API_KEY = process.env.BINDERBYTE_API_KEY || '';
const BASE_URL = 'https://api.binderbyte.com/v1';

// ── Types ──

export interface ShippingCost {
  courier: string;
  courierName: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface TrackingSummary {
  awb: string;
  courier: string;
  service: string;
  status: string;
  date: string;
  desc: string;
  amount: string;
  weight: string;
}

export interface TrackingHistory {
  date: string;
  desc: string;
  location: string;
}

export interface TrackingResult {
  summary: TrackingSummary;
  detail: {
    origin: string;
    destination: string;
    shipper: string;
    receiver: string;
  };
  history: TrackingHistory[];
}

// ── Available couriers ──

export const AVAILABLE_COURIERS = [
  { code: 'jne', name: 'JNE Express', icon: '📦' },
  { code: 'jnt', name: 'J&T Express', icon: '📦' },
  { code: 'sicepat', name: 'SiCepat', icon: '📦' },
  { code: 'anteraja', name: 'AnterAja', icon: '📦' },
  { code: 'pos', name: 'POS Indonesia', icon: '📮' },
  { code: 'tiki', name: 'TIKI', icon: '📦' },
  { code: 'lion', name: 'Lion Parcel', icon: '🦁' },
  { code: 'ninja', name: 'Ninja Xpress', icon: '🥷' },
  { code: 'wahana', name: 'Wahana', icon: '📦' },
];

// ── Helpers ──

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getStoredRates(): ShippingCost[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem('spm-shipping-rates');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function storeRates(rates: ShippingCost[]) {
  if (!isBrowser()) return;
  localStorage.setItem('spm-shipping-rates', JSON.stringify(rates));
}

// ── Core API ──

/**
 * Get shipping rates from Binderbyte
 * @param origin - City name (e.g., "tangerang", "jakarta")
 * @param destination - City name
 * @param weightGrams - Weight in grams
 * @param couriers - Array of courier codes (e.g., ["jne", "jnt"])
 */
export async function getShippingRates(
  origin: string,
  destination: string,
  weightGrams: number,
  couriers: string[] = ['jne', 'jnt', 'sicepat'],
): Promise<ShippingCost[]> {
  const weightKg = Math.max(1, Math.ceil(weightGrams / 1000));
  const courierParam = couriers.join(',');

  if (!API_KEY) {
    console.warn('BINDERBYTE_API_KEY not set — returning empty rates');
    return [];
  }

  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      origin,
      destination,
      weight: String(weightKg),
      courier: courierParam,
    });

    const res = await fetch(`${BASE_URL}/cost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!res.ok) return [];

    const json = await res.json();
    if (json.code !== '200' || !json.data?.results) return [];

    const rates: ShippingCost[] = [];
    for (const result of json.data.results) {
      for (const cost of result.costs || []) {
        rates.push({
          courier: result.code,
          courierName: result.name,
          service: cost.service,
          description: cost.description,
          cost: cost.cost,
          etd: cost.etd || '',
        });
      }
    }

    storeRates(rates);
    return rates;
  } catch (err) {
    console.error('Binderbyte API error:', err);
    return [];
  }
}

/**
 * Track a shipment via Binderbyte
 */
export async function trackShipment(
  courier: string,
  awb: string,
): Promise<TrackingResult | null> {
  if (!API_KEY) {
    console.warn('BINDERBYTE_API_KEY not set');
    return null;
  }

  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      courier,
      awb,
    });

    const res = await fetch(`${BASE_URL}/track?${params.toString()}`);

    if (!res.ok) return null;

    const json = await res.json();
    if (json.status !== 200 || !json.data) return null;

    return json.data as TrackingResult;
  } catch (err) {
    console.error('Binderbyte track error:', err);
    return null;
  }
}

/**
 * Calculate volumetric weight for large items (e.g., bicycles)
 * Formula: L × W × H (cm) / 6000 = weight in kg
 */
export function calculateVolumetricWeight(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
): number {
  return Math.ceil((lengthCm * widthCm * heightCm) / 6000);
}

/**
 * Get the higher of actual weight vs volumetric weight
 * Used for large items like bicycles where dimensions matter
 */
export function getBillableWeight(
  actualWeightGrams: number,
  lengthCm?: number,
  widthCm?: number,
  heightCm?: number,
): number {
  if (!lengthCm || !widthCm || !heightCm) return actualWeightGrams;
  const volumetricGrams = calculateVolumetricWeight(lengthCm, widthCm, heightCm) * 1000;
  return Math.max(actualWeightGrams, volumetricGrams);
}

/**
 * Map Binderbyte status to our order status
 */
export function mapShippingStatus(bbStatus: string): string {
  const statusMap: Record<string, string> = {
    'PICKED UP': 'PROCESSING',
    'IN TRANSIT': 'SHIPPED',
    'DELIVERED': 'DELIVERED',
    'FAILED DELIVERY': 'DELIVERY_FAILED',
    'RETURNED': 'RETURNED',
    'CANCELLED': 'CANCELLED',
    'PENDING': 'PENDING',
    'ON HOLD': 'ON_HOLD',
  };
  return statusMap[bbStatus?.toUpperCase()] || 'UNKNOWN';
}
