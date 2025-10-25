import React from 'react';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MapPin, Eye, EyeOff } from 'lucide-react';

interface ListViewProps {
  properties: Property[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onPropertyClick: (property: Property) => void;
  onToggleMapVisibility: () => void;
  isMapVisible: boolean;
  isLoading?: boolean;
  className?: string;
}

const ListView: React.FC<ListViewProps> = ({
  properties,
  totalCount,
  currentPage,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onPropertyClick,
  onToggleMapVisibility,
  isMapVisible,
  isLoading = false,
  className = "h-full w-full"
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className={`flex flex-col bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Résultats de recherche
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleMapVisibility}
            className="flex items-center gap-2"
          >
            {isMapVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {isMapVisible ? 'Masquer' : 'Afficher'} la carte
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Chargement...</span>
            </div>
          ) : (
            <p>
              {totalCount > 0 ? (
                <>
                  {startIndex}-{endIndex} sur {totalCount} propriété{totalCount !== 1 ? 's' : ''}
                </>
              ) : (
                'Aucune propriété trouvée'
              )}
            </p>
          )}
        </div>
      </div>

      {/* Liste des propriétés */}
      <div className="flex-1 overflow-y-auto">
        {properties.length > 0 ? (
          <div className="p-4 space-y-4">
            {properties.map((property) => (
              <div 
                key={property.id} 
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onPropertyClick(property)}
              >
                <PropertyCard
                  property={property}
                  onPropertyClick={onPropertyClick}
                />
              </div>
            ))}
          </div>
        ) : !isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Aucune propriété trouvée</p>
            <p className="text-sm">
              Essayez de modifier vos critères de recherche ou de déplacer la carte
            </p>
          </div>
        ) : null}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPreviousPage || isLoading}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                      disabled={isLoading}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage || isLoading}
                className="flex items-center gap-1"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListView;
