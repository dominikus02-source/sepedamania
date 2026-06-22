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

export const mockCustomers: {
  id: string; name: string; email: string; phone: string; createdAt: string; orders: number; totalSpent: number;
}[] = [];

export const mockOrders: AdminOrder[] = [];

export const mockVouchers: AdminVoucher[] = [];

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
