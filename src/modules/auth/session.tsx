import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { notificationsApi } from '@/modules/notifications/api';
import { onUnauthorized } from '@/shared/lib/api';
import { pushTokenStorage, tokenStorage, userStorage } from '@/shared/lib/storage';

import { authApi } from './api';
import type { User } from './types';

type Session = {
  /** `null` until persisted credentials have been read. */
  ready: boolean;
  signedIn: boolean;
  user: User | null;
  /** True when the account may use the app (Active + email verified). */
  active: boolean;
  isMother: boolean;
  isBabysitter: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  /** Replace the cached user (after a profile update or role switch). */
  setUser: (user: User) => void;
  /** Re-fetch `/users/me`; silently keeps the cache on failure. */
  refresh: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

/** Persisted JWT session. Restores from secure storage on launch and drops on any 401. */
export function SessionProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [user, setUserState] = useState<User | null>(null);

  const setUser = useCallback((next: User) => {
    setUserState(next);
    userStorage.set(next).catch(() => {});
  }, []);

  const signOut = useCallback(async () => {
    // Stop push for this device while the token is still valid; failures must not block sign-out.
    const pushToken = await pushTokenStorage.get();
    if (pushToken) await notificationsApi.removeDevice(pushToken).catch(() => {});

    setUserState(null);
    queryClient.clear();
    await Promise.all([tokenStorage.clear(), userStorage.clear(), pushTokenStorage.clear()]);
  }, [queryClient]);

  const signIn = useCallback(
    async (token: string, next: User) => {
      await tokenStorage.set(token);
      setUser(next);
    },
    [setUser]
  );

  const refresh = useCallback(async () => {
    try {
      const { user: fresh } = await authApi.me();
      if (fresh) setUser(fresh);
    } catch {
      // Keep the cached profile; a 401 is handled by the unauthorized listener.
    }
  }, [setUser]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [token, cached] = await Promise.all([tokenStorage.get(), userStorage.get<User>()]);
      if (cancelled) return;
      if (token && cached) {
        setUserState(cached);
        setReady(true);
        refresh();
      } else {
        await Promise.all([tokenStorage.clear(), userStorage.clear()]);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => onUnauthorized(() => signOut()), [signOut]);

  const value = useMemo<Session>(
    () => ({
      ready,
      signedIn: user !== null,
      user,
      active: user?.status === 'Active' && user.emailVerified !== false,
      isMother: user?.role === 'Mother',
      isBabysitter: user?.role === 'Babysitter',
      signIn,
      signOut,
      setUser,
      refresh,
    }),
    [ready, user, signIn, signOut, setUser, refresh]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used within SessionProvider');
  return session;
}
