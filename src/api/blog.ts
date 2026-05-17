import { rawFetch } from './client';

// Mirrors com.tini3d.module.blog.dto.BlogCategoryResponse
export interface ApiBlogCategory {
  id: string;
  slug: string;
  name: string;
}

// Mirrors com.tini3d.module.blog.dto.BlogPostResponse
export interface ApiBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  emoji: string | null;
  categoryId: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  authorId: string | null;
  authorName: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Mirrors com.tini3d.common.response.PageResponse — items field
export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const buildQs = (params: Record<string, string | number | undefined | null>) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const blogApi = {
  list: (page = 1, size = 20) =>
    rawFetch<PageResponse<ApiBlogPost>>(`/api/blog${buildQs({ page, size })}`),

  getBySlug: (slug: string) =>
    rawFetch<ApiBlogPost>(`/api/blog/${encodeURIComponent(slug)}`),

  listCategories: () =>
    rawFetch<ApiBlogCategory[]>('/api/blog/categories'),
};
