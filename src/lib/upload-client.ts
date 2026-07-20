export type UploadKind = 'image' | 'video';

export const MAX_IMAGES = 10;
export const MAX_VIDEOS = 2;

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

// Product photos are downscaled to this before upload. Large enough for the
// zoomed product view, small enough that a phone photo never hits a size limit.
const MAX_IMAGE_DIMENSION = 1600;
const IMAGE_QUALITY = 0.85;

export interface UploadProgress {
  /** 0–100 across the whole batch. */
  percent: number;
  done: number;
  total: number;
}

/**
 * Downscales and re-encodes an image in the browser.
 *
 * An 8MB phone photo becomes a few hundred KB, so uploads stay fast and the
 * storefront is not serving originals. Falls back to the untouched file if the
 * browser cannot decode it.
 */
async function compressImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    // WebP keeps transparency and is smaller; JPEG covers older browsers.
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', IMAGE_QUALITY),
    );
    const finalBlob =
      blob ??
      (await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', IMAGE_QUALITY),
      ));

    if (!finalBlob) return file;
    // Keep the original if re-encoding somehow made it bigger.
    if (finalBlob.size >= file.size && /^image\/(jpeg|png|webp)$/.test(file.type)) return file;

    const ext = finalBlob.type === 'image/webp' ? 'webp' : 'jpg';
    const base = file.name.replace(/\.[^.]+$/, '') || 'gambar';
    return new File([finalBlob], `${base}.${ext}`, { type: finalBlob.type });
  } catch {
    return file;
  }
}

/** PUTs one file to a signed URL, reporting progress (fetch cannot do upload progress). */
function putToSignedUrl(
  signedUrl: string,
  file: File,
  onProgress?: (fraction: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Unggahan ditolak penyimpanan (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error('Koneksi terputus saat mengunggah'));
    xhr.onabort = () => reject(new Error('Unggahan dibatalkan'));
    xhr.send(file);
  });
}

function validate(files: File[], kind: UploadKind): void {
  for (const file of files) {
    if (kind === 'video') {
      if (!VIDEO_MIME_TYPES.includes(file.type)) {
        throw new Error(`${file.name}: format video harus MP4, WebM, atau MOV`);
      }
      if (file.size > MAX_VIDEO_BYTES) {
        throw new Error(`${file.name}: ukuran melebihi 50MB`);
      }
    } else if (!file.type.startsWith('image/')) {
      throw new Error(`${file.name}: bukan file gambar`);
    }
  }
}

/**
 * Uploads files straight to storage and returns their public URLs.
 *
 * The API only issues signed URLs — bytes go browser → storage directly, so
 * neither the 4.5MB serverless body limit nor function timeouts apply.
 */
export async function uploadFiles(
  rawFiles: File[],
  kind: UploadKind,
  folder = 'produk',
  onProgress?: (p: UploadProgress) => void,
): Promise<string[]> {
  if (rawFiles.length === 0) return [];

  validate(rawFiles, kind);

  const files = kind === 'image' ? await Promise.all(rawFiles.map(compressImage)) : rawFiles;

  const signRes = await fetch('/api/upload/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kind,
      folder,
      files: files.map((f) => ({ contentType: f.type, size: f.size })),
    }),
  });

  let signJson: { uploads?: { signedUrl: string; publicUrl: string }[]; error?: string } = {};
  try {
    signJson = await signRes.json();
  } catch {
    throw new Error('Server tidak merespons dengan benar');
  }
  if (!signRes.ok) throw new Error(signJson.error || 'Gagal menyiapkan unggahan');

  const uploads = signJson.uploads;
  if (!uploads || uploads.length !== files.length) {
    throw new Error('Server tidak mengembalikan URL unggahan yang lengkap');
  }

  const fractions = new Array(files.length).fill(0);
  const report = () => {
    if (!onProgress) return;
    const sum = fractions.reduce((a, b) => a + b, 0);
    onProgress({
      percent: Math.round((sum / files.length) * 100),
      done: fractions.filter((f) => f === 1).length,
      total: files.length,
    });
  };
  report();

  await Promise.all(
    files.map((file, i) =>
      putToSignedUrl(uploads[i].signedUrl, file, (f) => {
        fractions[i] = f;
        report();
      }).then(() => {
        fractions[i] = 1;
        report();
      }),
    ),
  );

  return uploads.map((u) => u.publicUrl);
}
