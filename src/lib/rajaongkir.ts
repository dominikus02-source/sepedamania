const RAJAONGKIR_BASE = 'https://api.rajaongkir.com/starter';

interface ShippingCostParams {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}

export async function getShippingCost(params: ShippingCostParams) {
  const apiKey = process.env.RAJAONGKIR_API_KEY!;

  const res = await fetch(`${RAJAONGKIR_BASE}/cost`, {
    method: 'POST',
    headers: {
      key: apiKey,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      weight: String(params.weight),
      courier: params.courier,
    }),
  });

  if (!res.ok) throw new Error(`RajaOngkir API error: ${res.statusText}`);
  return res.json();
}

export async function getProvinces() {
  const apiKey = process.env.RAJAONGKIR_API_KEY!;

  const res = await fetch(`${RAJAONGKIR_BASE}/province`, {
    headers: { key: apiKey },
  });

  if (!res.ok) throw new Error('Failed to fetch provinces');
  return res.json();
}

export async function getCities(provinceId?: string) {
  const apiKey = process.env.RAJAONGKIR_API_KEY!;

  const params = provinceId ? `?province=${provinceId}` : '';
  const res = await fetch(`${RAJAONGKIR_BASE}/city${params}`, {
    headers: { key: apiKey },
  });

  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}

export type Courier = 'jne' | 'jnt' | 'sicepat' | 'anteraja' | 'pos';
export const COURIERS: Courier[] = ['jne', 'jnt', 'sicepat', 'anteraja', 'pos'];
export const COURIER_NAMES: Record<Courier, string> = {
  jne: 'JNE',
  jnt: 'J&T',
  sicepat: 'SiCepat',
  anteraja: 'Anteraja',
  pos: 'Pos Indonesia',
};
