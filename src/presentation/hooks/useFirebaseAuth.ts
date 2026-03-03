import { useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, firebaseConfigError } from '../../infrastructure/firebase/config';

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase() ?? '';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsAuthLoading(false);
      return;
    }
    const currentAuth = auth;

    const unsubscribe = onAuthStateChanged(currentAuth, (nextUser) => {
      if (!adminEmail) {
        setUser(null);
        setAuthError('Thiếu VITE_ADMIN_EMAIL trong .env.');
        setIsAuthLoading(false);
        return;
      }

      if (nextUser && nextUser.email?.toLowerCase() !== adminEmail) {
        setUser(null);
        setAuthError('Tài khoản này không có quyền truy cập admin.');
        void firebaseSignOut(currentAuth);
        setIsAuthLoading(false);
        return;
      }

      setAuthError(null);
      setUser(nextUser);
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmailPassword = useCallback(async (email: string, password: string) => {
    if (!auth) {
      setAuthError(firebaseConfigError ?? 'Firebase chưa được khởi tạo.');
      return;
    }

    try {
      setAuthError(null);
      if (!adminEmail) {
        setAuthError('Thiếu VITE_ADMIN_EMAIL trong .env.');
        return;
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.email?.toLowerCase() !== adminEmail) {
        setAuthError('Tài khoản này không có quyền truy cập admin.');
        await firebaseSignOut(auth);
        throw new Error('Tài khoản này không có quyền truy cập admin.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError('Đăng nhập thất bại.');
      }
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) {
      setAuthError(firebaseConfigError ?? 'Firebase chưa được khởi tạo.');
      return;
    }

    try {
      setAuthError(null);
      await firebaseSignOut(auth);
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError('Đăng xuất thất bại.');
      }
    }
  }, []);

  return useMemo(
    () => ({
      user,
      isAuthLoading,
      authError,
      isAuthenticated: Boolean(user),
      isAdminEmailConfigured: Boolean(adminEmail),
      signInWithEmailPassword,
      signOut
    }),
    [user, isAuthLoading, authError, signInWithEmailPassword, signOut]
  );
}
