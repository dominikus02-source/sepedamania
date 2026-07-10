export function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  return [];
}

export function safeLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}
