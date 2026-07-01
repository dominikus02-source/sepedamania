import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'dev-secret-change-in-prod';

function isSafePath(path: string): boolean {
  if (!path || typeof path !== 'string') return false;
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (path.includes('..')) return false;
  if (path.length > 200) return false;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // ✅ SECURITY: Only allow internal calls or specific trusted sources
    const headerSecret = request.headers.get('x-revalidate-secret');
    const querySecret = new URL(request.url).searchParams.get('secret');
    
    // Allow for both dev (query param) and production (header)
    const providedSecret = headerSecret || querySecret;
    
    if (process.env.NODE_ENV === 'production' && !providedSecret) {
      console.error('[api/revalidate] Rejected: No secret provided in production');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (providedSecret && providedSecret !== REVALIDATE_SECRET) {
      console.error('[api/revalidate] Rejected: Invalid secret provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { tags = [], paths = [], includeAdmin = false } = body;

    const results: Record<string, string | string[]> = {};
    const revalidatedPaths: string[] = [];

    // ✅ SAFE: Only allow specific tags and paths
    const safeTags = ['products', 'categories', 'brands', 'homepage', 'search'];
    for (const tag of tags) {
      if (safeTags.includes(tag)) {
        revalidateTag(tag, 'max');
        results[tag] = 'revalidated';
      }
    }

    const safePaths = ['/cari', '/kategori', '/'];
    for (const path of paths) {
      if (isSafePath(path) && safePaths.includes(path)) {
        revalidatePath(path);
        revalidatedPaths.push(path);
      }
    }

    if (revalidatedPaths.length > 0) {
      results.paths = revalidatedPaths;
    }

    if (includeAdmin) {
      revalidatePath('/admin/produk');
      revalidatePath('/admin/kategori');
      revalidatePath('/admin/merek');
      results.admin = 'revalidated';
    }

    return NextResponse.json({
      success: true,
      message: 'Revalidation completed',
      results,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('[api/revalidate] Error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
