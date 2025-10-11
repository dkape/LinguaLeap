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

function AuthGuard({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) {
            return; 
        }

        const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
        const isProtectedRoute = pathname.startsWith('/student') || pathname.startsWith('/teacher');

        if (!user && isProtectedRoute) {
            router.push('/');
        }
        
        if (user && isAuthPage) {
            router.push(`/${user.role}/dashboard`);
        }

    }, [user, loading, pathname, router]);

    if (loading && (pathname.startsWith('/student') || pathname.startsWith('/teacher'))) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>Loading...</div>
            </div>
        )
    }

    return <>{children}</>;
}


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
          // This case can happen if a user is created in Auth but the Firestore doc creation fails.
          // It can also happen for a brief moment during signup.
          // We will let the signup flow handle the doc creation. If it's a login, and the doc is missing,
          // we might need a recovery flow, but for now, we'll just not set the user.
          console.warn("User document not found in Firestore for authenticated user.");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    // The onAuthStateChanged listener will pick up the new user state.
    // We can set it here as well to make the UI update faster.
    setUser({ ...newUser, id: firebaseUser.uid } as User);
    return userCredential;
  };
  
  const logOut = async () => {
    await signOut(auth);
    // The onAuthStateChanged listener will handle setting user to null
  };

  const value = {
    user,
    loading,
    logIn,
    signUp,
    logOut,
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
