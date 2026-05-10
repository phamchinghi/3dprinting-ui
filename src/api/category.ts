import { rawFetch } from './client';

// Mirrors com.tini3d.module.category.dto.CategoryResponse
export interface Category {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  iconEmoji: string | null;
  descriptionVi: string | null;
  descriptionEn: string | null;
  sortOrder: number;
  createdAt: string;
}

// Public — không cần auth (BE: GET /api/categories permitAll)
export const categoryApi = {
  list:      () => rawFetch<Category[]>('/api/categories'),
  getBySlug: (slug: string) => rawFetch<Category>(`/api/categories/${encodeURIComponent(slug)}`),
};
