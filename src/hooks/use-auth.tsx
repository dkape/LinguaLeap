'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
            // Handle case where user exists in auth but not firestore
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
    setUser({ id: firebaseUser.uid, ...newUser } as User);
    return userCredential;
  };
  
  const logOut = () => {
    return signOut(auth);
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
      {!loading && children}
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
