'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, UserRole } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass:string, name: string, role: UserRole) => Promise<any>;
  logOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      let currentUser: User | null = null;
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          currentUser = { uid: firebaseUser.uid, ...userDoc.data() } as User;
        } else {
            console.warn("User exists in Auth but not in Firestore. Logging out.");
            await signOut(auth);
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isProtectedRoute = pathname.startsWith('/student') || pathname.startsWith('/teacher');

    if (!user && isProtectedRoute) {
      router.push('/');
    }
    
    if (user && isAuthPage) {
      router.push(`/${user.role}/dashboard`);
    }

  }, [user, loading, pathname, router]);

  const logIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string, name: string, role: UserRole) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;

    const newUser: Omit<User, 'id'> = {
      uid: firebaseUser.uid,
      name,
      email: firebaseUser.email!,
      role,
      avatarUrl: `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
      points: 0,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    return userCredential;
  };
  
  const logOut = () => {
    return signOut(auth).then(() => {
      router.push('/');
    });
  };

  const value = {
    user,
    loading,
    logIn,
    signUp,
    logOut,
  };
  
  // Render children immediately and let the useEffect handle redirects.
  // Returning null here can cause a flash of a blank screen.
  return (
    <AuthContext.Provider value={value}>
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
