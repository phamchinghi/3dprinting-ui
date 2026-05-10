import type { Order, OrderCustomer, PaymentMethod, CartItem } from '@/types';

const STORAGE_KEY = 'tini-orders';

export const getOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
};

export const saveOrder = (params: {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
}): Order => {
  const order: Order = {
    ...params,
    id: 'ORD-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  const orders = [order, ...getOrders()];
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch { /* ignore */ }
  return order;
};
