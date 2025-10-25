import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Layers, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '@/lib/api/properties';
import { Property, PropertyType, ListingType } from '@/types/property';
import OpenStreetMap from '@/components/OpenStreetMap';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Récupérer les paramètres de l'URL
  const searchParams = new URLSearchParams(location.search);
  const listingType = searchParams.get('type') as ListingType || 'all';

  // Récupérer les propriétés
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', listingType],
    queryFn: () => getProperties(listingType === 'all' ? undefined : listingType),
  });

  // Filtrer les propriétés selon le type sélectionné
  const filteredProperties = selectedType === 'all' 
    ? properties 
    : properties.filter(p => p.listing_type === selectedType);

  const propertyTypes = [
    { value: 'all', label: 'Toutes les propriétés', count: properties.length },
    { value: 'sale', label: 'À vendre', count: properties.filter(p => p.listing_type === 'sale').length },
    { value: 'rent', label: 'À louer', count: properties.filter(p => p.listing_type === 'rent').length },
    { value: 'auction', label: 'Enchères', count: properties.filter(p => p.listing_type === 'auction').length },
  ];

  const handlePropertyClick = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  const getPageTitle = () => {
    switch (listingType) {
      case 'sale': return 'Propriétés à vendre sur la carte';
      case 'rent': return 'Propriétés à louer sur la carte';
      case 'auction': return 'Enchères sur la carte';
      default: return 'Toutes les propriétés sur la carte';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-estate-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-estate-neutral-600">Chargement de la carte...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-estate-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-estate-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-teal-600" />
                <h1 className="text-2xl font-bold text-estate-800">
                  {getPageTitle()}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({filteredProperties.length} propriété{filteredProperties.length !== 1 ? 's' : ''})
                  </span>
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              {filteredProperties.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Cette fonction sera implémentée dans OpenStreetMap
                    (window as any).centerOnMarkers?.();
                  }}
                  className="flex items-center gap-2"
                >
                  <Layers className="h-4 w-4" />
                  Centrer sur les propriétés
                </Button>
              )}
              <div className="text-sm text-estate-neutral-600">
                {filteredProperties.length} propriété{filteredProperties.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Filtres latéraux */}
        {showFilters && (
          <div className="w-80 bg-white border-r border-estate-neutral-200 p-6 overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Filtrer par type
            </h3>
            <div className="space-y-2">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedType === type.value
                      ? 'bg-teal-50 border-teal-200 text-teal-700'
                      : 'bg-white border-estate-neutral-200 hover:bg-estate-neutral-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{type.label}</span>
                    <span className="text-sm text-estate-neutral-500 bg-estate-neutral-100 px-2 py-1 rounded-full">
                      {type.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-estate-neutral-50 rounded-lg">
              <h4 className="font-medium text-sm text-estate-neutral-700 mb-2">Conseils d'utilisation</h4>
              <ul className="text-xs text-estate-neutral-600 space-y-1">
                <li>• Cliquez sur un marqueur pour voir les détails</li>
                <li>• Utilisez la molette pour zoomer</li>
                <li>• Glissez pour naviguer sur la carte</li>
                <li>• Les couleurs indiquent le type de propriété</li>
              </ul>
            </div>
          </div>
        )}

        {/* Carte */}
        <div className="flex-1 relative">
          <OpenStreetMap
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
            center={[46.2276, 2.2137]}
            zoom={6}
            className="h-full w-full"
          />
          
          {/* Légende des marqueurs */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
            <h4 className="font-semibold text-sm mb-2">Légende</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                <span>Vente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                <span>Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
                <span>Enchères</span>
              </div>
            </div>
          </div>

          {/* Indicateur de statut */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
            <div className="text-sm">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Chargement...</span>
                </div>
              ) : (
                <div className="text-gray-700">
                  <div className="font-semibold">
                    {filteredProperties.length} propriété{filteredProperties.length !== 1 ? 's' : ''} affichée{filteredProperties.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-gray-500">
                    {filteredProperties.filter(p => p.lat && p.lng).length} avec coordonnées GPS
                  </div>
                  {filteredProperties.length > 0 && (
                    <div className="text-xs text-blue-600 mt-1">
                      {filteredProperties.filter(p => p.lat && p.lng).map(p => 
                        `${p.title}: ${p.lat?.toFixed(4)}, ${p.lng?.toFixed(4)}`
                      ).join(' | ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MapPage;
