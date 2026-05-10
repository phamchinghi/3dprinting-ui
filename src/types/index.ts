export type AuthProviderType = 'google' | 'facebook' | 'phone' | 'email';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  provider: AuthProviderType;
  role?: string;
}

export type ProductCategory = 'model' | 'accessory' | 'filament' | 'service';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  emoji: string;
  badge?: 'new' | 'sale' | 'hot';
  description: string;
  longDescription: string;
  material?: string;
  dimensions?: string;
  inStock: boolean;
  tags: string[];
  videoUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  emoji: string;
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  note: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';
export type PaymentMethod = 'cod' | 'bank' | 'ewallet';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
}
