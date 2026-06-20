interface MockOrder {
  id: string;
  userId: string | null;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: Record<string, string>;
  courier: string;
  courierService: string;
  paymentMethod: string;
  voucherCode: string | null;
  status: string;
  paymentStatus: string;
  paymentInstructions: Record<string, unknown>;
  items: { productId: string; variantId?: string; name: string; price: number; qty: number; image: string }[];
  createdAt: string;
  trackingNumber: string | null;
}

const orders = new Map<string, MockOrder>();

export function getMockOrder(orderId: string): MockOrder | null {
  return orders.get(orderId) || null;
}

export function setMockOrder(order: MockOrder) {
  orders.set(order.id, order);
}

export function updateMockOrderPayment(orderId: string, paymentStatus: string, orderStatus: string): MockOrder | null {
  const order = orders.get(orderId);
  if (order) {
    order.paymentStatus = paymentStatus;
    order.status = orderStatus;
    return order;
  }
  return null;
}

export function generateOrderId() {
  return `SEP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
