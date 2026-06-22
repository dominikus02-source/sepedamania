import { mockProducts } from './mock-data';

export interface AdminOrder {
  id: string;
  userId: string;
  user: { name: string; email: string; phone: string };
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  courier: string;
  courierService: string;
  trackingNumber: string | null;
  shippingAddress: {
    recipient: string;
    phone: string;
    detail: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: { id: string; name: string; qty: number; price: number; image: string }[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminVoucher {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'NOMINAL';
  value: number;
  minPurchase: number;
  maxDiscount: number | null;
  quota: number;
  used: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  qty: number;
  stockBefore: number;
  stockAfter: number;
  note: string;
  createdAt: string;
}

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStock: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
  label: string;
  color: string;
}

const now = new Date();

function daysAgo(d: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

export const mockCustomers = [
  { id: 'u1', name: 'Budi Santoso', email: 'budi@email.com', phone: '081234567890', createdAt: new Date('2025-01-15').toISOString(), orders: 5, totalSpent: 25000000 },
  { id: 'u2', name: 'Ani Wijaya', email: 'ani@email.com', phone: '081234567891', createdAt: new Date('2025-02-20').toISOString(), orders: 3, totalSpent: 15000000 },
  { id: 'u3', name: 'Citra Dewi', email: 'citra@email.com', phone: '081234567892', createdAt: new Date('2025-03-10').toISOString(), orders: 8, totalSpent: 42000000 },
  { id: 'u4', name: 'Deni Pratama', email: 'deni@email.com', phone: '081234567893', createdAt: new Date('2025-03-25').toISOString(), orders: 2, totalSpent: 5000000 },
  { id: 'u5', name: 'Eka Putri', email: 'eka@email.com', phone: '081234567894', createdAt: new Date('2025-04-01').toISOString(), orders: 1, totalSpent: 4000000 },
  { id: 'u6', name: 'Fajar Hidayat', email: 'fajar@email.com', phone: '081234567895', createdAt: new Date('2025-04-15').toISOString(), orders: 4, totalSpent: 18000000 },
  { id: 'u7', name: 'Gita Permata', email: 'gita@email.com', phone: '081234567896', createdAt: new Date('2025-05-01').toISOString(), orders: 6, totalSpent: 32000000 },
];

export const mockOrders: AdminOrder[] = [
  { id: 'ORD-001', userId: 'u1', user: { name: 'Budi Santoso', email: 'budi@email.com', phone: '081234567890' }, status: 'PROCESSING', paymentStatus: 'PAID', paymentMethod: 'BCA Virtual Account', subtotal: 8499000, shippingCost: 25000, discount: 0, total: 8524000, courier: 'JNE', courierService: 'REG', trackingNumber: null, shippingAddress: { recipient: 'Budi Santoso', phone: '081234567890', detail: 'Jl. Merdeka No. 123, RT 05/RW 02', district: 'Menteng', city: 'Jakarta Pusat', province: 'DKI Jakarta', postalCode: '10310' }, items: [{ id: 'oi1', name: 'Polygon Xtrada 7', qty: 1, price: 7999000, image: '' }, { id: 'oi2', name: 'Helm SEPEDAMANIA Pro', qty: 1, price: 499000, image: '' }], notes: '', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
  { id: 'ORD-002', userId: 'u2', user: { name: 'Ani Wijaya', email: 'ani@email.com', phone: '081234567891' }, status: 'SHIPPED', paymentStatus: 'PAID', paymentMethod: 'QRIS', subtotal: 5499000, shippingCost: 20000, discount: 0, total: 5519000, courier: 'J&T', courierService: 'REG', trackingNumber: 'JT1234567890', shippingAddress: { recipient: 'Ani Wijaya', phone: '081234567891', detail: 'Jl. Sudirman No. 45', district: 'Setiabudi', city: 'Jakarta Selatan', province: 'DKI Jakarta', postalCode: '12910' }, items: [{ id: 'oi3', name: 'United Miami 2.0', qty: 1, price: 5499000, image: '' }], notes: 'Tolong dibungkus bubble wrap', createdAt: daysAgo(1), updatedAt: daysAgo(0) },
  { id: 'ORD-003', userId: 'u3', user: { name: 'Citra Dewi', email: 'citra@email.com', phone: '081234567892' }, status: 'PENDING_PAYMENT', paymentStatus: 'UNPAID', paymentMethod: 'GoPay', subtotal: 2999000, shippingCost: 15000, discount: 0, total: 3014000, courier: 'SiCepat', courierService: 'BEST', trackingNumber: null, shippingAddress: { recipient: 'Citra Dewi', phone: '081234567892', detail: 'Jl. Gatot Subroto No. 78', district: 'Tebet', city: 'Jakarta Selatan', province: 'DKI Jakarta', postalCode: '12810' }, items: [{ id: 'oi4', name: 'Wimcycle Next BMX', qty: 1, price: 2999000, image: '' }], notes: '', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
  { id: 'ORD-004', userId: 'u4', user: { name: 'Deni Pratama', email: 'deni@email.com', phone: '081234567893' }, status: 'DELIVERED', paymentStatus: 'PAID', paymentMethod: 'BRI Virtual Account', subtotal: 2499000, shippingCost: 0, discount: 249900, total: 2249100, courier: 'JNE', courierService: 'OKE', trackingNumber: 'JNE9876543210', shippingAddress: { recipient: 'Deni Pratama', phone: '081234567893', detail: 'Jl. Asia Afrika No. 12', district: 'Coblong', city: 'Bandung', province: 'Jawa Barat', postalCode: '40111' }, items: [{ id: 'oi5', name: 'Pacific Eclipse Fixie', qty: 1, price: 2499000, image: '' }], notes: '', createdAt: daysAgo(7), updatedAt: daysAgo(5) },
  { id: 'ORD-005', userId: 'u5', user: { name: 'Eka Putri', email: 'eka@email.com', phone: '081234567894' }, status: 'PROCESSING', paymentStatus: 'PAID', paymentMethod: 'OVO', subtotal: 3999000, shippingCost: 30000, discount: 0, total: 4029000, courier: 'Anteraja', courierService: 'REG', trackingNumber: null, shippingAddress: { recipient: 'Eka Putri', phone: '081234567894', detail: 'Jl. Diponegoro No. 56', district: 'Sukolilo', city: 'Surabaya', province: 'Jawa Timur', postalCode: '60111' }, items: [{ id: 'oi6', name: 'Element Urban 7', qty: 1, price: 3999000, image: '' }], notes: 'Warna hitam', createdAt: daysAgo(2), updatedAt: daysAgo(1) },
  { id: 'ORD-006', userId: 'u6', user: { name: 'Fajar Hidayat', email: 'fajar@email.com', phone: '081234567895' }, status: 'CANCELLED', paymentStatus: 'FAILED', paymentMethod: 'Mandiri Virtual Account', subtotal: 7999000, shippingCost: 35000, discount: 0, total: 8034000, courier: 'JNE', courierService: 'YES', trackingNumber: null, shippingAddress: { recipient: 'Fajar Hidayat', phone: '081234567895', detail: 'Jl. Malioboro No. 99', district: 'Gondokusuman', city: 'Yogyakarta', province: 'DI Yogyakarta', postalCode: '55221' }, items: [{ id: 'oi7', name: 'Polygon Xtrada 7', qty: 1, price: 7999000, image: '' }], notes: 'Pesanan dibatalkan karena stok habis', createdAt: daysAgo(3), updatedAt: daysAgo(2) },
  { id: 'ORD-007', userId: 'u7', user: { name: 'Gita Permata', email: 'gita@email.com', phone: '081234567896' }, status: 'PENDING_PAYMENT', paymentStatus: 'UNPAID', paymentMethod: 'DANA', subtotal: 1500000, shippingCost: 15000, discount: 0, total: 1515000, courier: 'SiCepat', courierService: 'BEST', trackingNumber: null, shippingAddress: { recipient: 'Gita Permata', phone: '081234567896', detail: 'Perumahan Taman Indah Blok A.5', district: 'Sukun', city: 'Malang', province: 'Jawa Timur', postalCode: '65112' }, items: [{ id: 'oi8', name: 'Helm SEPEDAMANIA Pro', qty: 3, price: 499000, image: '' }], notes: '', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
  { id: 'ORD-008', userId: 'u4', user: { name: 'Deni Pratama', email: 'deni@email.com', phone: '081234567893' }, status: 'DELIVERED', paymentStatus: 'PAID', paymentMethod: 'BCA Virtual Account', subtotal: 3899000, shippingCost: 0, discount: 389900, total: 3509100, courier: 'JNE', courierService: 'REG', trackingNumber: 'JNE5556667770', shippingAddress: { recipient: 'Deni Pratama', phone: '081234567893', detail: 'Jl. Asia Afrika No. 12', district: 'Coblong', city: 'Bandung', province: 'Jawa Barat', postalCode: '40111' }, items: [{ id: 'oi9', name: 'Polygon Monarch 3', qty: 1, price: 3899000, image: '' }], notes: '', createdAt: daysAgo(14), updatedAt: daysAgo(12) },
];

export const mockVouchers: AdminVoucher[] = [
  { id: 'v1', code: 'SEPEDA10', type: 'PERCENTAGE', value: 10, minPurchase: 500000, maxDiscount: 100000, quota: 100, used: 45, expiresAt: new Date(now.getFullYear(), 11, 31).toISOString(), isActive: true, createdAt: daysAgo(30) },
  { id: 'v2', code: 'GRATIS20', type: 'NOMINAL', value: 20000, minPurchase: 0, maxDiscount: null, quota: 200, used: 120, expiresAt: null, isActive: true, createdAt: daysAgo(20) },
  { id: 'v3', code: 'MERDEKA', type: 'PERCENTAGE', value: 15, minPurchase: 1000000, maxDiscount: 200000, quota: 50, used: 50, expiresAt: daysAgo(5), isActive: true, createdAt: daysAgo(60) },
  { id: 'v4', code: 'HITANKUAT', type: 'NOMINAL', value: 50000, minPurchase: 3000000, maxDiscount: null, quota: 30, used: 8, expiresAt: new Date(now.getFullYear(), now.getMonth() + 2, 28).toISOString(), isActive: true, createdAt: daysAgo(10) },
  { id: 'v5', code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minPurchase: 0, maxDiscount: 50000, quota: 500, used: 312, expiresAt: null, isActive: false, createdAt: daysAgo(90) },
];

export const mockStockLogs: StockLog[] = [
  { id: 'sl1', productId: 'p1', productName: 'Polygon Xtrada 7', type: 'IN', qty: 10, stockBefore: 5, stockAfter: 15, note: 'Restok dari supplier', createdAt: daysAgo(7) },
  { id: 'sl2', productId: 'p2', productName: 'United Miami 2.0', type: 'OUT', qty: 1, stockBefore: 11, stockAfter: 10, note: 'Pesanan ORD-002', createdAt: daysAgo(1) },
  { id: 'sl3', productId: 'p8', productName: 'Helm SEPEDAMANIA Pro', type: 'IN', qty: 30, stockBefore: 20, stockAfter: 50, note: 'Restok dari gudang', createdAt: daysAgo(14) },
  { id: 'sl4', productId: 'p4', productName: 'Pacific Eclipse Fixie', type: 'OUT', qty: 1, stockBefore: 21, stockAfter: 20, note: 'Pesanan ORD-004', createdAt: daysAgo(7) },
  { id: 'sl5', productId: 'p5', productName: 'Element Urban 7', type: 'ADJUSTMENT', qty: 2, stockBefore: 10, stockAfter: 12, note: 'Koreksi stok fisik', createdAt: daysAgo(3) },
  { id: 'sl6', productId: 'p1', productName: 'Polygon Xtrada 7', type: 'OUT', qty: 1, stockBefore: 16, stockAfter: 15, note: 'Pesanan ORD-001', createdAt: daysAgo(1) },
  { id: 'sl7', productId: 'p3', productName: 'Wimcycle Next BMX', type: 'IN', qty: 5, stockBefore: 3, stockAfter: 8, note: 'Restok', createdAt: daysAgo(5) },
];

export const mockDashboardStats: DashboardStats = {
  todayOrders: 3,
  todayRevenue: 15000000,
  weeklyRevenue: 85000000,
  monthlyRevenue: 450000000,
  totalOrders: 340,
  totalProducts: 8,
  totalCustomers: 128,
  lowStock: mockProducts.filter((p) => p.stock <= 5).length,
};

export const mockRevenueData: RevenuePoint[] = [
  { date: '01 Jun', revenue: 12000000, orders: 8 },
  { date: '02 Jun', revenue: 8500000, orders: 5 },
  { date: '03 Jun', revenue: 15000000, orders: 12 },
  { date: '04 Jun', revenue: 7000000, orders: 4 },
  { date: '05 Jun', revenue: 22000000, orders: 15 },
  { date: '06 Jun', revenue: 11000000, orders: 7 },
  { date: '07 Jun', revenue: 18000000, orders: 10 },
  { date: '08 Jun', revenue: 9000000, orders: 6 },
  { date: '09 Jun', revenue: 25000000, orders: 18 },
  { date: '10 Jun', revenue: 14000000, orders: 9 },
  { date: '11 Jun', revenue: 6000000, orders: 3 },
  { date: '12 Jun', revenue: 20000000, orders: 14 },
  { date: '13 Jun', revenue: 16000000, orders: 11 },
  { date: '14 Jun', revenue: 10000000, orders: 7 },
];

export const mockOrderStatusCounts: OrderStatusCount[] = [
  { status: 'PENDING_PAYMENT', count: 15, label: 'Menunggu Pembayaran', color: '#F5A623' },
  { status: 'PROCESSING', count: 12, label: 'Diproses', color: '#007AFF' },
  { status: 'SHIPPED', count: 7, label: 'Dikirim', color: '#5856D6' },
  { status: 'DELIVERED', count: 280, label: 'Selesai', color: '#34C759' },
  { status: 'CANCELLED', count: 18, label: 'Dibatalkan', color: '#FF3B30' },
];

export const storeSettings = {
  id: 'store',
  storeName: 'SEPEDAMANIA',
  storeLogo: null,
  storeDescription: 'Toko sepeda online terlengkap di Indonesia',
  storeAddress: 'Jl. Sepeda No. 1, Menteng',
  storeCity: 'Jakarta Pusat',
  storeProvince: 'DKI Jakarta',
  storePostalCode: '10310',
  waNumber: '6281318986320',
  email: 'hello@sepedamania.com',
  rajaongkirKey: '',
  rajaongkirOriginCity: '39',
  xenditSecretKey: '',
  xenditWebhookToken: '',
  codEnabled: false,
  maintenanceMode: false,
  updatedAt: now.toISOString(),
};
