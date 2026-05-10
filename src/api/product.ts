import { rawFetch } from './client';
import type { Product } from '@/types';

// Mirrors com.tini3d.module.product.dto.ProductResponse
export interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  categorySlug: string;
  categoryNameVi: string;
  categoryNameEn: string;
  price: number;
  oldPrice: number | null;
  emoji: string;
  badge: 'NEW' | 'HOT' | 'SALE' | null;
  description: string;
  longDescription: string | null;
  material: string | null;
  dimensions: string | null;
  inStock: boolean;
  rating: string;        // BigDecimal serialized as string
  reviewCount: number;
  videoUrl: string | null;
  isActive: boolean;
  tags: string[];
  createdAt: string;
}

// Mirrors com.tini3d.common.response.PageResponse<T>
export interface PageResponse<T> {
  items: T[];
  page: number;             // 1-based
  size: number;
  totalElements: number;
  totalPages: number;
}

export type ProductBadge = 'NEW' | 'HOT' | 'SALE';
export type ProductSort  = 'price_asc' | 'price_desc' | 'rating_desc' | 'created_desc';

export interface ListProductsParams {
  page?: number;
  size?: number;
  category?: string;     // category slug
  badge?: ProductBadge;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}

const buildQs = (params: Record<string, string | number | undefined | null>) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const productApi = {
  list: (p: ListProductsParams = {}) =>
    rawFetch<PageResponse<ApiProduct>>(`/api/products${buildQs(p as Record<string, string | number | undefined | null>)}`),

  search: (q: string, page = 1, size = 20) =>
    rawFetch<PageResponse<ApiProduct>>(`/api/products/search${buildQs({ q, page, size })}`),

  getBySlug: (slug: string) =>
    rawFetch<ApiProduct>(`/api/products/${encodeURIComponent(slug)}`),
};

// Adapter: ApiProduct → FE Product (preserves Cart/Checkout/Order compatibility).
// `categoryLabel` resolves against current UI language (vi | en).
export const toProduct = (api: ApiProduct, lang: 'vi' | 'en'): Product => ({
  id:             api.id,
  slug:           api.slug,
  name:           api.name,
  category:       api.categorySlug,
  categoryLabel:  lang === 'vi' ? api.categoryNameVi : api.categoryNameEn,
  price:          api.price,
  oldPrice:       api.oldPrice ?? undefined,
  rating:         Number(api.rating),
  reviewCount:    api.reviewCount,
  emoji:          api.emoji,
  badge:          api.badge ? (api.badge.toLowerCase() as 'new' | 'hot' | 'sale') : undefined,
  description:    api.description,
  longDescription: api.longDescription ?? '',
  material:       api.material ?? undefined,
  dimensions:     api.dimensions ?? undefined,
  inStock:        api.inStock,
  tags:           api.tags,
  videoUrl:       api.videoUrl ?? undefined,
});
