import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Filter, X, RotateCcw } from 'lucide-react';
import { FilterState } from '@/contexts/SearchStateContext';
import { useCurrency } from '@/CurrencyContext';

interface FilterSortBarProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  className?: string;
}

const FilterSortBar: React.FC<FilterSortBarProps> = ({
  filters,
  onFiltersChange,
  onReset,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { formatPrice } = useCurrency();

  const sortOptions = [
    { value: 'globalrelevanceex', label: 'Pertinence' },
    { value: 'priceasc', label: 'Prix croissant' },
    { value: 'pricedesc', label: 'Prix décroissant' },
    { value: 'm2asc', label: 'Surface croissante' },
    { value: 'm2desc', label: 'Surface décroissante' },
    { value: 'dateasc', label: 'Plus ancien' },
    { value: 'datedesc', label: 'Plus récent' }
  ];

  const propertyTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'house', label: 'Maison' },
    { value: 'apartment', label: 'Appartement' },
    { value: 'land', label: 'Terrain' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const listingTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'sale', label: 'À vendre' },
    { value: 'rent', label: 'À louer' },
    { value: 'auction', label: 'Enchères' }
  ];

  const bedOptions = [
    { value: 0, label: 'Toutes' },
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
    { value: 5, label: '5+' }
  ];

  const bathOptions = [
    { value: 0, label: 'Toutes' },
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' }
  ];

  const hasActiveFilters = () => {
    return (
      filters.propertyType !== undefined ||
      filters.listingType !== undefined ||
      filters.priceMin !== undefined ||
      filters.priceMax !== undefined ||
      filters.m2Min !== undefined ||
      filters.m2Max !== undefined ||
      filters.beds !== undefined ||
      filters.baths !== undefined
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.propertyType && filters.propertyType !== 'all') count++;
    if (filters.listingType && filters.listingType !== 'all') count++;
    if (filters.priceMin && filters.priceMin > 0) count++;
    if (filters.priceMax && filters.priceMax < 50000000) count++;
    if (filters.m2Min && filters.m2Min > 0) count++;
    if (filters.m2Max && filters.m2Max < 50000) count++;
    if (filters.beds && filters.beds > 0) count++;
    if (filters.baths && filters.baths > 0) count++;
    return count;
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Barre principale */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres
              {hasActiveFilters() && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Trier par:</span>
              <Select
                value={filters.sort.value}
                onValueChange={(value) => onFiltersChange({ sort: { value } })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-2 text-gray-600"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Panneau des filtres */}
      {isOpen && (
        <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Type de propriété */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de propriété
              </label>
              <Select
                value={filters.propertyType || 'all'}
                onValueChange={(value) => onFiltersChange({ propertyType: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type d'annonce */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'annonce
              </label>
              <Select
                value={filters.listingType || 'all'}
                onValueChange={(value) => onFiltersChange({ listingType: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {listingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix: {formatPrice(filters.priceMin || 0)} - {formatPrice(filters.priceMax || 50000000)}
              </label>
              <div className="space-y-2">
                <Slider
                  value={[filters.priceMin || 0, filters.priceMax || 50000000]}
                  onValueChange={([min, max]) => onFiltersChange({ priceMin: min, priceMax: max })}
                  min={0}
                  max={50000000}
                  step={10000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0€</span>
                  <span>50M€</span>
                </div>
              </div>
            </div>

            {/* Surface */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface: {filters.m2Min || 0}m² - {filters.m2Max || 50000}m²
              </label>
              <div className="space-y-2">
                <Slider
                  value={[filters.m2Min || 0, filters.m2Max || 50000]}
                  onValueChange={([min, max]) => onFiltersChange({ m2Min: min, m2Max: max })}
                  min={0}
                  max={50000}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0m²</span>
                  <span>50,000m²</span>
                </div>
              </div>
            </div>

            {/* Chambres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chambres
              </label>
              <Select
                value={filters.beds?.toString() || '0'}
                onValueChange={(value) => onFiltersChange({ beds: parseInt(value) || undefined })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bedOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Salles de bain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salles de bain
              </label>
              <Select
                value={filters.baths?.toString() || '0'}
                onValueChange={(value) => onFiltersChange({ baths: parseInt(value) || undefined })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bathOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Fermer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSortBar;
