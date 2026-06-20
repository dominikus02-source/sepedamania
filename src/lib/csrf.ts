export function validateOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const allowedUrl = process.env.NEXT_PUBLIC_URL || 'https://sepedamania.store';

  // If no origin/referer (e.g., server-to-server), allow
  if (!origin && !referer) return true;

  // Check origin matches
  if (origin && new URL(origin).origin === new URL(allowedUrl).origin) return true;

  // Check referer matches
  if (referer && new URL(referer).origin === new URL(allowedUrl).origin) return true;

  return false;
}
