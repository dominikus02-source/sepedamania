// Server-side HTML escaping
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Sanitize a string for safe display (strip HTML tags)
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

// Recursively trim whitespace from all string values in an object
export function trimStrings<T>(obj: T): T {
  if (typeof obj === 'string') return obj.trim() as T;
  if (Array.isArray(obj)) return obj.map(trimStrings) as T;
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      result[key] = trimStrings(val);
    }
    return result as T;
  }
  return obj;
}
