import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  phone: z.string().min(10, 'No HP minimal 10 digit').optional(),
});

export const addressSchema = z.object({
  label: z.string().min(1, 'Label alamat wajib diisi'),
  recipient: z.string().min(1, 'Nama penerima wajib diisi'),
  phone: z.string().min(10, 'No HP minimal 10 digit'),
  province: z.string().min(1, 'Provinsi wajib dipilih'),
  city: z.string().min(1, 'Kota wajib dipilih'),
  district: z.string().min(1, 'Kecamatan wajib diisi'),
  postalCode: z.string().min(5, 'Kode pos minimal 5 digit'),
  detail: z.string().min(1, 'Alamat lengkap wajib diisi'),
  isDefault: z.boolean().default(false),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Ulasan minimal 10 karakter').optional(),
});

export const voucherSchema = z.object({
  code: z.string().min(1, 'Kode voucher wajib diisi'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  slug: z.string().optional(),
  sku: z.string().min(1, 'SKU wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  brandId: z.string().min(1, 'Merek wajib dipilih'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  salePrice: z.number().min(0).nullable().optional(),
  weight: z.number().min(0, 'Berat tidak boleh negatif'),
  stock: z.number().int().min(0),
  images: z.array(z.string()).optional().default([]),
  specs: z.record(z.string(), z.string()).optional().default({}),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  variants: z.array(z.object({
    name: z.string().min(1),
    value: z.string().min(1),
    stock: z.number().int().min(0),
    price: z.number().min(0).nullable().optional(),
    sku: z.string().optional(),
  })).optional().default([]),
});

export const createProductSchema = productSchema;
