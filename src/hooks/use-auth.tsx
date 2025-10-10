'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
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
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
            // This can happen if the user record is created in Auth but the Firestore doc creation fails.
            // Or if a user is deleted from Firestore but not Auth.
            console.warn("User exists in Auth but not in Firestore. Logging out.");
            await signOut(auth);
            setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isProtectedRoute = pathname.startsWith('/student') || pathname.startsWith('/teacher');

    if (user) {
      // If we have a user and they are on an auth page, redirect to their dashboard
      if (isAuthPage) {
        router.push(`/${user.role}/dashboard`);
      }
    } else {
      // If we don't have a user and they are on a protected route, redirect to home
      if (isProtectedRoute) {
        router.push('/');
      }
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
    // The onAuthStateChanged listener will handle setting the user state
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

  // While loading, we can show a blank screen or a loader to prevent flashes of incorrect content
  if (loading) {
      return null;
  }

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
