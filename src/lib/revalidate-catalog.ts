'use server';
import { revalidateTag, revalidatePath } from 'next/cache';

// ✅ Server-only revalidation helper - no client secrets
export function revalidateCatalog(options?: {
  productSlug?: string;
  categorySlug?: string;
  includeAdmin?: boolean;
}) {
  // Revalidate all public cache tags
  revalidateTag('products', 'max');
  revalidateTag('categories', 'max');
  revalidateTag('brands', 'max');
  revalidateTag('homepage', 'max');
  revalidateTag('search', 'max');

  // Revalidate public paths  
  revalidatePath('/');
  revalidatePath('/cari');
  revalidatePath('/kategori');

  // Include specific slugs if provided
  if (options?.productSlug) {
    revalidatePath(`/produk/${options.productSlug}`);
  }

  if (options?.categorySlug) {
    revalidatePath(`/kategori/${options.categorySlug}`);
  }

  // Include admin paths if requested
  if (options?.includeAdmin) {
    revalidatePath('/admin/produk');
    revalidatePath('/admin/kategori');
    revalidatePath('/admin/merek');
  }
}
