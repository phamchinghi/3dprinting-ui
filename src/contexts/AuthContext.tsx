import {
  createContext, useContext, useState, useEffect,
  useMemo, useCallback, type ReactNode,
} from 'react';
import type { User, AuthProviderType } from '@/types';
import {
  authApi, setAccessToken, setRefreshToken,
  getRefreshToken, clearTokens,
} from '@/api/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginWithSocial: (provider: 'google' | 'facebook') => Promise<void>;
  loginWithPhone: (phone: string, name?: string) => Promise<void>;
  loginWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const USER_KEY = 'tini-user';

const mockUsers: Record<AuthProviderType, (extra?: string) => User> = {
  google: () => ({
    id: 'google-' + Date.now(), name: 'Người dùng Google',
    email: 'user@gmail.com', provider: 'google',
    avatar: 'https://ui-avatars.com/api/?name=G&background=4285F4&color=fff&size=64',
  }),
  facebook: () => ({
    id: 'fb-' + Date.now(), name: 'Người dùng Facebook',
    email: 'user@facebook.com', provider: 'facebook',
    avatar: 'https://ui-avatars.com/api/?name=F&background=1877F2&color=fff&size=64',
  }),
  phone: (phone) => ({
    id: 'phone-' + Date.now(), name: 'Người dùng', phone, provider: 'phone',
  }),
  email: (email) => ({
    id: 'email-' + Date.now(),
    name: email?.split('@')[0] ?? 'Người dùng',
    email, provider: 'email',
  }),
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try { const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) as User : null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const persist = useCallback((u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else   localStorage.removeItem(USER_KEY);
  }, []);

  useEffect(() => {
    const rt = getRefreshToken();
    if (!rt || user) return;

    let cancelled = false;
    setLoading(true);
    authApi.refresh(rt)
      .then((data) => {
        if (cancelled) return;
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        persist({
          id: data.userId,
          name: data.name,
          email: data.email ?? undefined,
          provider: 'email',
          role: data.role,
        });
      })
      .catch(() => {
        if (!cancelled) clearTokens();
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithSocial = useCallback(async (provider: 'google' | 'facebook') => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    persist(mockUsers[provider]());
    setLoading(false);
  }, [persist]);

  const loginWithPhone = useCallback(async (phone: string, name?: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const u = mockUsers.phone(phone);
    if (name) u.name = name;
    persist(u);
    setLoading(false);
  }, [persist]);

  const loginWithEmail = useCallback(async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const data = name
        ? await authApi.register({ name, email, password })
        : await authApi.login({ email, password });

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      persist({
        id: data.userId,
        name: data.name,
        email: data.email ?? email,
        provider: 'email',
        role: data.role,
      });
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const logout = useCallback(() => {
    const rt = getRefreshToken();
    if (rt) authApi.logout(rt).catch(() => { /* best effort */ });
    clearTokens();
    persist(null);
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, loginWithSocial, loginWithPhone, loginWithEmail, logout }),
    [user, loading, loginWithSocial, loginWithPhone, loginWithEmail, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
