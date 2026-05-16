import { rawFetch, api } from './client';

// BE enums (UPPERCASE) — mirror com.tini3d.common.enums.OrderStatus + PaymentMethod
export type ApiOrderStatus    = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type ApiPaymentMethod  = 'COD' | 'BANK' | 'EWALLET';

// Mirrors com.tini3d.module.order.dto.OrderShippingResponse
export interface ApiOrderShipping {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  address: string;
  district: string | null;
  province: string;
}

// Mirrors com.tini3d.module.order.dto.OrderItemResponse
export interface ApiOrderItem {
  id: string;
  productId: string | null;     // null nếu product đã bị xóa (snapshot pattern)
  productName: string;
  productEmoji: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Mirrors com.tini3d.module.order.dto.OrderResponse
export interface ApiOrder {
  id: string;
  orderNumber: string;
  userId: string | null;        // null cho guest checkout
  status: ApiOrderStatus;
  paymentMethod: ApiPaymentMethod;
  subtotal: number;
  shippingFee: number;
  total: number;
  note: string | null;
  shipping: ApiOrderShipping;
  items: ApiOrderItem[];
  createdAt: string;
}

// Mirrors com.tini3d.common.response.PageResponse — items field (KHÔNG content)
export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Mirrors com.tini3d.module.order.dto.CreateOrderRequest
export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[];
  shipping: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    address: string;
    district?: string;
    province: string;
  };
  paymentMethod: ApiPaymentMethod;
  note?: string;
}

const buildQs = (params: Record<string, string | number | undefined | null>) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const orderApi = {
  // POST cho phép guest checkout — BE permitAll cho POST /api/orders.
  // Khi user đã login, AuthContext giữ access token; ta dùng `api` để kèm Bearer
  // nếu có (BE sẽ tự gán userId từ JWT). Khi chưa login thì BASE_URL trả ApiError
  // 401 vì không có token — nên fallback `rawFetch` cho guest.
  create: (body: CreateOrderRequest, isAuthenticated: boolean) =>
    isAuthenticated
      ? api.post<ApiOrder>('/api/orders', body)
      : rawFetch<ApiOrder>('/api/orders', { method: 'POST', body: JSON.stringify(body) }),

  listMine: (page = 1, size = 20) =>
    api.get<PageResponse<ApiOrder>>(`/api/orders${buildQs({ page, size })}`),

  getMine: (id: string) =>
    api.get<ApiOrder>(`/api/orders/${id}`),
};

// Adapter: ApiOrder → FE Order (legacy shape). Map status + paymentMethod UPPERCASE→lowercase;
// rebuild items[] thành CartItem[] dùng snapshot product info; shipping → customer field cũ.
// Giữ legacy `Order` cho OrdersPage hiện tại; sẽ migrate dần sang dùng ApiOrder trực tiếp.
import type { Order, CartItem, Product } from '@/types';

export const toLegacyOrder = (api: ApiOrder): Order => ({
  id:        api.orderNumber,        // FE hiển thị orderNumber thay UUID — đẹp hơn
  createdAt: api.createdAt,
  subtotal:  api.subtotal,
  shipping:  api.shippingFee,
  total:     api.total,
  status:    api.status.toLowerCase() as Order['status'],
  paymentMethod: api.paymentMethod.toLowerCase() as Order['paymentMethod'],
  customer: {
    firstName: api.shipping.firstName,
    lastName:  api.shipping.lastName,
    email:     api.shipping.email ?? '',
    phone:     api.shipping.phone,
    address:   api.shipping.address,
    district:  api.shipping.district ?? '',
    province:  api.shipping.province,
    note:      api.note ?? '',
  },
  items: api.items.map((it): CartItem => ({
    product: {
      id:           it.productId ?? `deleted-${it.id}`,
      slug:         '',
      name:         it.productName,
      category:     '',
      categoryLabel: '',
      price:        it.unitPrice,
      rating:       0,
      reviewCount:  0,
      emoji:        it.productEmoji ?? '📦',
      description:  '',
      longDescription: '',
      inStock:      true,
      tags:         [],
    } as Product,
    quantity: it.quantity,
  })),
});
