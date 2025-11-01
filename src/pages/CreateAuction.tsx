import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PropertyTypeStep from "@/components/property/add/PropertyTypeStep";
import AddPropertyStep1 from "@/components/property/add/AddPropertyStep1";
import AddPropertyStep2 from "@/components/property/add/AddPropertyStep2";
import AddPropertyStep3 from "@/components/property/add/AddPropertyStep3";
import AddPropertyStep4 from "@/components/property/add/AddPropertyStep4";
import StepsIndicator from "@/components/property/add/StepsIndicator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Wrapper } from "@googlemaps/react-wrapper";
import { PropertyType, ListingType, PropertyStatus, PropertyCondition, KitchenType } from "@/types/property";
import { Property } from "@/types/property";

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

const createProperty = async (input: CreatePropertyInput) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

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

    const totalImages = [...existingImageUrls, ...imageUrls];
    const nombre_photos = totalImages.length;

    if (totalImages.length === 0) {
      throw new Error('Au moins une photo est requise pour publier l\'annonce');
    }

    const date_publication = new Date().toISOString();

    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        ...restOfInput,
        user_id: user.id,
        images: totalImages,
        nombre_photos,
        date_publication,
      })
      .select()
      .single();

    if (propertyError) {
      console.error('Property insertion error:', propertyError);
      throw propertyError;
    }

    toast.success("Annonce immobilière créée avec succès !");
    return property;
  } catch (error) {
    console.error('Error creating property:', error);
    toast.error("Échec de la création de l'annonce immobilière. Veuillez réessayer.");
    throw error;
  }
};

const CreateAuctionPage = () => {
  const steps = [
    { number: 1, label: "Type de propriété" },
    { number: 2, label: "Informations de base" },
    { number: 3, label: "Caractéristiques" },
    { number: 4, label: "Localisation" },
    { number: 5, label: "Publier" }
  ];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreatePropertyInput>>({ listing_type: 'auction' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Require authentication - will redirect if not authenticated
  const { user, loading, initialized } = useRequireAuth();
  
  // Show loading state while checking auth
  if (loading || !initialized || !user) {
    return null; // Will redirect via useRequireAuth
  }

  const handleFinalSubmit = async (data: Partial<CreatePropertyInput>) => {
    try {
      setIsSubmitting(true);
      const finalData = {
        ...formData,
        ...data,
      };
      await createProperty(finalData as CreatePropertyInput);
      toast.success("Annonce de vente aux enchères créée avec succès !");
      navigate("/auctions");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erreur lors de la création de l'annonce.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background">
        <section className="relative py-16 bg-estate-800">
          <div className="container text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              Créer une vente aux enchères
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-200">
              Remplissez les informations ci-dessous pour publier votre annonce.
            </p>
          </div>
        </section>

        <section className="py-8 bg-white border-b">
          <div className="container">
            <StepsIndicator currentStep={step} steps={steps} />
          </div>
        </section>

        <section className="py-12 bg-slate-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-md">
                <CardContent className="p-6 md:p-8">
                  {step === 1 && (
                    <PropertyTypeStep
                      fixedListingType="auction"
                      onNext={(data) => {
                        setFormData({ ...formData, ...data });
                        setStep(2);
                      }}
                    />
                  )}

                  {step === 2 && (
                    <AddPropertyStep1
                      onBack={() => setStep(1)}
                      onNext={(data) => {
                        setFormData({ ...formData, ...data });
                        setStep(3);
                      }}
                    />
                  )}

                  {step === 3 && (
                    <AddPropertyStep2
                      onBack={() => setStep(2)}
                      onNext={(data) => {
                        setFormData({ ...formData, ...data });
                        setStep(4);
                      }}
                    />
                  )}

                  {step === 4 && (
                    <AddPropertyStep3
                      onBack={() => setStep(3)}
                      onNext={(data) => {
                        setFormData({ ...formData, ...data });
                        setStep(5);
                      }}
                    />
                  )}

                  {step === 5 && (
                    <AddPropertyStep4
                      onBack={() => setStep(4)}
                      initialData={formData}
                      isSubmitting={isSubmitting}
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

const CreateAuction = () => {
    const apiKey = "AIzaSyAjAs9O5AqVbaCZth-QDJm4KJfoq2ZzgUI";
    return (
        <Wrapper apiKey={apiKey} libraries={["places"]}>
            <CreateAuctionPage />
        </Wrapper>
    )
}

export default CreateAuction;
