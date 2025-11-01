import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

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
        console.log('[AuthContext] Auth state changed:', event, { hasSession: !!newSession });
        
        if (!mounted) return;

        // For SIGNED_OUT, clear state immediately
        if (event === 'SIGNED_OUT') {
          console.log('[AuthContext] User signed out, clearing state');
          setSession(null);
          setUser(null);
          return;
        }

        // Always verify session with getSession() for reliability
        // This ensures we don't lose the session on route changes or other events
        try {
          const { data: { session: verifiedSession }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('[AuthContext] Error getting session during state change:', error);
            // Only clear if it's truly a session-related error
            // Don't clear on network errors or other transient issues
            if (error.message?.includes('session') || error.message?.includes('token')) {
              setSession(null);
              setUser(null);
            }
            return;
          }

          // Always update with verified session if it exists
          if (verifiedSession) {
            console.log('[AuthContext] Session verified, updating state');
            setSession(verifiedSession);
            setUser(verifiedSession.user ?? null);
          } else if (newSession) {
            // Fallback to newSession if verified session is null but newSession exists
            console.log('[AuthContext] Using newSession as fallback');
            setSession(newSession);
            setUser(newSession.user ?? null);
          } else {
            // Both are null - only clear if this is an explicit sign-out event
            // For other events (like INITIAL_SESSION when no session exists), don't clear
            // This prevents losing session on route changes
            if (event !== 'INITIAL_SESSION') {
              console.log('[AuthContext] No session found for event:', event, '- keeping current state');
            }
          }
        } catch (err) {
          console.error('[AuthContext] Error verifying session after state change:', err);
          // Fallback to newSession if verification fails
          if (newSession) {
            setSession(newSession);
            setUser(newSession.user ?? null);
          }
          // Don't clear state on verification errors - keep current session
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

