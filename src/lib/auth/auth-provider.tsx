'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { Profile, UserRole } from '@/lib/supabase/types';

// ── Types ────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_CACHE_KEY = 'distaura_auth_cache_v1';

// Always start with the server-safe state so SSR and the initial client
// render produce identical HTML (no hydration mismatch).
const SERVER_SAFE_STATE: AuthState = {
  user: null, session: null, profile: null, role: null, loading: true,
};

// ── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  // Start with the server-safe state on every render (SSR + first client paint).
  const [state, setState] = useState<AuthState>(SERVER_SAFE_STATE);
  const loadingUserIdRef = useRef<string | null>(null);

  const loadUserData = useCallback(async (user: User | null, session?: Session | null) => {
    if (!user) {
      setState({ user: null, session: null, profile: null, role: null, loading: false });
      try {
        localStorage.removeItem(AUTH_CACHE_KEY);
      } catch { /* storage unavailable */ }
      return;
    }

    // Skip redundant network fetch if already loaded or matching in-flight user
    if (loadingUserIdRef.current === user.id) return;
    loadingUserIdRef.current = user.id;

    try {
      const [profileRes, roleRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_roles').select('*').eq('user_id', user.id).single(),
      ]);

      const profile = (profileRes.data as Profile | null) ?? null;
      const role = (roleRes.data as UserRole | null) ?? null;

      setState((prev) => ({
        ...prev,
        user,
        session: session !== undefined ? session : prev.session,
        profile,
        role,
        loading: false,
      }));

      try {
        localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({ user, profile, role }));
      } catch { /* storage unavailable */ }
    } finally {
      loadingUserIdRef.current = null;
    }
  }, [supabase]);

  // After hydration, apply any cached auth state from localStorage so
  // returning users skip the loading spinner without SSR mismatches.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.user) {
          setState((prev) =>
            // Only apply if we haven't already resolved auth (e.g. onAuthStateChange fired first)
            prev.loading
              ? { user: parsed.user, session: null, profile: parsed.profile ?? null, role: parsed.role ?? null, loading: false }
              : prev,
          );
        }
      }
    } catch { /* storage unavailable */ }
  }, []); // run once after mount

  useEffect(() => {
    let mounted = true;

    // Listen to auth changes (this fires INITIAL_SESSION automatically in Supabase)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setState((prev) => ({ ...prev, session }));
      loadUserData(session?.user ?? null, session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadUserData]);

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem(AUTH_CACHE_KEY);
    } catch { /* storage unavailable */ }
    await supabase.auth.signOut();
    setState({ user: null, session: null, profile: null, role: null, loading: false });
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    loadingUserIdRef.current = null; // force reload
    await loadUserData(state.user, state.session);
  }, [state.user, state.session, loadUserData]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signOut,
      refreshProfile,
    }),
    [state, signOut, refreshProfile],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
