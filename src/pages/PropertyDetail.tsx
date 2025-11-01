import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "@/lib/properties";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertySpecs from "@/components/property/PropertySpecs";
import PropertyDescription from "@/components/property/PropertyDescription";
import PropertyFeatures from "@/components/property/PropertyFeatures";
import PropertyAdditionalFeatures from "@/components/property/PropertyAdditionalFeatures";
import PropertyFinancialInfo from "@/components/property/PropertyFinancialInfo";
import DPEEnergyLabels from "@/components/property/DPEEnergyLabels";
import AgentContact from "@/components/property/AgentContact";
import PropertyMap from "@/components/PropertyMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import NavigationButton from "@/components/ui/navigation-button";
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
          <NavigationButton
            variant="link"
            href="/properties"
            className="text-blue-600 hover:text-teal-600 mt-4"
          >
            Retour à la liste des propriétés
          </NavigationButton>
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
          <NavigationButton
            variant="link"
            href="/properties"
            className="text-blue-600 hover:text-teal-600 mt-4"
          >
            Retour à la liste des propriétés
          </NavigationButton>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <PropertyHeader property={property} />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <PropertyGallery images={property.images} title={property.title} property={property} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <PropertySpecs property={property} />
              <PropertyDescription property={property} />
              <DPEEnergyLabels property={property} />
              <PropertyFinancialInfo property={property} />
              <PropertyFeatures property={property} />
              <PropertyAdditionalFeatures property={property} />

              <Card className="overflow-hidden shadow-md border-0">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Localisation</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-700 font-medium">
                      {property.address_street}, {property.address_district}, {property.address_city}
                    </p>
                  </div>
                  {property.lat && property.lng && (
                    <div className="mt-4 h-[450px] w-full rounded-lg overflow-hidden border border-gray-200">
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

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <AgentContact property={property} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
