import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchState } from '@/contexts/SearchStateContext';
import { usePropertiesData } from '@/hooks/usePropertiesData';
import MapContainer from '@/components/MapContainer';
import ListView from '@/components/ListView';
import FilterSortBar from '@/components/FilterSortBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MapPage = () => {
  const navigate = useNavigate();
  const {
    searchState,
    updateMapBounds,
    updateFilters,
    updatePagination,
    toggleMapVisibility,
    toggleListVisibility,
    resetToDefault
  } = useSearchState();

  // Récupérer les données des propriétés
  const {
    properties,
    isLoading,
    error,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    refetch
  } = usePropertiesData({
    bounds: searchState.mapBounds,
    filters: searchState.filterState,
    page: searchState.pagination.page,
    pageSize: searchState.pagination.pageSize,
    debounceMs: 500
  });

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  const handleMapViewChange = (bounds: any, zoom: number) => {
    updateMapBounds(bounds, zoom);
  };

  const handleFiltersChange = (filters: any) => {
    updateFilters(filters);
  };

  const handlePageChange = (page: number) => {
    updatePagination({ page });
  };

  const getPageTitle = () => {
    switch (searchState.filterState.listingType) {
      case 'sale': return 'Propriétés à vendre sur la carte';
      case 'rent': return 'Propriétés à louer sur la carte';
      case 'auction': return 'Enchères sur la carte';
      default: return 'Propriétés sur la carte';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
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
                <h1 className="text-2xl font-bold text-gray-800">
                  {getPageTitle()}
                </h1>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {totalCount} propriété{totalCount !== 1 ? 's' : ''} trouvée{totalCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Barre de filtres */}
      <FilterSortBar
        filters={searchState.filterState}
        onFiltersChange={handleFiltersChange}
        onReset={resetToDefault}
      />

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Liste des propriétés */}
        {searchState.isListVisible && (
          <ListView
            properties={properties}
            totalCount={totalCount}
            currentPage={searchState.pagination.page}
            pageSize={searchState.pagination.pageSize}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onPageChange={handlePageChange}
            onPropertyClick={handlePropertyClick}
            onToggleMapVisibility={toggleMapVisibility}
            isMapVisible={searchState.isMapVisible}
            isLoading={isLoading}
            className="w-96"
          />
        )}

        {/* Carte */}
        {searchState.isMapVisible && (
          <div className="flex-1 relative">
            <MapContainer
              bounds={searchState.mapBounds}
              zoom={searchState.mapZoom}
              properties={properties}
              onBoundsChange={handleMapViewChange}
              onPropertyClick={handlePropertyClick}
              isVisible={searchState.isMapVisible}
              className="h-full w-full"
            />
            
            {/* Légende des marqueurs */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
              <h4 className="font-semibold text-sm mb-2">Légende</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
                  <span>Vente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
                  <span>Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 border border-white"></div>
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
                      {totalCount} propriété{totalCount !== 1 ? 's' : ''} dans cette zone
                    </div>
                    <div className="text-xs text-gray-500">
                      {properties.filter(p => p.lat && p.lng).length} avec coordonnées GPS
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bouton pour afficher la liste si masquée */}
        {!searchState.isListVisible && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleListVisibility}
              className="bg-white shadow-lg"
            >
              Afficher la liste
            </Button>
          </div>
        )}

        {/* Bouton pour afficher la carte si masquée */}
        {!searchState.isMapVisible && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMapVisibility}
              className="bg-white shadow-lg"
            >
              Afficher la carte
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MapPage;