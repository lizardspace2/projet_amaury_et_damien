import { supabase } from "@/lib/api/supabaseClient";
import { Property, PropertyType, ListingType, PropertyStatus, PropertyCondition, KitchenType } from "@/types/property";
import { toast } from "sonner";

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

    const { existingImageUrls, removedImageUrls, ...restOfInput } = input;

    // Calculate nombre_photos from the images array
    const totalImages = [...(input.existingImageUrls || []), ...imageUrls];
    const nombre_photos = totalImages.length;

    // Set date_publication to current timestamp
    const date_publication = new Date().toISOString();

    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        ...restOfInput,
        user_id: user.id,
        images: imageUrls,
        nombre_photos,
        date_publication,
      })
      .select()
      .single();

    if (propertyError) throw propertyError;

    toast.success("Annonce immobilière créée avec succès !");
    return property;
  } catch (error) {
    console.error('Error creating property:', error);
    toast.error("Échec de la création de l'annonce immobilière. Veuillez réessayer.");
    throw error;
  }
};

export const getProperties = async (type?: ListingType): Promise<Property[]> => {
  try {
    let query = supabase.from('properties').select('*');

    if (type && type !== 'all') {
      query = query.eq('listing_type', type);
    }

    const { data: properties, error } = await query;

    if (error) throw error;
    return properties.map(transformProperty);
  } catch (error) {
    console.error('Error fetching properties:', error);
    toast.error("Échec de la récupération des propriétés. Veuillez réessayer.");
    return [];
  }
};

export const getPropertiesByType = async (listingType: 'sale' | 'rent' | 'rent_by_day' | 'lease'): Promise<Property[]> => {
  return getProperties(listingType);
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('featured', true);

    if (error) throw error;
    return properties.map(transformProperty);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    toast.error("Échec de la récupération des propriétés en vedette. Veuillez réessayer.");
    return [];
  }
};

export const getMyProperties = async (): Promise<Property[]> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return properties.map(transformProperty);
  } catch (error) {
    console.error('Error fetching user properties:', error);
    toast.error("Échec de la récupération de vos propriétés. Veuillez réessayer.");
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

    toast.success("Propriété supprimée avec succès");
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    toast.error("Échec de la suppression de la propriété");
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

    toast.success("Annonce immobilière mise à jour avec succès !");
    return true;
  } catch (error) {
    console.error('Error updating property:', error);
    toast.error("Échec de la mise à jour de l'annonce immobilière. Veuillez réessayer.");
    throw error;
  }
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getNewestProperties = async (): Promise<Property[]> => {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;

    return properties.map(transformProperty);
  } catch (error) {
    console.error('Error fetching newest properties:', error);
    toast.error("Failed to fetch newest properties. Please try again.");
    return [];
  }
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!property) return null;

    return transformProperty(property);
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    toast.error("Échec de la récupération des détails de la propriété. Veuillez réessayer.");
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
    toast.success("Propriété mise en pause avec succès");
    return true;
  } catch (error) {
    console.error('Error pausing property:', error);
    toast.error("Échec de la mise en pause de la propriété. Veuillez réessayer.");
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
    toast.success("Propriété reprise avec succès");
    return true;
  } catch (error) {
    console.error('Error resuming property:', error);
    toast.error("Échec de la reprise de la propriété. Veuillez réessayer.");
    return false;
  }
};
