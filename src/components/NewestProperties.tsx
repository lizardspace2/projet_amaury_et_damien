import { useEffect, useState } from "react";
import { Property } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import NavigationButton from "@/components/ui/navigation-button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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

const getNewestProperties = async (): Promise<Property[]> => {
  try {
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
    if (error?.code !== 'PGRST301' && error?.code !== '42501') {
      toast.error("Failed to fetch newest properties. Please try again.");
    }
    return [];
  }
};

const NewestProperties = () => {
  const navigate = useNavigate();
  const [visiblePropertiesCount, setVisiblePropertiesCount] = useState(6);

  console.log("Initializing NewestProperties component");

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['newest-properties'],
    queryFn: getNewestProperties,
  });

  // Debug logs
  useEffect(() => {
    console.log("Query state:", { isLoading, error });
    console.log("Properties data received:", properties);
    if (properties.length > 0) {
      console.log("First property details:", {
        beds: properties[0]?.beds,
        baths: properties[0]?.baths,
        m2: properties[0]?.m2 // Changé de sqft à m2
      });
    }
  }, [properties, isLoading, error]);

  return (
    <section className="py-12 bg-estate-neutral-50">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-estate-800">
            Les nouveautés
          </h2>
          <NavigationButton
            variant="link"
            onClick={() => navigate("/properties")}
            icon="right"
            className="text-estate-800 hover:text-teal-600 font-semibold"
          >
            Voir tout
          </NavigationButton>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Erreur: {error.message}</p>
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.slice(0, visiblePropertiesCount).map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  // showListingType prop removed as it's not a valid prop for PropertyCard
                />
              ))}
            </div>
            {visiblePropertiesCount < properties.length && (
              <div className="mt-8 text-center">
                <NavigationButton
                  variant="secondary"
                  onClick={() => setVisiblePropertiesCount(prevCount => prevCount + 6)}
                  size="lg"
                >
                  Voir plus
                </NavigationButton>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p>Aucune propriété trouvée.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewestProperties;
