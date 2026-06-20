import type { ImageProps } from 'next/image';

// Tiny 1x1 orange pixel as blur placeholder (data URI)
export const BLUR_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Cloudinary transformation builder
export function cloudinaryUrl(
  imagePath: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  },
): string {
  if (!imagePath || imagePath.startsWith('data:') || imagePath.startsWith('/')) {
    return imagePath;
  }

  const { width, height, quality = 'auto', format = 'auto', crop = 'fill' } = options ?? {};
  const transformations = ['f_' + format, 'q_' + quality];
  if (width) transformations.push('w_' + width);
  if (height) transformations.push('h_' + height);
  transformations.push('c_' + crop);

  // Check if it's already a Cloudinary URL
  if (imagePath.includes('res.cloudinary.com')) {
    return imagePath.replace(
      /\/upload\/(?:v\d+\/)?/,
      `/upload/${transformations.join(',')}/`,
    );
  }

  return imagePath;
}

// Generate responsive sizes attribute for Next.js Image
export function responsiveSizes(mobile?: string, tablet?: string, desktop?: string): string {
  const parts: string[] = [];
  if (mobile) parts.push(`(max-width: 640px) ${mobile}`);
  if (tablet) parts.push(`(max-width: 1024px) ${tablet}`);
  parts.push(desktop ?? '100vw');
  return parts.join(', ');
}

// Default image props presets
export const productImageProps: Partial<ImageProps> = {
  placeholder: 'blur',
  blurDataURL: BLUR_PLACEHOLDER,
  loading: 'lazy',
  sizes: responsiveSizes('50vw', '33vw', '25vw'),
};

export const heroImageProps: Partial<ImageProps> = {
  priority: true,
  placeholder: 'blur',
  blurDataURL: BLUR_PLACEHOLDER,
  sizes: '100vw',
};
