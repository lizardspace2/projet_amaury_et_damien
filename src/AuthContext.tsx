import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/api/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    // Initial session check using getSession() for reliability
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthContext] Session check error:', error);
          if (mounted) {
            setSession(null);
            setUser(null);
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false);
          setInitialized(true);
        }
      } catch (err) {
        console.error('[AuthContext] Auth initialization failed:', err);
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('[AuthContext] Auth state changed:', event);
        
        if (!mounted) return;

        // For SIGNED_OUT, clear state immediately
        if (event === 'SIGNED_OUT' || !newSession) {
          setSession(null);
          setUser(null);
          return;
        }

        // For SIGNED_IN or TOKEN_REFRESHED, update state
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Double-check with getSession() for reliability
          try {
            const { data: { session: verifiedSession } } = await supabase.auth.getSession();
            setSession(verifiedSession);
            setUser(verifiedSession?.user ?? null);
          } catch (err) {
            console.error('[AuthContext] Error verifying session after state change:', err);
            setSession(newSession);
            setUser(newSession?.user ?? null);
          }
        } else {
          // For other events, use the provided session
          setSession(newSession);
          setUser(newSession?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // State will be updated by onAuthStateChange listener
    } catch (error) {
      console.error('[AuthContext] Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    initialized,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

