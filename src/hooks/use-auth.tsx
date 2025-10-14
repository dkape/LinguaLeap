'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import type { User, UserRole } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass:string, name: string, role: UserRole) => Promise<any>;
  logOut: () => void;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthGuard({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) {
            return; // Do nothing while loading
        }

        const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
        const isProtectedRoute = pathname.startsWith('/student') || pathname.startsWith('/teacher');

        if (!user && isProtectedRoute) {
            router.push('/');
        } else if (user && isAuthPage) {
            router.push(`/${user.role}/dashboard`);
        }
    }, [user, loading, pathname, router]);

    if (loading && (pathname.startsWith('/student') || pathname.startsWith('/teacher'))) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>Loading...</div>
            </div>
        );
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
          const response = await axios.get('http://localhost:3001/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error(error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } else {
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const logIn = async (email: string, pass: string) => {
    const response = await axios.post('http://localhost:3001/api/auth/login', { email, password: pass });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return response;
  };

  const signUp = async (email: string, pass: string, name: string, role: UserRole) => {
    const response = await axios.post('http://localhost:3001/api/auth/signup', { email, password: pass, name, role });
    // After signup, you might want to automatically log in the user
    // For now, we'll just return the response
    return response;
  };
  
  const logOut = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    return await axios.post('http://localhost:3001/api/user/forgot-password', { email });
  };

  const resetPassword = async (token: string, newPassword: string) => {
    return await axios.post('http://localhost:3001/api/user/reset-password', { token, newPassword });
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