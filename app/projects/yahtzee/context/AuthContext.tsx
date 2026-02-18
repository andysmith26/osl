'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '../lib/firebase-client';
import { isFirebaseConfigured } from '../lib/firebase-config';

// Minimal user interface for local mode
export interface LocalUser {
  uid: string;
  displayName: string | null;
  email: string | null;
}

// Union type for user - can be Firebase User or LocalUser
export type AppUser = User | LocalUser;

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isConfigured: boolean;
  isLocalMode: boolean;
  signIn: () => Promise<void>;
  signInLocally: () => void;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'yahtzee-local-user';

// Generate a simple unique ID for local user
function generateLocalUserId(): string {
  return 'local-' + Math.random().toString(36).substring(2, 15);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured] = useState(() => isFirebaseConfigured());
  const [isLocalMode, setIsLocalMode] = useState(false);

  useEffect(() => {
    // Check for existing local session first (session storage for current session only)
    const localUserData = sessionStorage.getItem(LOCAL_USER_KEY);
    if (localUserData) {
      try {
        const localUser = JSON.parse(localUserData) as LocalUser;
        setUser(localUser);
        setIsLocalMode(true);
        setLoading(false);
        return;
      } catch {
        sessionStorage.removeItem(LOCAL_USER_KEY);
      }
    }

    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLocalMode(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured]);

  const signIn = async () => {
    setError(null);
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase not configured');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsLocalMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    }
  };

  const signInLocally = () => {
    const localUser: LocalUser = {
      uid: generateLocalUserId(),
      displayName: 'Guest',
      email: null,
    };
    sessionStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setUser(localUser);
    setIsLocalMode(true);
    setError(null);
  };

  const signOut = async () => {
    // Handle local mode sign out
    if (isLocalMode) {
      sessionStorage.removeItem(LOCAL_USER_KEY);
      // Also clear local games data
      sessionStorage.removeItem('yahtzee-local-games');
      setUser(null);
      setIsLocalMode(false);
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) return;

    try {
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured, isLocalMode, signIn, signInLocally, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
