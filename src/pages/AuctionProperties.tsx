import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Property, ListingType } from "@/types/property";
import { useUserLikedProperties } from "@/hooks/useUserProfile";

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

const getProperties = async (type?: ListingType): Promise<Property[]> => {
  try {
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
    if (error?.code !== 'PGRST301' && error?.code !== '42501') {
      toast.error("Échec de la récupération des propriétés. Veuillez réessayer.");
    }
    return [];
  }
};

const AuctionProperties = () => {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', 'auction'],
    queryFn: () => getProperties('auction'),
  });

  // Load user liked properties using custom hook
  const userLikedProperties = useUserLikedProperties();

  return (
    <div className="flex flex-col min-h-screen bg-estate-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Ventes aux enchères</h1>
          <Button asChild>
            <Link to="/create-auction">Créer une vente aux enchères</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="animate-pulse">
                  <div className="bg-gray-300 h-48 w-full rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                isLiked={userLikedProperties.includes(property.id)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AuctionProperties;
