export type ReturnStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'WAITING_FOR_ITEM'
  | 'ITEM_RECEIVED'
  | 'REFUND_PROCESSING'
  | 'REPLACEMENT_SHIPPING'
  | 'COMPLETED'
  | 'CANCELLED';

export type ReturnReason =
  | 'DAMAGED'
  | 'WRONG_ITEM'
  | 'NOT_AS_DESCRIBED'
  | 'SIZE_OR_VARIANT_ISSUE'
  | 'MISSING_PART'
  | 'OTHER';

export type PreferredResolution =
  | 'REFUND'
  | 'REPLACEMENT'
  | 'STORE_CREDIT'
  | 'ADMIN_HELP';

export interface MockReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  userId: string;
  items: Array<{
    productId: string;
    variantId?: string;
    name: string;
    price: number;
    qty: number;
    image?: string;
  }>;
  reason: ReturnReason;
  detail: string;
  preferredResolution: PreferredResolution;
  evidenceImages: string[];
  status: ReturnStatus;
  confirmationAccepted: boolean;
  adminNote?: string;
  rejectionReason?: string;
  refundAmount?: number;
  trackingNumber?: string;
  returnShippingProvider?: string;
  reviewedAt?: string;
  approvedAt?: string;
  completedAt?: string;
  receivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------
const returns = new Map<string, MockReturnRequest>();

// ---------------------------------------------------------------------------
// Labels & variants for UI
// ---------------------------------------------------------------------------

export const RETURN_STATUS_LABELS: Record<ReturnStatus, string> = {
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

export const RETURN_STATUS_VARIANTS: Record<ReturnStatus, string> = {
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

export const RETURN_REASON_LABELS: Record<ReturnReason, string> = {
  DAMAGED: 'Produk Rusak',
  WRONG_ITEM: 'Salah Barang',
  NOT_AS_DESCRIBED: 'Tidak Sesuai Deskripsi',
  SIZE_OR_VARIANT_ISSUE: 'Masalah Ukuran/Varian',
  MISSING_PART: 'Kekurangan Bagian',
  OTHER: 'Lainnya',
};

export const RESOLUTION_LABELS: Record<PreferredResolution, string> = {
  REFUND: 'Refund Dana',
  REPLACEMENT: 'Tukar Barang',
  STORE_CREDIT: 'Store Credit',
  ADMIN_HELP: 'Bantuan Admin',
};

// ---------------------------------------------------------------------------
// Valid transitions
// ---------------------------------------------------------------------------
export const VALID_RETURN_TRANSITIONS: Record<ReturnStatus, ReturnStatus[]> = {
  REQUESTED: ['UNDER_REVIEW', 'CANCELLED'],
  UNDER_REVIEW: ['APPROVED', 'REJECTED', 'CANCELLED'],
  APPROVED: ['WAITING_FOR_ITEM'],
  WAITING_FOR_ITEM: ['ITEM_RECEIVED'],
  ITEM_RECEIVED: ['REFUND_PROCESSING', 'REPLACEMENT_SHIPPING'],
  REFUND_PROCESSING: ['COMPLETED'],
  REPLACEMENT_SHIPPING: ['COMPLETED'],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function isValidReturnTransition(from: ReturnStatus, to: ReturnStatus): boolean {
  return VALID_RETURN_TRANSITIONS[from]?.includes(to) ?? false;
}

export function generateReturnNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RMA-${ts}-${rand}`;
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export function getMockReturn(id: string): MockReturnRequest | null {
  return returns.get(id) ?? null;
}

export function getMockReturnByNumber(number: string): MockReturnRequest | null {
  for (const ret of returns.values()) {
    if (ret.returnNumber === number) return ret;
  }
  return null;
}

export function getMockReturnsByUser(userId: string): MockReturnRequest[] {
  return Array.from(returns.values()).filter((r) => r.userId === userId);
}

export function getMockReturnsByOrder(orderId: string): MockReturnRequest[] {
  return Array.from(returns.values()).filter((r) => r.orderId === orderId);
}

export function getActiveMockReturnForOrder(orderId: string): MockReturnRequest | null {
  const terminal: ReturnStatus[] = ['COMPLETED', 'CANCELLED', 'REJECTED'];
  for (const ret of returns.values()) {
    if (ret.orderId === orderId && !terminal.includes(ret.status)) {
      return ret;
    }
  }
  return null;
}

export function setMockReturn(ret: MockReturnRequest): void {
  returns.set(ret.id, ret);
}

export function updateMockReturn(
  id: string,
  updates: Partial<MockReturnRequest>,
): MockReturnRequest | null {
  const existing = returns.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  returns.set(id, updated);
  return updated;
}

export function getAllMockReturns(): MockReturnRequest[] {
  return Array.from(returns.values());
}
