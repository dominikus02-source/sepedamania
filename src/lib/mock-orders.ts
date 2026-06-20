const orders = new Map<string, any>();

export function getMockOrder(orderId: string) {
  return orders.get(orderId) || null;
}

export function setMockOrder(order: any) {
  orders.set(order.id, order);
}

export function updateMockOrderPayment(orderId: string, paymentStatus: string, orderStatus: string) {
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
