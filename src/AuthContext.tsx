import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Interface pour les informations d'abonnement
 */
export interface SubscriptionInfo {
  isSubscribed: boolean;
  subscriptionStatus: string | null;
  maxListings: number;
  maxAncillaryServices: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isExpired: boolean; // Calculé : true si la date de fin est passée
}

/**
 * Interface du contexte d'authentification
 * 
 * - user: L'utilisateur actuellement connecté (null si non connecté)
 * - session: La session actuelle (null si non connecté)
 * - loading: Indique si l'authentification est en cours de chargement initial
 * - initialized: Indique si l'authentification a été initialisée
 * - monthlyCount: Nombre d'annonces immobilières déjà publiées ce mois-ci (0 si non connecté)
 * - monthlyAncillaryCount: Nombre d'annonces de services annexes déjà publiées ce mois-ci (0 si non connecté)
 * - subscriptionInfo: Informations sur l'abonnement de l'utilisateur
 * - signIn: Fonction pour connecter un utilisateur
 * - signUp: Fonction pour créer un nouveau compte
 * - signOut: Fonction pour déconnecter l'utilisateur
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  monthlyCount: number;
  monthlyAncillaryCount: number;
  subscriptionInfo: SubscriptionInfo;
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
  const [monthlyCount, setMonthlyCount] = useState<number>(0);
  const [monthlyAncillaryCount, setMonthlyAncillaryCount] = useState<number>(0);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    isSubscribed: false,
    subscriptionStatus: null,
    maxListings: 50,
    maxAncillaryServices: 5,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    isExpired: false,
  });

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

  // Fetch monthly count and subscription info when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setMonthlyCount(0);
        setMonthlyAncillaryCount(0);
        setSubscriptionInfo({
          isSubscribed: false,
          subscriptionStatus: null,
          maxListings: 50,
          maxAncillaryServices: 5,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          currentPeriodStart: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          isExpired: false,
        });
        return;
      }

      try {
        // Fetch monthly count for properties
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const { count, error: countError } = await supabase
          .from('properties')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', now.toISOString());

        if (countError) {
          console.error('[AuthContext] Error fetching monthly count:', countError);
          setMonthlyCount(0);
        } else {
          setMonthlyCount(count || 0);
        }

        // Fetch monthly count for ancillary services
        const { count: ancillaryCount, error: ancillaryCountError } = await supabase
          .from('ancillary_services')
          .select('id', { count: 'exact', head: true })
          .eq('requested_by', user.id)
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', now.toISOString());

        if (ancillaryCountError) {
          console.error('[AuthContext] Error fetching monthly ancillary count:', ancillaryCountError);
          setMonthlyAncillaryCount(0);
        } else {
          setMonthlyAncillaryCount(ancillaryCount || 0);
        }

        // Fetch subscription info from profile
        // Note: Some columns may not exist yet in the database, so we handle errors gracefully
        // First, fetch the basic columns that definitely exist
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('stripe_subscription_status, max_listings, max_ancillary_services, stripe_customer_id')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('[AuthContext] Error fetching subscription info:', profileError);
          setSubscriptionInfo({
            isSubscribed: false,
            subscriptionStatus: null,
            maxListings: 50,
            maxAncillaryServices: 5,
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
            isExpired: false,
          });
        } else {
          const status = profile?.stripe_subscription_status || null;
          const isActive = status === 'active';
          
          // Try to fetch additional subscription fields if columns exist
          let subscriptionId: string | null = null;
          let periodStart: string | null = null;
          let periodEnd: string | null = null;
          let cancelAtPeriodEnd = false;
          
          try {
            const { data: profileExtended } = await supabase
              .from('profiles')
              .select('stripe_subscription_id, subscription_current_period_start, subscription_current_period_end, subscription_cancel_at_period_end')
              .eq('user_id', user.id)
              .single();
            
            subscriptionId = (profileExtended as any)?.stripe_subscription_id || null;
            periodStart = (profileExtended as any)?.subscription_current_period_start || null;
            periodEnd = (profileExtended as any)?.subscription_current_period_end || null;
            cancelAtPeriodEnd = (profileExtended as any)?.subscription_cancel_at_period_end || false;
          } catch {
            // Columns don't exist yet, that's ok - they will be added via migration
            // Use null values as defaults
          }
          
          const now = new Date();
          
          // Calculer si l'abonnement est expiré
          const isExpired = periodEnd 
            ? new Date(periodEnd) < now 
            : false;
          
          // Si l'abonnement est expiré, considérer comme non actif
          const actuallyActive = isActive && !isExpired;
          
          setSubscriptionInfo({
            isSubscribed: actuallyActive,
            subscriptionStatus: status,
            maxListings: profile?.max_listings ?? 50,
            maxAncillaryServices: (profile as any)?.max_ancillary_services ?? 5,
            stripeCustomerId: profile?.stripe_customer_id || null,
            stripeSubscriptionId: subscriptionId,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd,
            isExpired,
          });
        }
      } catch (error) {
        console.error('[AuthContext] Exception fetching user data:', error);
        setMonthlyCount(0);
        setMonthlyAncillaryCount(0);
        setSubscriptionInfo({
          isSubscribed: false,
          subscriptionStatus: null,
          maxListings: 50,
          maxAncillaryServices: 5,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          currentPeriodStart: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          isExpired: false,
        });
      }
    };

    fetchUserData();

    // Refresh data every minute to keep it up to date
    const interval = setInterval(fetchUserData, 60000);

    return () => clearInterval(interval);
  }, [user]);

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
    monthlyCount,
    monthlyAncillaryCount,
    subscriptionInfo,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook pour accéder au contexte d'authentification
 * 
 * @example
 * ```tsx
 * const { user, signIn, signOut } = useAuth();
 * 
 * if (user) {
 *   // Utilisateur connecté
 * }
 * ```
 * 
 * @throws {Error} Si utilisé en dehors d'un AuthProvider
 * @returns Le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

