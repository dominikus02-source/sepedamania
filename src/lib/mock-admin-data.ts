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

export const mockCustomers: {
  id: string; name: string; email: string; phone: string; createdAt: string; orders: number; totalSpent: number;
}[] = [];

export const mockOrders: AdminOrder[] = [];

export const mockVouchers: AdminVoucher[] = [
  { id: 'v1', code: 'SEPEDA10', type: 'PERCENTAGE', value: 10, minPurchase: 500000, maxDiscount: 100000, quota: 100, used: 45, expiresAt: new Date(now.getFullYear(), 11, 31).toISOString(), isActive: true, createdAt: daysAgo(30) },
  { id: 'v2', code: 'GRATIS20', type: 'NOMINAL', value: 20000, minPurchase: 0, maxDiscount: null, quota: 200, used: 120, expiresAt: null, isActive: true, createdAt: daysAgo(20) },
  { id: 'v3', code: 'MERDEKA', type: 'PERCENTAGE', value: 15, minPurchase: 1000000, maxDiscount: 200000, quota: 50, used: 50, expiresAt: daysAgo(5), isActive: true, createdAt: daysAgo(60) },
  { id: 'v4', code: 'HITANKUAT', type: 'NOMINAL', value: 50000, minPurchase: 3000000, maxDiscount: null, quota: 30, used: 8, expiresAt: new Date(now.getFullYear(), now.getMonth() + 2, 28).toISOString(), isActive: true, createdAt: daysAgo(10) },
  { id: 'v5', code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minPurchase: 0, maxDiscount: 50000, quota: 500, used: 312, expiresAt: null, isActive: false, createdAt: daysAgo(90) },
];

export const mockStockLogs: StockLog[] = [];

export const mockDashboardStats: DashboardStats = {
  todayOrders: 0,
  todayRevenue: 0,
  weeklyRevenue: 0,
  monthlyRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  lowStock: 0,
};

export const mockRevenueData: RevenuePoint[] = [];

export const mockOrderStatusCounts: OrderStatusCount[] = [];

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
