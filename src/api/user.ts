import { api } from './client';

// Mirrors com.tini3d.module.user.dto.UserResponse exactly
export type UserProvider  = 'GOOGLE' | 'FACEBOOK' | 'PHONE' | 'EMAIL';
export type AccountStatus = 'ACTIVE' | 'INACTIVE';

export interface UserProfile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  provider: UserProvider;
  status: AccountStatus;
  orderCount: number;
  createdAt: string;          // ISO timestamp
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userApi = {
  getMe:          ()                            => api.get<UserProfile>('/api/users/me'),
  updateMe:       (body: UpdateUserRequest)     => api.put<UserProfile>('/api/users/me', body),
  changePassword: (body: ChangePasswordRequest) => api.put<null>('/api/users/me/password', body),
};
