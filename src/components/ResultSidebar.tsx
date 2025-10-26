import React from "react";
import { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";
import { LayoutGrid, List, Map, AlertCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultSidebarProps {
  properties: Property[];
  viewMode: 'map' | 'gallery' | 'list';
  onViewModeChange: (mode: 'map' | 'gallery' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onCreateAlert?: () => void;
}

const ResultSidebar: React.FC<ResultSidebarProps> = ({
  properties,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onCreateAlert,
}) => {
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'surface-asc':
        return (a.m2 || 0) - (b.m2 || 0);
      case 'surface-desc':
        return (b.m2 || 0) - (a.m2 || 0);
      case 'date-desc':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {properties.length} annonce{properties.length > 1 ? 's' : ''}
          </h3>
          
          {/* View mode switcher */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('map')}
              className="rounded-none h-8 px-3"
            >
              <Map size={16} />
            </Button>
            <Button
              variant={viewMode === 'gallery' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('gallery')}
              className="rounded-none h-8 px-3 border-x border-gray-300"
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-none h-8 px-3"
            >
              <List size={16} />
            </Button>
          </div>
        </div>

        {/* Sort and actions */}
        <div className="flex items-center justify-between gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 flex-1"
          >
            <option value="relevance">Pertinence</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="surface-asc">Surface croissante</option>
            <option value="surface-desc">Surface décroissante</option>
            <option value="date-desc">Plus récent</option>
          </select>

          {onCreateAlert && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateAlert}
              className="h-8 px-3 whitespace-nowrap"
            >
              <Bell size={14} className="mr-1" />
              Créer alerte
            </Button>
          )}
        </div>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto">
        {sortedProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium mb-2">Aucun résultat</p>
            <p className="text-gray-400 text-sm">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <div className="space-y-2 p-2">
                {sortedProperties.map((property, index) => (
                  <div key={property.id} className="border-b border-gray-100 last:border-0">
                    <PropertyCard property={property} variant="list" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 p-2">
                {sortedProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} variant="gallery" />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResultSidebar;
