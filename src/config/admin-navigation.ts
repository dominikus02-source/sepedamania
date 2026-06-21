import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Percent,
  Image as ImageIcon,
  Settings,
  PackageSearch,
  Tags,
  Truck,
  BarChart3,
  MessageCircle,
} from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produk', label: 'Produk', icon: Package },
  { href: '/admin/pesanan', label: 'Pesanan', icon: ShoppingCart },
  { href: '/admin/pelanggan', label: 'Pelanggan', icon: Users },
  { href: '/admin/stok', label: 'Stok & Inventori', icon: PackageSearch },
  { href: '/admin/kategori', label: 'Kategori & Merek', icon: Tags },
  { href: '/admin/voucher', label: 'Diskon & Voucher', icon: Percent },
  { href: '/admin/pengiriman', label: 'Pengiriman', icon: Truck },
  { href: '/admin/pembayaran', label: 'Pembayaran', icon: CreditCard },
  { href: '/admin/banner', label: 'Banner', icon: ImageIcon },
  { href: '/admin/laporan', label: 'Laporan', icon: BarChart3 },
  { href: '/admin/chat', label: 'Chat Pelanggan', icon: MessageCircle },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
];

export const ADMIN_ROUTES_PRELOAD = ADMIN_NAV_ITEMS.map((item) => item.href);

export function isAdminRouteActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}
