import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    profileData?: {
      user_type?: string;
      phone?: string;
      address?: string;
      profession?: string;
      siret?: string;
      instagram?: string;
      twitter?: string;
      facebook?: string;
    }
  ) => Promise<boolean>;
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
        console.log('[AuthContext] Auth state changed:', event, { 
          hasSession: !!newSession,
          userId: newSession?.user?.id,
          email: newSession?.user?.email 
        });
        
        if (!mounted) return;

        // For SIGNED_OUT, clear state immediately
        if (event === 'SIGNED_OUT') {
          console.log('[AuthContext] User signed out, clearing state');
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        // For SIGNED_IN or TOKEN_REFRESHED, update state immediately
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession) {
            console.log('[AuthContext] User signed in/refreshed, updating state with newSession');
            setSession(newSession);
            setUser(newSession.user ?? null);
            setLoading(false);
            return;
          }
        }

        // For other events, verify session with getSession() for reliability
        try {
          const { data: { session: verifiedSession }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('[AuthContext] Error getting session during state change:', error);
            // Only clear if it's truly a session-related error
            if (error.message?.includes('session') || error.message?.includes('token')) {
              setSession(null);
              setUser(null);
              setLoading(false);
            }
            return;
          }

          // Update with verified session
          if (verifiedSession) {
            console.log('[AuthContext] Session verified, updating state');
            setSession(verifiedSession);
            setUser(verifiedSession.user ?? null);
          } else if (newSession) {
            // Fallback to newSession
            console.log('[AuthContext] Using newSession as fallback');
            setSession(newSession);
            setUser(newSession.user ?? null);
          }
          setLoading(false);
        } catch (err) {
          console.error('[AuthContext] Error verifying session after state change:', err);
          // Fallback to newSession if verification fails
          if (newSession) {
            setSession(newSession);
            setUser(newSession.user ?? null);
          }
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('[AuthContext] Sign in error:', error);
        toast.error("Échec de la connexion : " + error.message);
        return false;
      }

      // Update state immediately after successful sign in
      if (data.session) {
        console.log('[AuthContext] Sign in successful, updating state immediately');
        setSession(data.session);
        setUser(data.session.user ?? null);
      }
      
      toast.success("Connexion réussie");
      // State will also be updated by onAuthStateChange listener for consistency
      return true;
    } catch (error) {
      console.error('[AuthContext] Sign in exception:', error);
      toast.error("Erreur lors de la connexion");
      return false;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    profileData?: {
      user_type?: string;
      phone?: string;
      address?: string;
      profession?: string;
      siret?: string;
      instagram?: string;
      twitter?: string;
      facebook?: string;
    }
  ): Promise<boolean> => {
    try {
      // Anti double-submit / bruteforce côté client
      const now = Date.now();
      if (typeof (window as any).__lastSignupAttemptMs === 'number') {
        const elapsed = now - (window as any).__lastSignupAttemptMs;
        if (elapsed < 60_000) {
          const remaining = Math.ceil((60_000 - elapsed) / 1000);
          console.warn(`[AuthContext] Sign up cooldown: ${remaining}s remaining`);
          return false;
        }
      }
      (window as any).__lastSignupAttemptMs = now;

      // Création du compte d'authentification
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/account',
          data: {
            email_confirmed_at: new Date().toISOString(),
            user_type: profileData?.user_type || 'Particulier',
            phone: profileData?.phone || null,
            address: profileData?.address || null,
            profession: profileData?.profession || null,
            siret: profileData?.siret || null,
            instagram: profileData?.instagram || null,
            twitter: profileData?.twitter || null,
            facebook: profileData?.facebook || null,
          }
        }
      });

      if (authError) {
        console.error('[AuthContext] Sign up error:', authError);
        
        // Gestion des erreurs spécifiques
        const status = authError.status;
        const message = authError.message || '';
        
        if (status === 429 || (typeof message === 'string' && message.toLowerCase().includes('only request this after'))) {
          toast.error("Trop de tentatives. Réessayez dans environ 60 secondes.");
          return false;
        }
        
        let errorMessage = "Échec de l'inscription";
        const code = authError.name || authError.status?.toString();
        const lowerMsg = typeof message === 'string' ? message.toLowerCase() : '';
        const isAlreadyRegistered =
          lowerMsg.includes('already registered') ||
          lowerMsg.includes('user already exists') ||
          code === 'user_already_exists' ||
          status === 400;

        if (isAlreadyRegistered) {
          errorMessage = "Un compte existe déjà avec cet email. Connectez-vous ou réinitialisez votre mot de passe.";
        } else if (message) {
          errorMessage += ` : ${message}`;
        }
        
        toast.error(errorMessage);
        return false;
      }

      // Mise à jour du profil avec toutes les données fournies
      if (authData.user && profileData) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              user_id: authData.user.id,
              email: authData.user.email || email,
              user_type: profileData.user_type || 'Particulier',
              phone: profileData.phone || null,
              address: profileData.address || null,
              profession: profileData.profession || null,
              siret: profileData.siret || null,
              instagram: profileData.instagram || null,
              twitter: profileData.twitter || null,
              facebook: profileData.facebook || null,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });

          if (profileError) {
            console.error('[AuthContext] Profile update error:', profileError);
            // Non bloquant: le trigger assure au moins la création de base
          } else {
            console.log('[AuthContext] Profile updated successfully');
          }
        } catch (e) {
          console.error('[AuthContext] Profile update exception:', e);
          // Non bloquant
        }
      }

      toast.success("Compte créé ! Consultez votre boîte mail pour finaliser votre inscription.");
      // State will be updated by onAuthStateChange listener
      return true;
    } catch (error) {
      console.error('[AuthContext] Sign up exception:', error);
      toast.error("Erreur lors de l'inscription");
      return false;
    }
  };

  const signOut = async () => {
    try {
      console.log('[AuthContext] Sign out: start');
      
      // Manual token cleanup first to ensure UI reflects logout immediately
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => {
          localStorage.removeItem(k);
        });
      } catch (e) {
        console.error('[AuthContext] Token cleanup failed (non-blocking)', e);
      }

      // Attempt sign-out with timeout to avoid hanging
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise<{ error: Error }>((resolve) => {
        setTimeout(() => {
          resolve({ error: new Error('timeout') });
        }, 4000);
      });

      const result = await Promise.race([
        signOutPromise.then(() => ({ error: null })),
        timeoutPromise
      ]);

      if (result.error) {
        console.warn('[AuthContext] Sign out timeout or error, proceeding anyway');
      }

      toast.success("Déconnexion réussie");
      // State will be updated by onAuthStateChange listener
      console.log('[AuthContext] Sign out: completed');
    } catch (error) {
      console.error('[AuthContext] Sign out error:', error);
      toast.error("Erreur lors de la déconnexion");
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    initialized,
    signIn,
    signUp,
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

