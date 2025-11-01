import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Property, PropertyType, ListingType, PropertyStatus, PropertyCondition, KitchenType } from "@/types/property";
import { getApiBase } from "@/lib/utils";

// ===== AUTHENTICATION & USER PROFILES =====

/**
 * @deprecated Utilisez useAuth().signIn() depuis AuthContext à la place
 * Authentifie un utilisateur avec email et mot de passe
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error("Ã‰chec de la connexion : " + error.message);
      return false;
    }
    
    toast.success("Connexion rÃ©ussie");
    return true;
  } catch (error) {
    console.error("Error signing in:", error);
    return false;
  }
};

/**
 * @deprecated Utilisez useAuth().signUp() depuis AuthContext à la place
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
  // Anti double-submit / bruteforce cÃ´tÃ© client pour Ã©viter le 429 Supabase
  // Supabase impose dÃ©jÃ  une limite (~60s) entre tentatives d'inscription.
  // On ajoute un cooldown local pour Ã©viter de spammer.
  const now = Date.now();
  if (typeof (window as any).__lastSignupAttemptMs === 'number') {
    const elapsed = now - (window as any).__lastSignupAttemptMs;
    if (elapsed < 60_000) {
      const remaining = Math.ceil((60_000 - elapsed) / 1000);
      toast.error(`Veuillez patienter ${remaining}s avant une nouvelle tentative d'inscription.`);
      return false;
    }
  }
  (window as any).__lastSignupAttemptMs = now;
  try {
    // Ã‰tape 1: CrÃ©ation du compte d'authentification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/account',
        data: {
          email_confirmed_at: new Date().toISOString(),
          // Propager les infos utiles au trigger cÃ´tÃ© DB (si disponible)
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

    if (authError) throw authError;

    // Mise Ã  jour du profil avec toutes les donnÃ©es fournies
    // On utilise authData.user.id qui est disponible immÃ©diatement aprÃ¨s la crÃ©ation
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
          console.error('[signUpWithEmail] Erreur lors de la mise Ã  jour du profil:', profileError);
          // On ne bloque pas le processus, mais on log l'erreur
        } else {
          console.log('[signUpWithEmail] Profil mis Ã  jour avec succÃ¨s avec toutes les donnÃ©es');
        }
      } catch (e) {
        console.error('[signUpWithEmail] Exception lors de la mise Ã  jour du profil:', e);
        // Non bloquant: le trigger assure au moins la crÃ©ation de base, les donnÃ©es peuvent Ãªtre mises Ã  jour plus tard
      }
    }

    toast.success("Compte crÃ©Ã© ! Consultez votre boÃ®te mail pour finaliser votre inscription.");
    return true;
  } catch (error) {
    console.error("Error signing up:", error);
    // Cas spÃ©cifique rate-limit 429
    const status = (error as any)?.status;
    const message = (error as any)?.message || (error instanceof Error ? error.message : "");
    if (status === 429 || (typeof message === 'string' && message.toLowerCase().includes('only request this after'))) {
      toast.error("Trop de tentatives. RÃ©essayez dans environ 60 secondes.");
      return false;
    }
    
    let errorMessage = "Ã‰chec de l'inscription";
    const code = (error as any)?.code;

    const lowerMsg = typeof message === 'string' ? message.toLowerCase() : '';
    const isAlreadyRegistered =
      lowerMsg.includes('already registered') ||
      lowerMsg.includes('user already exists') ||
      code === 'user_already_exists' ||
      status === 400; // supabase often returns 400 with "User already registered"

    if (isAlreadyRegistered) {
      errorMessage = "Un compte existe dÃ©jÃ  avec cet email. Connectez-vous ou rÃ©initialisez votre mot de passe.";
    } else if (message) {
      errorMessage += ` : ${message}`;
    }
    
    toast.error(errorMessage);
    return false;
  }
};

/**
 * @deprecated Utilisez useAuth().signOut() depuis AuthContext à la place
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

    toast.success("DÃ©connexion rÃ©ussie");
    console.log('[Auth] signOut: finishing -> returning true');
    return true;
  } catch (error) {
    console.error('[Auth] signOut: exception thrown', error);
    return false;
  }
};

/**
 * RÃ©cupÃ¨re l'utilisateur actuellement connectÃ©
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
 * RÃ©cupÃ¨re le profil complet de l'utilisateur (auth + donnÃ©es supplÃ©mentaires)
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
 * Met Ã  jour le profil utilisateur
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

    toast.success("Profil mis Ã  jour avec succÃ¨s");
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Ã‰chec de la mise Ã  jour du profil");
    return false;
  }
};

/**
 * GÃ¨re les erreurs d'authentification depuis l'URL
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

/**
 * CrÃ©e un profil utilisateur
 */
