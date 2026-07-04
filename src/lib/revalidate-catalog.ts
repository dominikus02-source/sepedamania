import { revalidatePath, revalidateTag } from 'next/cache';

export function revalidateCatalog(options?: {
  productSlug?: string;
  categorySlug?: string;
  includeAdmin?: boolean;
}) {
  revalidateTag('products', 'max');
  revalidateTag('categories', 'max');
  revalidateTag('brands', 'max');
  revalidateTag('homepage', 'max');
  revalidateTag('search', 'max');

  revalidatePath('/', 'layout');
  revalidatePath('/cari');
  revalidatePath('/kategori');
  revalidatePath('/produk-terlaris');

  if (options?.productSlug) {
    revalidatePath(`/produk/${options.productSlug}`);
  }

  if (options?.categorySlug) {
    revalidatePath(`/kategori/${options.categorySlug}`);
  }

  if (options?.includeAdmin) {
    revalidatePath('/admin/produk');
    revalidatePath('/admin/kategori');
  }
}
