import { createClient } from '@supabase/supabase-js';

export const IMAGE_BUCKET = 'product-images';
export const VIDEO_BUCKET = 'product-videos';

export const MAX_IMAGES = 10;
export const MAX_VIDEOS = 2;

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'] as const;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

export type UploadKind = 'image' | 'video';

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

export function bucketFor(kind: UploadKind): string {
  return kind === 'video' ? VIDEO_BUCKET : IMAGE_BUCKET;
}

export function allowedMimeTypes(kind: UploadKind): readonly string[] {
  return kind === 'video' ? VIDEO_MIME_TYPES : IMAGE_MIME_TYPES;
}

export function maxBytes(kind: UploadKind): number {
  return kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-only client. Uses the secret key, so it bypasses RLS — never import
 * this from a client component.
 */
function getStorageClient() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error(
      'Supabase storage is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.',
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isStorageConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SECRET_KEY);
}

/** Keeps a caller-supplied folder name safe to embed in a storage path. */
function safeFolder(folder: string): string {
  return folder.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 60) || 'produk';
}

/**
 * Issues a short-lived URL the browser can upload straight to.
 *
 * Bytes bypass the serverless function entirely, which is what makes 50MB
 * videos possible at all — a Vercel request body caps out at 4.5MB. Supabase
 * still enforces the bucket's size and MIME limits on the upload itself.
 */
export async function createSignedUpload(
  kind: UploadKind,
  contentType: string,
  folder: string,
): Promise<{ signedUrl: string; token: string; path: string; publicUrl: string }> {
  const ext = EXT_BY_MIME[contentType];
  if (!ext || !allowedMimeTypes(kind).includes(contentType)) {
    throw new Error(`Tipe file tidak didukung: ${contentType}`);
  }

  const bucket = bucketFor(kind);
  const path = `${safeFolder(folder)}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const supabase = getStorageClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
  if (error || !data) {
    throw new Error(`Gagal menyiapkan unggahan: ${error?.message ?? 'unknown error'}`);
  }

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
  return { signedUrl: data.signedUrl, token: data.token, path, publicUrl: pub.publicUrl };
}

export async function deleteStorageObject(kind: UploadKind, path: string): Promise<void> {
  const supabase = getStorageClient();
  const { error } = await supabase.storage.from(bucketFor(kind)).remove([path]);
  if (error) {
    throw new Error(`Hapus file gagal: ${error.message}`);
  }
}
