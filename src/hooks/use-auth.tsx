'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
            // This can happen briefly during signup before the user doc is created.
            // We'll let the signUp function handle setting the user.
            // If it's not a signup, then the user might be in an inconsistent state.
            // For now, we'll just wait for the user doc to be created.
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
      createdAt: serverTimestamp() as Timestamp,
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    setUser({ ...newUser, uid: firebaseUser.uid } as User);
    return userCredential;
  };
  
  const logOut = async () => {
    await signOut(auth);
    setUser(null);
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
