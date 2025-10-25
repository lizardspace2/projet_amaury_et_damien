import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUserProfile } from "@/lib/profiles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/PropertyCard";
import { useQuery } from "@tanstack/react-query";
import { getMyProperties, pauseProperty, resumeProperty } from "@/lib/api/properties";
import { Property } from "@/types/property";
import { supabase } from "@/lib/api/supabaseClient";
import { toast } from "sonner";
import { handleAuthError } from "@/lib/api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProperty } from "@/lib/api/properties";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Account = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Check for auth errors in hash
    if (location.hash) {
      handleAuthError(location.hash);
    }
  }, [location]);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: myProperties = [], isLoading: loadingMyProperties } = useQuery({
    queryKey: ['my-properties'],
    queryFn: getMyProperties,
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

  const confirmDelete = () => {
    if (propertyToDelete) {
      deletePropertyMutation.mutate(propertyToDelete);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-estate-800 flex items-center justify-center text-white text-2xl">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-estate-800">
              {user?.user_metadata?.full_name || "Mon compte"}
            </h1>
            <p className="text-estate-neutral-600">
              {user?.email}
            </p>
          </div>
        </div>

        <Tabs defaultValue="published" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="published">{"Mes annonces"}</TabsTrigger>
          </TabsList>

          <TabsContent value="published">
            <div className="py-4">
              <h2 className="text-xl font-semibold mb-4">{"Mes annonces publiées"}</h2>

              {loadingMyProperties ? (
                <div className="flex justify-center py-8">
                  <p>{"Chargement..."}</p>
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
                    {"Vous n'avez pas encore publié d'annonces."}
                  </p>
                  <a
                    href="/sell"
                    className="text-teal-500 hover:text-teal-600 font-medium mt-2 inline-block"
                  >
                    {"Publier une annonce"}
                  </a>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

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

export default Account;