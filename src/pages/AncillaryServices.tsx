import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Wrapper } from "@googlemaps/react-wrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { AncillaryService } from "@/lib/api";
import AncillaryServiceCard from "@/components/AncillaryServiceCard";
import MovingSimulator from "@/components/MovingSimulator";
import WorksSimulator from "@/components/WorksSimulator";
import DiagnosticsSimulator from "@/components/DiagnosticsSimulator";
import CleaningSimulator from "@/components/CleaningSimulator";
import InsuranceSimulator from "@/components/InsuranceSimulator";
import FurnishingSimulator from "@/components/FurnishingSimulator";

const apiKey = "AIzaSyAjAs9O5AqVbaCZth-QDJm4KJfoq2ZzgUI";

const serviceTypeLabels: Record<string, string> = {
  demenagement: "Déménagement",
  travaux: "Travaux",
  diagnostic: "Diagnostic",
  nettoyage: "Nettoyage",
  assurance: "Assurance",
  amenagement: "Aménagement",
  courtier: "Courtier",
  notaire: "Notaire",
  banque: "Banque",
  artisan: "Artisan",
  gestionnaire_patrimoine: "Gestionnaire de patrimoine",
  geometre: "Géomètre",
  maitre_oeuvre: "Maître d’œuvre",
  architecte: "Architecte",
  amo: "Assistant maîtrise d’ouvrage",
  promoteur_lotisseur: "Promoteur / lotisseur",
  autre: "Autre"
};

const AncillaryServices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedType = searchParams.get('type') || 'all';
  const [services, setServices] = useState<AncillaryService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [selectedType]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('ancillary_services')
        .select('*')
        .eq('is_active', true) // Only show active services
        .order('created_at', { ascending: false });

      // Filter by type if specified and not 'all'
      if (selectedType && selectedType !== 'all') {
        query = query.eq('service_type', selectedType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === selectedType) return;
    setSearchParams({ type: value });
    setServices([]);
    setIsLoading(true);
  };

  return (
    <div>
      <Navbar />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-estate-800 mb-2">
            Services annexes
          </h1>
          {selectedType && selectedType !== 'all' && (
            <p className="text-lg text-estate-neutral-600">
              {serviceTypeLabels[selectedType] || selectedType}
            </p>
          )}
          {selectedType === 'all' && (
            <p className="text-lg text-estate-neutral-600">
              Toutes les annonces de services annexes
            </p>
          )}
        </div>

        <Tabs value={selectedType} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex w-full flex-wrap gap-2 mb-6">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            {[
              'demenagement',
              'travaux',
              'diagnostic',
              'nettoyage',
              'assurance',
              'amenagement',
              'courtier',
              'notaire',
              'banque',
              'artisan',
              'gestionnaire_patrimoine',
              'geometre',
              'maitre_oeuvre',
              'architecte',
              'amo',
              'promoteur_lotisseur',
              'autre',
            ].map((type) => (
              <TabsTrigger key={type} value={type}>
                {serviceTypeLabels[type] || type}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* TabsContent for "all" - shows all services without specific content */}
          <TabsContent value="all">
            <div className="py-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Chargement...</p>
                </div>
              ) : services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {services.map((service) => (
                    <AncillaryServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center border border-estate-neutral-200">
                  <p className="text-estate-neutral-600">
                    Aucun service disponible pour le moment.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {[
            'demenagement',
            'travaux',
            'diagnostic',
            'nettoyage',
            'assurance',
            'amenagement',
            'courtier',
            'notaire',
            'banque',
            'artisan',
            'gestionnaire_patrimoine',
            'geometre',
            'maitre_oeuvre',
            'architecte',
            'amo',
            'promoteur_lotisseur',
            'autre',
          ].map((type) => (
            <TabsContent key={type} value={type}>
              <div className="py-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <p>Chargement...</p>
                  </div>
                ) : (
                  <>
                    {services.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {services.map((service) => (
                          <AncillaryServiceCard key={service.id} service={service} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-8 text-center border border-estate-neutral-200 mb-8">
                        <p className="text-estate-neutral-600">
                          Aucun service disponible pour le moment.
                        </p>
                      </div>
                    )}
                    
                    {/* Special content for demenagement - always shown */}
                    {type === 'demenagement' && (
                      <Wrapper apiKey={apiKey} libraries={["places"]}>
                        <MovingSimulator apiKey={apiKey} />
                      </Wrapper>
                    )}
                    
                    {/* Special content for travaux - always shown */}
                    {type === 'travaux' && (
                      <WorksSimulator />
                    )}
                    
                    {/* Special content for diagnostic - always shown */}
                    {type === 'diagnostic' && (
                      <DiagnosticsSimulator />
                    )}
                    
                    {/* Special content for nettoyage - always shown */}
                    {type === 'nettoyage' && (
                      <CleaningSimulator />
                    )}
                    
                    {/* Special content for assurance - always shown */}
                    {type === 'assurance' && (
                      <InsuranceSimulator />
                    )}
                    
                    {/* Special content for amenagement - always shown */}
                    {type === 'amenagement' && (
                      <FurnishingSimulator />
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AncillaryServices;

