export function validateOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  const allowedUrl = process.env.NEXT_PUBLIC_URL || `https://${host || 'sepedamania.com'}`;

  // If no origin/referer (e.g., server-to-server), allow
  if (!origin && !referer) return true;

  // Normalize the allowed origin
  const allowedOrigin = new URL(allowedUrl).origin;

  // Check origin matches
  if (origin && new URL(origin).origin === allowedOrigin) return true;

  // Check referer matches
  if (referer && new URL(referer).origin === allowedOrigin) return true;

  // Also allow if origin matches the Host header (works for any domain including Vercel preview URLs)
  if (host && origin && new URL(origin).hostname === host.split(':')[0]) return true;
  if (host && referer && new URL(referer).hostname === host.split(':')[0]) return true;

  return false;
}
