'use client';

import { useRef, useState } from 'react';
import { Camera, ImagePlus, Upload, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toaster';
import { uploadFiles, MAX_IMAGES, MAX_VIDEOS, type UploadProgress } from '@/lib/upload-client';

interface Props {
  images: string[];
  onImagesChange: (next: string[]) => void;
  videos: string[];
  onVideosChange: (next: string[]) => void;
  /** Groups uploaded files under one storage folder, usually the product slug. */
  folder: string;
  /** Lets the parent disable its submit button while bytes are in flight. */
  onUploadingChange?: (uploading: boolean) => void;
}

export function ProductMediaUploader({
  images,
  onImagesChange,
  videos,
  onVideosChange,
  folder,
  onUploadingChange,
}: Props) {
  const { toast } = useToast();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [busyKind, setBusyKind] = useState<'image' | 'video' | null>(null);

  const setBusy = (kind: 'image' | 'video' | null) => {
    setBusyKind(kind);
    onUploadingChange?.(kind !== null);
  };

  const handlePick = async (fileList: FileList, kind: 'image' | 'video') => {
    const current = kind === 'image' ? images : videos;
    const max = kind === 'image' ? MAX_IMAGES : MAX_VIDEOS;
    const label = kind === 'image' ? 'gambar' : 'video';

    const slots = max - current.length;
    if (slots <= 0) {
      toast(`Maksimal ${max} ${label}`, 'error');
      return;
    }

    const picked = Array.from(fileList).slice(0, slots);
    if (fileList.length > slots) {
      toast(`Hanya ${slots} slot tersisa, ${fileList.length - slots} file dilewati`, 'error');
    }

    setBusy(kind);
    setProgress({ percent: 0, done: 0, total: picked.length });
    try {
      const urls = await uploadFiles(picked, kind, folder || 'produk', setProgress);
      const next = [...current, ...urls].slice(0, max);
      if (kind === 'image') onImagesChange(next);
      else onVideosChange(next);
      toast(`${urls.length} ${label} diunggah`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : `Gagal mengunggah ${label}`, 'error');
    } finally {
      setBusy(null);
      setProgress(null);
    }
  };

  const addUrl = (kind: 'image' | 'video') => {
    const raw = (kind === 'image' ? imageUrl : videoUrl).trim();
    if (!raw) return;
    if (!/^https?:\/\//.test(raw) && !raw.startsWith('/')) {
      toast('URL harus diawali http:// atau https://', 'error');
      return;
    }
    const current = kind === 'image' ? images : videos;
    const max = kind === 'image' ? MAX_IMAGES : MAX_VIDEOS;
    if (current.length >= max) {
      toast(`Maksimal ${max} ${kind === 'image' ? 'gambar' : 'video'}`, 'error');
      return;
    }
    if (kind === 'image') {
      onImagesChange([...images, raw]);
      setImageUrl('');
    } else {
      onVideosChange([...videos, raw]);
      setVideoUrl('');
    }
  };

  const removeAt = (kind: 'image' | 'video', idx: number) => {
    if (kind === 'image') onImagesChange(images.filter((_, i) => i !== idx));
    else onVideosChange(videos.filter((_, i) => i !== idx));
  };

  const isUploaded = (url: string) => url.includes('/storage/v1/object/public/');

  return (
    <div className="space-y-6">
      {/* ── Gambar ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Gambar Produk</Label>
          <span className="text-[10px] text-[#8E8E93]">
            {busyKind === 'image' && progress
              ? `Mengunggah ${progress.done}/${progress.total} — ${progress.percent}%`
              : `${images.length}/${MAX_IMAGES}`}
          </span>
        </div>

        {busyKind === 'image' && progress && (
          <div className="h-1 w-full max-w-[420px] rounded-full bg-[#F2F2F7] overflow-hidden">
            <div
              className="h-full bg-[#F5A623] transition-all duration-200"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 max-w-[420px]">
          {Array.from({ length: MAX_IMAGES }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E5EA] bg-[#F8FAFC]"
            >
              {images[i] ? (
                <>
                  {/* Plain <img>: sources are user-supplied and may be off-domain. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images[i]} alt={`Gambar ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeAt('image', i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#FF3B30] text-white rounded-full flex items-center justify-center shadow-sm hover:bg-[#DC2626] transition-colors"
                    aria-label={`Hapus gambar ${i + 1}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : i === images.length ? (
                <div className="absolute inset-0 grid grid-rows-2">
                  <button
                    type="button"
                    onClick={() => cameraRef.current?.click()}
                    disabled={busyKind !== null}
                    className="flex flex-col items-center justify-center gap-0.5 hover:bg-[#FFFBEB] transition-colors group disabled:opacity-40"
                    title="Ambil foto"
                  >
                    <Camera className="w-4 h-4 text-[#8E8E93] group-hover:text-[#F5A623]" />
                    <span className="text-[8px] text-[#8E8E93] group-hover:text-[#F5A623] font-medium">Kamera</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    disabled={busyKind !== null}
                    className="flex flex-col items-center justify-center gap-0.5 border-t border-[#E5E5EA] hover:bg-[#FFFBEB] transition-colors group disabled:opacity-40"
                    title="Pilih dari galeri"
                  >
                    <ImagePlus className="w-4 h-4 text-[#8E8E93] group-hover:text-[#F5A623]" />
                    <span className="text-[8px] text-[#8E8E93] group-hover:text-[#F5A623] font-medium">Galeri</span>
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-[#D1D5DB]" />
                </div>
              )}
            </div>
          ))}
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              if (e.target.files?.length) handlePick(e.target.files, 'image');
              e.target.value = '';
            }}
            className="hidden"
          />
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) handlePick(e.target.files, 'image');
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>

        <p className="text-[10px] text-[#8E8E93]">
          Foto otomatis dikecilkan sebelum diunggah, jadi foto dari HP tidak perlu diedit dulu.
        </p>

        {images.length < MAX_IMAGES && (
          <div className="flex gap-2">
            <Input
              placeholder="Atau tempel URL gambar..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addUrl('image');
                }
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => addUrl('image')} disabled={!imageUrl.trim()}>
              Tambah URL
            </Button>
          </div>
        )}
      </div>

      {/* ── Video ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Video Produk (opsional)</Label>
          <span className="text-[10px] text-[#8E8E93]">
            {busyKind === 'video' && progress
              ? `Mengunggah ${progress.done}/${progress.total} — ${progress.percent}%`
              : `${videos.length}/${MAX_VIDEOS}`}
          </span>
        </div>

        {busyKind === 'video' && progress && (
          <div className="h-1 w-full max-w-[340px] rounded-full bg-[#F2F2F7] overflow-hidden">
            <div
              className="h-full bg-[#F5A623] transition-all duration-200"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 max-w-[340px]">
          {Array.from({ length: MAX_VIDEOS }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-video rounded-lg overflow-hidden border border-[#E5E5EA] bg-[#F8FAFC]"
            >
              {videos[i] ? (
                <>
                  {isUploaded(videos[i]) ? (
                    <video src={videos[i]} className="w-full h-full object-cover" controls preload="metadata" />
                  ) : (
                    // Embed links (YouTube/Vimeo) cannot play in a <video> tag.
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-black/5 px-2">
                      <Video className="w-6 h-6 text-[#8E8E93]" />
                      <span className="text-[8px] text-[#8E8E93] truncate max-w-full">Video tertaut</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt('video', i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#FF3B30] text-white rounded-full flex items-center justify-center shadow-sm hover:bg-[#DC2626] transition-colors"
                    aria-label={`Hapus video ${i + 1}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : i === videos.length ? (
                <button
                  type="button"
                  onClick={() => videoRef.current?.click()}
                  disabled={busyKind !== null}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1 hover:bg-[#FFFBEB] transition-colors group disabled:opacity-40"
                >
                  <Video className="w-6 h-6 text-[#8E8E93] group-hover:text-[#F5A623]" />
                  <span className="text-[10px] text-[#8E8E93] group-hover:text-[#F5A623] font-medium">Upload</span>
                </button>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-6 h-6 text-[#D1D5DB]" />
                </div>
              )}
            </div>
          ))}
          <input
            ref={videoRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) handlePick(e.target.files, 'video');
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>

        <p className="text-[10px] text-[#8E8E93]">MP4, WebM, atau MOV — maksimal 50MB per video.</p>

        {videos.length < MAX_VIDEOS && (
          <div className="flex gap-2">
            <Input
              placeholder="Atau tempel URL video (YouTube/Vimeo)..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addUrl('video');
                }
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => addUrl('video')} disabled={!videoUrl.trim()}>
              Tambah URL
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
