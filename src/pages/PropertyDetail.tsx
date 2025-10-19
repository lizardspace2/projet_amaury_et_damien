import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "@/lib/api/properties";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertySpecs from "@/components/property/PropertySpecs";
import PropertyFeatures from "@/components/property/PropertyFeatures";
import PropertyAdditionalFeatures from "@/components/property/PropertyAdditionalFeatures";
import AgentContact from "@/components/property/AgentContact";
import PropertyMap from "@/components/PropertyMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Property } from "@/types/property";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError("ID de propriété manquant.");
        setLoading(false);
        return;
      }
      try {
        const data = await getPropertyById(id);
        if (data) {
          setProperty(data);
        } else {
          setError("Propriété non trouvée.");
        }
      } catch (err) {
        console.error("Erreur lors du chargement de la propriété:", err);
        setError("Erreur lors du chargement de la propriété.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-1 space-y-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-lg">{error}</p>
          <p className="text-lg">Cette propriété n'existe pas ou a été supprimée.</p>
          <a href="/properties" className="text-blue-600 hover:underline mt-4 block">Retour à la liste des propriétés</a>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Propriété non trouvée</h1>
          <p className="text-lg">Cette propriété n'existe pas ou a été supprimée.</p>
          <a href="/properties" className="text-blue-600 hover:underline mt-4 block">Retour à la liste des propriétés</a>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PropertyHeader property={property} />
        <div className="container mx-auto px-4 py-8">
          <PropertyGallery images={property.images} title={property.title} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{property.description}</p>
                </CardContent>
              </Card>

              <PropertySpecs property={property} />
              <PropertyFeatures property={property} />
              <PropertyAdditionalFeatures property={property} />

              <Card>
                <CardHeader>
                  <CardTitle>Localisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{property.address_street}, {property.address_district}, {property.address_city}</p>
                  {property.lat && property.lng && (
                    <div className="mt-4 h-96 w-full">
                      <PropertyMap
                        lat={property.lat}
                        lng={property.lng}
                        address={`${property.address_street}, ${property.address_city}`}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1 space-y-8">
              <AgentContact property={property} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
