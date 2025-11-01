import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/PropertyCard";
import AncillaryServiceCard from "@/components/AncillaryServiceCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProperties, pauseProperty, resumeProperty, deleteProperty } from "@/lib/api";
import { getMyAncillaryServices, deleteAncillaryService, AncillaryService } from "@/lib/api";
import { Property } from "@/types/property";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { startProUpgradeCheckout } from "@/lib/api";
import { useAuth } from "@/AuthContext";

const MyAds: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*, max_listings')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

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

