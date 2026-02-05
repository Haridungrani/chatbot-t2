'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi, getAuthToken } from '@/lib/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setToken, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const user = await authApi.getCurrentUser(token);
          setUser(user);
          setToken(token);
        } catch (error) {
          console.error('Failed to verify token:', error);
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    // Only run auth check once on mount
    initAuth();
  }, []); // Remove dependencies to prevent re-running

  return <>{children}</>;
}
