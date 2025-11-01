import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/PropertyCard";
import AncillaryServiceCard from "@/components/AncillaryServiceCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Property } from "@/types/property";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getApiBase } from "@/lib/utils";

// ===== TYPES & INTERFACES =====

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

export const getMyProperties = async (): Promise<Property[]> => {
  try {
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
    toast.error("Échec de la récupération de vos propriétés. Veuillez réessayer.");
    return [];
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

export const deleteProperty = async (propertyId: string) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    const { data: property, error: fetchError } = await supabase
      .from('properties')
      .select('images')
      .eq('id', propertyId)
      .single();

    if (fetchError) throw fetchError;

    if (property?.images && property.images.length > 0) {
      const imagePaths = property.images.map(url => url.substring(url.lastIndexOf('/') + 1));
      const { error: storageError } = await supabase.storage.from('property_images').remove(imagePaths);
      if (storageError) {
        console.error("Error deleting images from storage:", storageError);
      }
    }
    
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

export const getMyAncillaryServices = async () => {
  try {
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

const startProUpgradeCheckout = async (): Promise<void> => {
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

const MyAds: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  // Use custom hook for profile
  const { data: profile } = useUserProfile();

  const { data: monthlyCount } = useQuery({
    queryKey: ['my-properties-monthly-count'],
    queryFn: async () => {
      if (!user) return 0;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count, error } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', now.toISOString());
      if (error) return 0;
      return count || 0;
    },
    enabled: !!user
  });

  const { data: myProperties = [], isLoading: loadingMyProperties } = useQuery({
    queryKey: ['my-properties'],
    queryFn: getMyProperties,
  });

  const { data: myAncillaryServices = [], isLoading: loadingAncillaryServices } = useQuery({
    queryKey: ['my-ancillary-services'],
    queryFn: getMyAncillaryServices,
  });

  const deletePropertyMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      toast.success("Propriété supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    },
    onError: (error) => {
      toast.error("Échec de la suppression de la propriété");
      console.error("Error deleting property:", error);
    },
  });

  const pausePropertyMutation = useMutation({
    mutationFn: pauseProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
    },
    onError: (error) => {
      console.error("Error pausing property:", error);
    },
  });

  const resumePropertyMutation = useMutation({
    mutationFn: resumeProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
    },
    onError: (error) => {
      console.error("Error resuming property:", error);
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: deleteAncillaryService,
    onSuccess: () => {
      toast.success("Service annexe supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ['my-ancillary-services'] });
    },
    onError: (error) => {
      toast.error("Échec de la suppression du service");
      console.error("Error deleting service:", error);
    },
  });

  const handleEdit = (propertyId: string) => {
    navigate(`/edit-property/${propertyId}`);
  };

  const handleDelete = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setIsDeleteDialogOpen(true);
  };

  const handlePause = (propertyId: string) => {
    pausePropertyMutation.mutate(propertyId);
  };

  const handleResume = (propertyId: string) => {
    resumePropertyMutation.mutate(propertyId);
  };

  const handleDeleteService = (serviceId: string) => {
    deleteServiceMutation.mutate(serviceId);
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      deletePropertyMutation.mutate(propertyToDelete);
    }
  };

  return (
    <div className="py-4">
      {profile?.user_type === 'Professionnelle' && (
        <div className="mb-6 rounded-md border border-amber-200 p-4 bg-amber-50">
          <div className="flex items-center justify-between gap-3">
            <div className="w-full">
              <p className="font-semibold text-amber-900">Quota d'annonces mensuel</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{monthlyCount ?? 0}/{profile?.max_listings ?? 50}</Badge>
                <span className="text-sm text-amber-700">
                  {Math.max(0, (profile?.max_listings ?? 50) - (monthlyCount ?? 0))} restantes
                </span>
              </div>
              <div className="mt-2 max-w-sm">
                <Progress value={Math.min(100, Math.round(((monthlyCount ?? 0) / (profile?.max_listings ?? 50)) * 100))} />
              </div>
            </div>
            {(profile?.max_listings ?? 50) < 500 && (
              <Button onClick={async () => {
                try { await startProUpgradeCheckout(); } catch (e: any) { toast.error(e?.message || 'Impossible de démarrer le paiement'); }
              }} className="bg-amber-600 hover:bg-amber-700 whitespace-nowrap">Passer à Pro+ (29,99 € / mois)</Button>
            )}
          </div>
        </div>
      )}
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties">Mes annonces immobilières</TabsTrigger>
          <TabsTrigger value="services">Mes annonces de services</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <div className="py-4">
            <h2 className="text-xl font-semibold mb-4">Mes annonces immobilières</h2>

            {loadingMyProperties ? (
              <div className="flex justify-center py-8">
                <p>Chargement...</p>
              </div>
            ) : myProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties.map((property: Property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isEditable={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPause={handlePause}
                    onResume={handleResume}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center border border-estate-neutral-200">
                <p className="text-estate-neutral-600">
                  Vous n'avez pas encore publié de propriété immobilière.
                </p>
                <a
                  href="/sell"
                  className="text-teal-500 hover:text-teal-600 font-medium mt-2 inline-block"
                >
                  Publier une annonce immobilière
                </a>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="py-4">
            <h2 className="text-xl font-semibold mb-4">Mes services annexes</h2>

            {loadingAncillaryServices ? (
              <div className="flex justify-center py-8">
                <p>Chargement...</p>
              </div>
            ) : myAncillaryServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myAncillaryServices.map((service: AncillaryService) => (
                  <AncillaryServiceCard
                    key={service.id}
                    service={service}
                    onDelete={handleDeleteService}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center border border-estate-neutral-200">
                {profile?.user_type === 'Particulier' ? (
                  <>
                    <p className="text-estate-neutral-600 mb-4">
                      La publication de services annexes est réservée aux professionnels et partenaires.
                    </p>
                    <a
                      href="/ancillary-services"
                      className="text-amber-500 hover:text-amber-600 font-medium inline-block"
                    >
                      Consulter les annonces de services →
                    </a>
                  </>
                ) : (
                  <>
                    <p className="text-estate-neutral-600">
                      Vous n'avez pas encore publié de service annexe.
                    </p>
                    <a
                      href="/sell/ancillary-service"
                      className="text-amber-500 hover:text-amber-600 font-medium mt-2 inline-block"
                    >
                      Publier un service annexe
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement votre annonce immobilière de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continuer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyAds;

