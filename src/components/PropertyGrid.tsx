import React from "react";
import { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyGridProps {
  properties: Property[];
  viewMode: 'gallery' | 'list';
  onViewModeChange: (mode: 'gallery' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
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
    <div>
      {/* Header with view controls and sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">{properties.length} annonce{properties.length > 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
          >
            <option value="relevance">Pertinence</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="surface-asc">Surface croissante</option>
            <option value="surface-desc">Surface décroissante</option>
            <option value="date-desc">Plus récent</option>
          </select>

          {/* View mode buttons */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'gallery' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('gallery')}
              className="rounded-none border-0"
            >
              <LayoutGrid size={18} className="mr-2" />
              Galerie
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-none border-0 border-l border-gray-300"
            >
              <List size={18} className="mr-2" />
              Liste
            </Button>
          </div>
        </div>
      </div>

      {/* Properties grid/list */}
      {sortedProperties.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Aucun résultat trouvé</p>
          <p className="text-gray-400 mt-2">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <>
          {viewMode === 'gallery' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} variant="gallery" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} variant="list" />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyGrid;
