// ─── Labels ────────────────────────────────────────────────────────────────

export const RETURN_STATUS_LABELS: Record<string, string> = {
  REQUESTED: 'Diajukan',
  UNDER_REVIEW: 'Ditinjau',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
  WAITING_FOR_ITEM: 'Menunggu Barang',
  ITEM_RECEIVED: 'Barang Diterima',
  REFUND_PROCESSING: 'Proses Refund',
  REPLACEMENT_SHIPPING: 'Pengiriman Pengganti',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

export const RETURN_STATUS_VARIANTS: Record<string, string> = {
  REQUESTED: 'blue',
  UNDER_REVIEW: 'amber',
  APPROVED: 'green',
  REJECTED: 'red',
  WAITING_FOR_ITEM: 'purple',
  ITEM_RECEIVED: 'sky',
  REFUND_PROCESSING: 'orange',
  REPLACEMENT_SHIPPING: 'indigo',
  COMPLETED: 'emerald',
  CANCELLED: 'slate',
};

export const RETURN_REASON_LABELS: Record<string, string> = {
  DAMAGED: 'Produk Rusak',
  WRONG_ITEM: 'Salah Barang',
  NOT_AS_DESCRIBED: 'Tidak Sesuai Deskripsi',
  SIZE_OR_VARIANT_ISSUE: 'Masalah Ukuran/Varian',
  MISSING_PART: 'Kekurangan Bagian',
  OTHER: 'Lainnya',
};

export const RESOLUTION_LABELS: Record<string, string> = {
  REFUND: 'Refund Dana',
  REPLACEMENT: 'Tukar Barang',
  STORE_CREDIT: 'Store Credit',
  ADMIN_HELP: 'Bantuan Admin',
};

// ─── Status transitions ────────────────────────────────────────────────────

export const VALID_RETURN_TRANSITIONS: Record<string, string[]> = {
  REQUESTED: ['UNDER_REVIEW', 'CANCELLED'],
  UNDER_REVIEW: ['APPROVED', 'REJECTED', 'CANCELLED'],
  APPROVED: ['WAITING_FOR_ITEM', 'REPLACEMENT_SHIPPING', 'REFUND_PROCESSING'],
  WAITING_FOR_ITEM: ['ITEM_RECEIVED'],
  ITEM_RECEIVED: ['REFUND_PROCESSING', 'REPLACEMENT_SHIPPING', 'COMPLETED'],
  REFUND_PROCESSING: ['COMPLETED'],
  REPLACEMENT_SHIPPING: ['COMPLETED'],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
};

export function isValidReturnTransition(from: string, to: string): boolean {
  return VALID_RETURN_TRANSITIONS[from]?.includes(to) ?? false;
}

export function generateReturnNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RMA-${ts}-${rand}`;
}

export const ACTIVE_RETURN_STATUSES = ['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'WAITING_FOR_ITEM', 'ITEM_RECEIVED', 'REFUND_PROCESSING', 'REPLACEMENT_SHIPPING'];

export const ELIGIBLE_ORDER_STATUSES = ['DELIVERED', 'COMPLETED'];

export const RETURN_WINDOW_DAYS = 7;
