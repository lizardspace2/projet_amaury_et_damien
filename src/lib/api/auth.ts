import { supabase } from "./supabaseClient";
import { toast } from "sonner";

/**
 * Authentifie un utilisateur avec email et mot de passe
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error("Échec de la connexion : " + error.message);
      return false;
    }
    
    toast.success("Connexion réussie");
    return true;
  } catch (error) {
    console.error("Error signing in:", error);
    return false;
  }
};

/**
 * Crée un nouveau compte utilisateur avec email et mot de passe
 * et crée automatiquement un profil associé
 */
export const signUpWithEmail = async (
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
) => {
  try {
    // Étape 1: Création du compte d'authentification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/account',
        data: {
          email_confirmed_at: new Date().toISOString(),
        }
      }
    });

    if (authError) throw authError;

    // Le profil sera créé côté base via un trigger sur auth.users.
    // On n'insère plus côté client pour éviter les erreurs de contrainte FK liées aux délais de propagation.

    toast.success("Compte créé ! Consultez votre boîte mail pour finaliser votre inscription.");
    return true;
  } catch (error) {
    console.error("Error signing up:", error);
    
    let errorMessage = "Échec de l'inscription";
    const message = (error as any)?.message || (error instanceof Error ? error.message : "");
    const status = (error as any)?.status;
    const code = (error as any)?.code;

    const lowerMsg = typeof message === 'string' ? message.toLowerCase() : '';
    const isAlreadyRegistered =
      lowerMsg.includes('already registered') ||
      lowerMsg.includes('user already exists') ||
      code === 'user_already_exists' ||
      status === 400; // supabase often returns 400 with "User already registered"

    if (isAlreadyRegistered) {
      errorMessage = "Un compte existe déjà avec cet email. Connectez-vous ou réinitialisez votre mot de passe.";
    } else if (message) {
      errorMessage += ` : ${message}`;
    }
    
    toast.error(errorMessage);
    return false;
  }
};

/**
 * Déconnecte l'utilisateur
 */
export const signOut = async () => {
  try {
    console.log('[Auth] signOut: start');
    // 1) Manual token cleanup first to ensure UI reflects logout immediately
    try {
      console.log('[Auth] signOut: manual token cleanup start');
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => {
        console.log('[Auth] signOut: removing localStorage key ->', k);
        localStorage.removeItem(k);
      });
      console.log('[Auth] signOut: manual token cleanup done');
    } catch (e) {
      console.error('[Auth] signOut: manual token cleanup failed (non-blocking)', e);
    }

    // 2) Attempt global sign-out but race with a timeout to avoid hanging
    const globalSignOut = (async () => {
      try {
        console.log('[Auth] signOut: calling global supabase.auth.signOut()');
        const { error } = await supabase.auth.signOut();
        console.log('[Auth] signOut: global signOut completed, error =', error);
        if (error) return { ok: false, error } as const;
        return { ok: true } as const;
      } catch (e) {
        console.error('[Auth] signOut: exception during global signOut', e);
        return { ok: false, error: e } as const;
      }
    })();

    const timeout = new Promise<{ ok: false; error: Error }>(resolve => {
      const id = setTimeout(() => {
        clearTimeout(id);
        console.warn('[Auth] signOut: global signOut timed out');
        resolve({ ok: false, error: new Error('timeout') });
      }, 4000);
    });

    const result = await Promise.race([globalSignOut, timeout]);

    if (!result.ok) {
      console.warn('[Auth] signOut: proceeding after timeout/error to keep UI consistent');
    }

    toast.success("Déconnexion réussie");
    console.log('[Auth] signOut: finishing -> returning true');
    return true;
  } catch (error) {
    console.error('[Auth] signOut: exception thrown', error);
    return false;
  }
};

/**
 * Récupère l'utilisateur actuellement connecté
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
};

/**
 * Récupère le profil complet de l'utilisateur (auth + données supplémentaires)
 */
export const getCompleteUserProfile = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return {
      ...user,
      profile: {
        user_type: profile.user_type,
        phone: profile.phone,
        address: profile.address,
        profession: profile.profession,
        siret: profile.siret,
        instagram: profile.instagram,
        twitter: profile.twitter,
        facebook: profile.facebook,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Met à jour le profil utilisateur
 */
export const updateUserProfile = async (profileData: {
  user_type?: string;
  phone?: string;
  address?: string;
  profession?: string;
  siret?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) throw error;

    toast.success("Profil mis à jour avec succès");
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Échec de la mise à jour du profil");
    return false;
  }
};

/**
 * Gère les erreurs d'authentification depuis l'URL
 */
export const handleAuthError = (hash: string) => {
  if (hash && hash.includes('error=')) {
    const params = new URLSearchParams(hash.substring(1));
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (error === 'access_denied' && errorDescription?.includes('expired')) {
      window.location.href = '/verification-error' + hash;
      return true;
    }
  }
  return false;
};