import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1 menit stale time
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

export function useProducts(query?: string) {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  return useSWR(`/api/products${params}`, fetcher, {
    ...swrOptions,
    refreshInterval: 300000, // 5 menit cache
  });
}

export function useProduct(id: string) {
  return useSWR(id ? `/api/products/${id}` : null, fetcher, swrOptions);
}

export function useOrder(id: string) {
  return useSWR(id ? `/api/orders/${id}` : null, fetcher, swrOptions);
}

export function useShippingCost(courier: string, weight: number) {
  return useSWR(
    courier ? ['/api/shipping/cost', courier, weight] : null,
    ([url, c, w]: [string, string, number]) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier: c, weight: w }),
      }).then((r) => r.json()),
    { ...swrOptions, dedupingInterval: 120000 },
  );
}