export const createUserProfile = async (userId: string, email: string, userType?: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { 
        user_id: userId,
        email,
        user_type: userType || null,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) throw error;
  return data;
};

/**
 * RÃ©cupÃ¨re le profil d'un utilisateur par son ID
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};



// ===== PROPERTIES =====

export interface CreatePropertyInput {
  title: string;
  description?: string;
  price: number;
  phone_number?: string;
  cadastral_code?: string;
  reference_number?: string;
  property_type?: PropertyType;
  listing_type?: ListingType;
  status?: PropertyStatus;
  condition?: PropertyCondition;
  plan?: string;
  address_street?: string;
  address_city: string;
  address_district?: string;
  lat?: number;
  lng?: number;
  beds?: number;
  baths?: number;
  m2?: number;
  rooms?: number;
  has_elevator?: boolean;
  has_ventilation?: boolean;
  has_air_conditioning?: boolean;
  is_accessible?: boolean;
  has_vent?: boolean;
  amenities?: string[];
  equipment?: string[];
  internet_tv?: string[];
  storage?: string[];
  security?: string[];
  nearby_places?: string[];
  online_services?: string[];
  images?: File[];
  existingImageUrls?: string[];
  removedImageUrls?: string[];
  contact_email?: string;
  instagram_handle?: string;
  facebook_url?: string;
  twitter_handle?: string;
  currency?: string;
  has_gas?: boolean;
  has_loggia?: boolean;
  has_fireplace?: boolean;
  has_internet?: boolean;
  has_cable_tv?: boolean;
  has_dishwasher?: boolean;
  has_gas_stove?: boolean;
  has_electric_kettle?: boolean;
  has_induction_oven?: boolean;
  has_microwave?: boolean;
  has_washing_machine?: boolean;
  has_tv?: boolean;
  has_coffee_machine?: boolean;
  has_audio_system?: boolean;
  has_heater?: boolean;
  has_electric_oven?: boolean;
  has_hair_dryer?: boolean;
  has_refrigerator?: boolean;
  has_vacuum_cleaner?: boolean;
  has_dryer?: boolean;
  has_iron?: boolean;
  has_co_detector?: boolean;
  has_smoke_detector?: boolean;
  has_evacuation_ladder?: boolean;
  has_fire_fighting_system?: boolean;
  has_perimeter_cameras?: boolean;
  has_alarm?: boolean;
  has_live_protection?: boolean;
  has_locked_entrance?: boolean;
  has_locked_yard?: boolean;
  near_bus_stop?: boolean;
  near_bank?: boolean;
  near_subway?: boolean;
  near_supermarket?: boolean;
  near_kindergarten?: boolean;
  near_city_center?: boolean;
  near_pharmacy?: boolean;
  near_greenery?: boolean;
  near_park?: boolean;
  near_shopping_centre?: boolean;
  near_school?: boolean;
  near_old_district?: boolean;
  allows_pets?: boolean;
  allows_parties?: boolean;
  allows_smoking?: boolean;
  terrace_area?: number;
  kitchen_type?: KitchenType;
  ceiling_height?: number;
  floor_level?: number;
  total_floors?: number;
  year_built?: number;
  featured?: boolean;
  building_material?: string;
  furniture_type?: string;
  storeroom_type?: string;
  heating_type?: string;
  hot_water_type?: string;
  parking_type?: string;
  has_satellite_tv?: boolean;
  has_phone_line?: boolean;
  price_per_m2?: number;
  // SeLoger fields
  frais_agence?: number;
  charges_mensuelles?: number;
  taxe_fonciere?: number;
  dpe_classe_energie?: string;
  dpe_consommation?: number;
  ges_classe_gaz?: string;
  ges_emission?: number;
  nom_agence?: string;
  reference_annonce?: string;
  nombre_photos?: number;
  lien_visite_virtuelle?: string;
  date_publication?: string;
  date_mise_a_jour?: string;
  code_postal?: string;
  surface_balcon_terrasse?: number;
  parking_box?: number;
  cave?: boolean;
  nombre_etages_immeuble?: number;
  annee_construction?: number;
}

const transformProperty = (property: any): Property => {
  // Convert string numeric fields to actual numbers
  const transformed = { ...property };
  
  // Convert price to number
  if (typeof transformed.price === 'string') {
    transformed.price = parseFloat(transformed.price) || 0;
  }
  
  // Convert m2 to number
  if (typeof transformed.m2 === 'string') {
    transformed.m2 = parseFloat(transformed.m2) || 0;
  }
  
  // Convert other numeric fields
  ['beds', 'baths', 'rooms', 'terrace_area', 'ceiling_height', 'floor_level', 
   'total_floors', 'year_built', 'parking_box', 'nombre_etages_immeuble', 
   'nombre_photos', 'dpe_consommation', 'ges_emission', 'price_per_m2',
   'frais_agence', 'charges_mensuelles', 'taxe_fonciere', 'surface_balcon_terrasse',
   'annee_construction'].forEach(field => {
    if (transformed[field] !== null && transformed[field] !== undefined) {
      if (typeof transformed[field] === 'string') {
        transformed[field] = parseFloat(transformed[field]) || 0;
      }
    }
  });
  
  return transformed as Property;
};

export const createProperty = async (input: CreatePropertyInput) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    // Enforce monthly publishing cap for professional accounts
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_type, max_listings')
      .eq('user_id', user.id)
      .single();

    if (!profileError && profile?.user_type === 'Professionnelle') {
      const maxListings = typeof (profile as any).max_listings === 'number' ? (profile as any).max_listings : 50;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count, error: countError } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', now.toISOString());

      if (!countError && typeof count === 'number' && count >= maxListings) {
        const errorWithCode: any = new Error('Professional monthly listing limit reached');
        errorWithCode.code = 'LISTING_LIMIT_REACHED';
        errorWithCode.maxListings = maxListings;
        throw errorWithCode;
      }
    }

    // Save existingImageUrls before destructuring it out
    const existingImageUrls = input.existingImageUrls || [];
    
    let imageUrls: string[] = [];
    if (input.images?.length) {
      const uploadPromises = input.images.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('property_images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw uploadError;
        }
        const { data: { publicUrl } } = supabase.storage.from('property_images').getPublicUrl(fileName);
        return publicUrl;
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    const { existingImageUrls: _, removedImageUrls, ...restOfInput } = input;

    // Calculate nombre_photos from the images array - combine existing and new images
    const totalImages = [...existingImageUrls, ...imageUrls];
    const nombre_photos = totalImages.length;

    // Validate that we have at least one image
    if (totalImages.length === 0) {
      throw new Error('Au moins une photo est requise pour publier l\'annonce');
    }

    // Set date_publication to current timestamp
    const date_publication = new Date().toISOString();

    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        ...restOfInput,
        user_id: user.id,
        images: totalImages, // Use totalImages instead of just imageUrls
        nombre_photos,
        date_publication,
      })
      .select()
      .single();

    if (propertyError) {
      console.error('Property insertion error:', propertyError);
      throw propertyError;
    }

    toast.success("Annonce immobiliÃ¨re crÃ©Ã©e avec succÃ¨s !");
    return property;
  } catch (error) {
    console.error('Error creating property:', error);
    toast.error("Ã‰chec de la crÃ©ation de l'annonce immobiliÃ¨re. Veuillez rÃ©essayer.");
    throw error;
  }
};

export const getProperties = async (type?: ListingType): Promise<Property[]> => {
  try {
    // Ensure we have a fresh session, but don't require authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    let query = supabase.from('properties').select('*');

    if (type && type !== 'all') {
      query = query.eq('listing_type', type);
    }

    const { data: properties, error } = await query;

    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
    
    if (!properties) return [];
    
    return properties.map(transformProperty);
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    // Only show toast if it's not a permission error (which might be silent)
    if (error?.code !== 'PGRST301' && error?.code !== '42501') {
      toast.error("Ã‰chec de la rÃ©cupÃ©ration des propriÃ©tÃ©s. Veuillez rÃ©essayer.");
    }
    return [];
  }
};

export const getPropertiesByType = async (listingType: 'sale' | 'rent' | 'rent_by_day' | 'lease'): Promise<Property[]> => {
  return getProperties(listingType);
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
  try {
    // Ensure we have a fresh session, but don't require authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('featured', true);

    if (error) {
      console.error('Error fetching featured properties:', error);
      throw error;
    }
    
    if (!properties) return [];
    
    return properties.map(transformProperty);
  } catch (error: any) {
    console.error('Error fetching featured properties:', error);
    // Only show toast if it's not a permission error (which might be silent)
    if (error?.code !== 'PGRST301' && error?.code !== '42501') {
      toast.error("Ã‰chec de la rÃ©cupÃ©ration des propriÃ©tÃ©s en vedette. Veuillez rÃ©essayer.");
    }
    return [];
  }
};

export const getMyProperties = async (): Promise<Property[]> => {
  try {
    // Use getSession() for more reliable check
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) throw new Error("User not authenticated");

    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return properties.map(transformProperty);
  } catch (error) {
    console.error('Error fetching user properties:', error);
    toast.error("Ã‰chec de la rÃ©cupÃ©ration de vos propriÃ©tÃ©s. Veuillez rÃ©essayer.");
    return [];
  }
};

export const deleteProperty = async (propertyId: string) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    // First, get the property to get the list of images to delete
    const { data: property, error: fetchError } = await supabase
      .from('properties')
      .select('images')
      .eq('id', propertyId)
      .single();

    if (fetchError) throw fetchError;

    // Delete images from storage
    if (property?.images && property.images.length > 0) {
      const imagePaths = property.images.map(url => url.substring(url.lastIndexOf('/') + 1));
      const { error: storageError } = await supabase.storage.from('property_images').remove(imagePaths);
      if (storageError) {
        console.error("Error deleting images from storage:", storageError);
      }
    }
    
    // Delete the property itself
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .eq('user_id', user.id);

    if (error) throw error;

    toast.success("PropriÃ©tÃ© supprimÃ©e avec succÃ¨s");
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    toast.error("Ã‰chec de la suppression de la propriÃ©tÃ©");
    return false;
  }
};

export const updateProperty = async (propertyId: string, input: Partial<CreatePropertyInput>) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    let newImageUrls: string[] = input.existingImageUrls || [];

    // Handle removed images
    if (input.removedImageUrls && input.removedImageUrls.length > 0) {
      const pathsToRemove = input.removedImageUrls.map(url => url.substring(url.lastIndexOf('/') + 1));
      await supabase.storage.from('property_images').remove(pathsToRemove);
    }

    // Handle new images
    if (input.images && input.images.length > 0) {
      const uploadPromises = input.images.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('property_images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('property_images').getPublicUrl(fileName);
        return publicUrl;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      newImageUrls = [...newImageUrls, ...uploadedUrls];
    }
    
    const updateData = { ...input };
    delete updateData.images;
    delete updateData.existingImageUrls;
    delete updateData.removedImageUrls;

    // Calculate nombre_photos from the updated images array
    const nombre_photos = newImageUrls.length;

    // Set date_mise_a_jour to current timestamp
    const date_mise_a_jour = new Date().toISOString();

    const { error: propertyError } = await supabase
      .from('properties')
      .update({ 
        ...updateData, 
        images: newImageUrls,
        nombre_photos,
        date_mise_a_jour,
      })
      .eq('id', propertyId)
      .eq('user_id', user.id);

    if (propertyError) throw propertyError;

    toast.success("Annonce immobiliÃ¨re mise Ã  jour avec succÃ¨s !");
    return true;
  } catch (error) {
    console.error('Error updating property:', error);
    toast.error("Ã‰chec de la mise Ã  jour de l'annonce immobiliÃ¨re. Veuillez rÃ©essayer.");
    throw error;
  }
};

export const getNewestProperties = async (): Promise<Property[]> => {
  try {
    // Ensure we have a fresh session, but don't require authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching newest properties:', error);
      throw error;
    }
    
    if (!properties) return [];

    return properties.map(transformProperty);
  } catch (error: any) {
    console.error('Error fetching newest properties:', error);
    // Only show toast if it's not a permission error (which might be silent)
    if (error?.code !== 'PGRST301' && error?.code !== '42501') {
      toast.error("Failed to fetch newest properties. Please try again.");
    }
    return [];
  }
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    // Ensure we have a fresh session, but don't require authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property by ID:', error);
      throw error;
    }
    
    if (!property) return null;

    return transformProperty(property);
  } catch (error: any) {
    console.error('Error fetching property by ID:', error);
    // Only show toast if it's not a permission error or not found (which might be silent)
    if (error?.code !== 'PGRST301' && error?.code !== '42501' && error?.code !== 'PGRST116') {
      toast.error("Ã‰chec de la rÃ©cupÃ©ration des dÃ©tails de la propriÃ©tÃ©. Veuillez rÃ©essayer.");
    }
    return null;
  }
};

export const pauseProperty = async (propertyId: string) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('properties')
      .update({ status: 'pause' })
      .eq('id', propertyId)
      .eq('user_id', user.id);

    if (error) throw error;
    toast.success("PropriÃ©tÃ© mise en pause avec succÃ¨s");
    return true;
  } catch (error) {
    console.error('Error pausing property:', error);
    toast.error("Ã‰chec de la mise en pause de la propriÃ©tÃ©. Veuillez rÃ©essayer.");
    return false;
  }
};

export const resumeProperty = async (propertyId: string) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('properties')
      .update({ status: 'free' })
      .eq('id', propertyId)
      .eq('user_id', user.id);

    if (error) throw error;
    toast.success("PropriÃ©tÃ© reprise avec succÃ¨s");
    return true;
  } catch (error) {
    console.error('Error resuming property:', error);
    toast.error("Ã‰chec de la reprise de la propriÃ©tÃ©. Veuillez rÃ©essayer.");
    return false;
  }
};


// ===== ANCILLARY SERVICES =====



export interface AncillaryService {
  id: string;
  property_id?: string | null;
  service_type: string;
  description?: string | null;
  estimated_cost?: number | null;
  provider_name?: string | null;
  provider_contact?: {
    phone?: string;
    email?: string;
    website?: string;
  } | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  requested_at?: string;
  scheduled_date?: string | null;
  completed_at?: string | null;
  is_active: boolean;
  start_date: string;
  end_date?: string | null;
  requested_by?: string | null;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const getMyAncillaryServices = async () => {
  try {
    // Use getSession() for more reliable check
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('ancillary_services')
      .select('*')
      .eq('requested_by', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AncillaryService[];
  } catch (error) {
    console.error('Error fetching ancillary services:', error);
    throw error;
  }
};

export const deleteAncillaryService = async (serviceId: string) => {
  try {
    const { error } = await supabase
      .from('ancillary_services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting ancillary service:', error);
    throw error;
  }
};

export const updateAncillaryServiceStatus = async (
  serviceId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
) => {
  try {
    const { error } = await supabase
      .from('ancillary_services')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', serviceId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating ancillary service status:', error);
    throw error;
  }
};



// ===== BILLING =====




export const startProUpgradeCheckout = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  console.log('[billing] startProUpgradeCheckout: user', {
    id: user.id,
    email: user.email,
  });

  const response = await fetch(`${getApiBase()}/api/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id, userEmail: user.email }),
  });

  console.log('[billing] create-checkout-session status', response.status);
  const json = await response.json().catch(() => ({} as any));
  console.log('[billing] create-checkout-session payload', json);
  if (!response.ok) {
    throw new Error(json?.error || `Unable to start checkout (status ${response.status})`);
  }

  const { url } = json as { url?: string };
  if (url) {
    window.location.href = url;
  } else {
    throw new Error('No checkout URL received');
  }
};




