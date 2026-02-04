'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from '@/lib/api';
import { getToken, removeToken, setToken } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await api.me();
      setUser(userData);
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      // Only remove token if it's actually invalid (401/403)
      if (error.message.includes('401') || error.message.includes('403')) {
        removeToken();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token: string, userData: User) => {
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const refetchUser = () => {
    fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
