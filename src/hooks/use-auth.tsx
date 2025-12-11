'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios, { AxiosResponse } from 'axios';
import type { User, UserRole } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logIn: (email: string, pass: string) => Promise<AxiosResponse<unknown>>;
  signUp: (email: string, pass: string, name: string, role: UserRole) => Promise<AxiosResponse<unknown>>;
  logOut:

  () => void;
  forgotPassword: (email: string) => Promise<AxiosResponse<unknown>>;
  resetPassword: (token: string, newPassword: string) => Promise<AxiosResponse<unknown>>;
}

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    // Extract locale from pathname
    const pathSegments = pathname.split('/');
    const locale = pathSegments[1] || 'de'; // Default to German

    const isAuthPage = pathname.includes('/login') || pathname.includes('/signup');
    const isProtectedRoute = pathname.includes('/dashboard') || pathname.includes('/teacher/students') || pathname.includes('/admin');

    if (!user && isProtectedRoute && !isAuthPage) {
      router.push(`/${locale}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return null; // Return null to prevent rendering children while loading
  }

  return <>{children}</>;
}


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get('auth/me');
          const userData = response.data.user;
          setUser(userData);

          if (userData.preferredLanguage) {
            document.cookie = `locale=${userData.preferredLanguage}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          logOut(); // Clear invalid token
        }
      }
      setLoading(false);
    };

    fetchUser();

    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          logOut();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const logIn = async (email: string, pass: string) => {
    const response = await axios.post('auth/login', { email, password: pass });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return response;
  };

  const signUp = async (email: string, pass: string, name: string, role: UserRole) => {
    const response = await axios.post('auth/signup', { email, password: pass, name, role });
    // New registration flow doesn't return token immediately - user needs to verify email first
    return response;
  };

  const logOut = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    // Redirect to home to avoid being stuck on a protected page
    if (typeof window !== 'undefined') {
      const locale = window.location.pathname.split('/')[1] || 'de';
      if (window.location.pathname.includes('dashboard')) {
        window.location.href = `/${locale}`;
      }
    }
  };

  const forgotPassword = async (email: string) => {
    return await axios.post('user/forgot-password', { email });
  };

  const resetPassword = async (token: string, newPassword: string) => {
    return await axios.post('user/reset-password', { token, newPassword });
  };

  const value = {
    user,
    loading,
    logIn,
    signUp,
    logOut,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      <AuthGuard>{children}</AuthGuard>
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