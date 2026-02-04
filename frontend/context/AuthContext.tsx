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
    console.log('Fetching user with token:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      console.log('No token found, setting loading to false');
      setLoading(false);
      return;
    }

    try {
      console.log('Calling api.me()...');
      const userData = await api.me();
      console.log('User data received:', userData);
      setUser(userData);
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      
      // Check if it's an authentication error
      if (error.message.includes('401') || error.message.includes('403')) {
        console.log('Authentication error, removing token');
        removeToken();
        setUser(null);
      } else {
        console.log('Non-auth error, keeping user state');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthContext useEffect triggered');
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token: string, userData: User) => {
    console.log('Login called with:', { token: token ? 'Token provided' : 'No token', user: userData });
    setToken(token);
    setUser(userData);
    setLoading(false);
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
