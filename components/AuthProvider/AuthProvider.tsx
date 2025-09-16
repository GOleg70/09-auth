'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from '../../lib/store/authStore';
import { User } from '../../types/user';
import { checkSession, getMe } from '@/lib/api/clientApi';

interface AuthProviderProps {
  initialState: {
    isAuthenticated: boolean;
    user: User | null;
  };
  children: ReactNode;
}

export const AuthProvider = ({ initialState, children }: AuthProviderProps) => {
  const initialized = useRef(false);
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  if (!initialized.current) {
    useAuthStore.setState({
      isAuthenticated: initialState.isAuthenticated,
      user: initialState.user,
    });
    initialized.current = true;
  }

  useEffect(() => {
    const initAuth = async () => {
      const forceLoggedOut = localStorage.getItem('forceLoggedOut');
      if (forceLoggedOut === 'true') {
        setHydrated(true);
        return;
      }

      try {
        const sessionOk = await checkSession();
        if (sessionOk) {
          const me = await getMe();
          setUser(me);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setHydrated(true);
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  if (!hydrated) {
    // тут можна показати Loader або null
    return null;
  }

  return <>{children}</>;
};
