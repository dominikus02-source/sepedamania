import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import {
  createSignedUpload,
  isStorageConfigured,
  allowedMimeTypes,
  maxBytes,
  MAX_IMAGES,
  MAX_VIDEOS,
} from '@/lib/supabase-storage';

const requestSchema = z.object({
  kind: z.enum(['image', 'video']),
  folder: z.string().max(80).optional(),
  files: z
    .array(
      z.object({
        contentType: z.string().min(1),
        size: z.number().int().positive(),
      }),
    )
    .min(1),
});

/**
 * Hands the browser signed URLs so it can upload directly to storage.
 *
 * Only metadata crosses this function — never file bytes — so the 4.5MB
 * serverless body limit never applies to an upload.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    console.error('POST /api/upload/sign: SUPABASE_URL / SUPABASE_SECRET_KEY missing');
    return NextResponse.json(
      { error: 'Penyimpanan file belum dikonfigurasi di server.' },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Permintaan tidak valid', details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { kind, files, folder = 'produk' } = parsed.data;

  const limit = kind === 'video' ? MAX_VIDEOS : MAX_IMAGES;
  if (files.length > limit) {
    return NextResponse.json(
      { error: `Maksimal ${limit} ${kind === 'video' ? 'video' : 'gambar'} sekali unggah.` },
      { status: 400 },
    );
  }

  // Reject the whole batch on the first bad file so the client never has to
  // reconcile a partial result.
  const allowed = allowedMimeTypes(kind);
  const sizeCap = maxBytes(kind);
  for (const file of files) {
    if (!allowed.includes(file.contentType)) {
      return NextResponse.json(
        { error: `Tipe file tidak didukung: ${file.contentType}` },
        { status: 400 },
      );
    }
    if (file.size > sizeCap) {
      return NextResponse.json(
        { error: `Ukuran file melebihi ${Math.round(sizeCap / 1024 / 1024)}MB.` },
        { status: 400 },
      );
    }
  }

  try {
    const uploads = await Promise.all(
      files.map((file) => createSignedUpload(kind, file.contentType, folder)),
    );
    return NextResponse.json({
      uploads: uploads.map((u) => ({
        signedUrl: u.signedUrl,
        token: u.token,
        path: u.path,
        publicUrl: u.publicUrl,
      })),
    });
  } catch (err) {
    console.error('POST /api/upload/sign error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Gagal menyiapkan unggahan' },
      { status: 500 },
    );
  }
}
