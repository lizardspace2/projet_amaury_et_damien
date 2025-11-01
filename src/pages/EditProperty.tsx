import { Loader2 } from "lucide-react"; // Added Loader2 import
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { Property } from '@/types/property';
import { supabase } from '@/lib/supabase';
import { PropertyType, ListingType, PropertyStatus, PropertyCondition, KitchenType } from '@/types/property';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PropertyTypeStep from "@/components/property/add/PropertyTypeStep";
import AddPropertyStep1 from "@/components/property/add/AddPropertyStep1";
import AddPropertyStep2 from "@/components/property/add/AddPropertyStep2";
import AddPropertyStep3 from "@/components/property/add/AddPropertyStep3";
import AddPropertyStep4 from "@/components/property/add/AddPropertyStep4";
import StepsIndicator from "@/components/property/add/StepsIndicator";
import { useRequireAuth } from '@/hooks/useRequireAuth';

// ===== TYPES & INTERFACES =====

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

// ===== API FUNCTIONS =====

const transformProperty = (property: any): Property => {
  const transformed = { ...property };
  
  if (typeof transformed.price === 'string') {
    transformed.price = parseFloat(transformed.price) || 0;
  }
  
  if (typeof transformed.m2 === 'string') {
    transformed.m2 = parseFloat(transformed.m2) || 0;
  }
  
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

export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
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
    if (error?.code !== 'PGRST301' && error?.code !== '42501' && error?.code !== 'PGRST116') {
      toast.error("Échec de la récupération des détails de la propriété. Veuillez réessayer.");
    }
    return null;
  }
};

export const updateProperty = async (propertyId: string, input: Partial<CreatePropertyInput>) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    let newImageUrls: string[] = input.existingImageUrls || [];

    if (input.removedImageUrls && input.removedImageUrls.length > 0) {
      const pathsToRemove = input.removedImageUrls.map(url => url.substring(url.lastIndexOf('/') + 1));
      await supabase.storage.from('property_images').remove(pathsToRemove);
    }

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

    const nombre_photos = newImageUrls.length;

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

const EditProperty = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Require authentication - will redirect if not authenticated
  const { user, loading: authLoading, initialized } = useRequireAuth();

  const steps = [
    { number: 1, label: "Type d'annonce" },
    { number: 2, label: "Informations de base" },
    { number: 3, label: "Caractéristiques" },
    { number: 4, label: "Localisation" },
    { number: 5, label: "Publier" }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreatePropertyInput>>({});

  // Show loading state while checking auth
  if (authLoading || !initialized || !user) {
    return null; // Will redirect via useRequireAuth
  }

  const { data: fetchedProperty, isLoading, isError, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => getPropertyById(propertyId!),
    enabled: !!propertyId,
  });

  useEffect(() => {
    if (fetchedProperty) {
      setFormData({
        ...fetchedProperty,
        existingImageUrls: fetchedProperty.images,
      });
    } else if (isError) {
      toast.error("Failed to load property for editing.");
      console.error("Error fetching property:", error);
      navigate('/account'); // Redirect if property not found or error
    }
  }, [fetchedProperty, isError, error, navigate]);

  const updatePropertyMutation = useMutation({
    mutationFn: (data: { propertyId: string, input: Partial<CreatePropertyInput> }) =>
      updateProperty(data.propertyId, data.input),
    onSuccess: () => {
      toast.success("Annonce immobilière mise à jour avec succès !");
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      navigate('/account');
    },
    onError: (err) => {
      toast.error("Échec de la mise à jour de l'annonce immobilière.");
      console.error("Error updating property:", err);
    },
  });

  const handleNext = (data: Partial<CreatePropertyInput> & { existingImageUrls?: string[], removedImageUrls?: string[] }) => {
    setFormData(prev => ({
      ...prev,
      ...data,
      images: data.images || prev.images,
      existingImageUrls: data.existingImageUrls || prev.existingImageUrls,
      removedImageUrls: data.removedImageUrls || prev.removedImageUrls,
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFinalSubmit = async (data: Partial<CreatePropertyInput> & { existingImageUrls?: string[], removedImageUrls?: string[] }) => {
    if (!propertyId) {
      toast.error("Property ID is missing.");
      return;
    }

    const finalFormData = {
      ...formData,
      ...data,
    };

    updatePropertyMutation.mutate({ propertyId, input: finalFormData });
  };

  // Show loading state while checking authentication
  if (authLoading || !initialized) {
    return (
      <div>
        <Navbar />
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Chargement...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container py-8 text-center">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Chargement des détails de la propriété...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!fetchedProperty) {
    return (
      <div>
        <Navbar />
        <div className="container py-8 text-center">
          <p>Property not found or an error occurred.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background">
        <section className="relative py-16 bg-estate-800">
          <div className="container text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              {"Modifier l'annonce immobilière"}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-200">
              {"Mettez à jour les informations de votre annonce."}
            </p>
          </div>
        </section>

        <section className="py-8 bg-white border-b">
          <div className="container">
            <StepsIndicator currentStep={currentStep} steps={steps} />
          </div>
        </section>

        <section className="py-12 bg-slate-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-md">
                <CardContent className="p-6 md:p-8">
                  {currentStep === 1 && (
                    <PropertyTypeStep
                      initialData={formData}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 2 && (
                    <AddPropertyStep1
                      initialData={formData}
                      onBack={handleBack}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 3 && (
                    <AddPropertyStep2
                      initialData={formData}
                      onBack={handleBack}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 4 && (
                    <AddPropertyStep3
                      initialData={formData}
                      onBack={handleBack}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 5 && (
                    <AddPropertyStep4
                      initialData={formData}
                      onBack={handleBack}
                      isSubmitting={updatePropertyMutation.isPending}
                      onNext={handleFinalSubmit}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default EditProperty;
