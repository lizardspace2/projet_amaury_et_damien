import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '@/lib/api/properties';
import { Property, ListingType } from '@/types/property';
import { MapBounds, FilterState } from '@/contexts/SearchStateContext';

interface UsePropertiesDataProps {
  bounds: MapBounds;
  filters: FilterState;
  page: number;
  pageSize: number;
  debounceMs?: number;
}

interface UsePropertiesDataReturn {
  properties: Property[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  refetch: () => void;
}

// Fonction pour vérifier si une propriété est dans les limites
const isPropertyInBounds = (property: Property, bounds: MapBounds): boolean => {
  if (!property.lat || !property.lng) return false;
  
  return property.lat >= bounds.south && 
         property.lat <= bounds.north && 
         property.lng >= bounds.west && 
         property.lng <= bounds.east;
};

// Fonction pour filtrer les propriétés selon les critères
const filterProperties = (properties: Property[], filters: FilterState): Property[] => {
  return properties.filter(property => {
    // Filtre par type de listing
    if (filters.listingType && filters.listingType !== 'all' && property.listing_type !== filters.listingType) {
      return false;
    }

    // Filtre par type de propriété
    if (filters.propertyType && filters.propertyType !== 'all' && property.property_type !== filters.propertyType) {
      return false;
    }

    // Filtre par prix
    if (filters.priceMin && property.price < filters.priceMin) {
      return false;
    }
    if (filters.priceMax && property.price > filters.priceMax) {
      return false;
    }

    // Filtre par surface
    if (filters.m2Min && property.m2 && property.m2 < filters.m2Min) {
      return false;
    }
    if (filters.m2Max && property.m2 && property.m2 > filters.m2Max) {
      return false;
    }

    // Filtre par nombre de chambres
    if (filters.beds && property.beds && property.beds < filters.beds) {
      return false;
    }

    // Filtre par nombre de salles de bain
    if (filters.baths && property.baths && property.baths < filters.baths) {
      return false;
    }

    return true;
  });
};

// Fonction pour trier les propriétés
const sortProperties = (properties: Property[], sortValue: string): Property[] => {
  const sorted = [...properties];
  
  switch (sortValue) {
    case 'priceasc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'pricedesc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'm2asc':
      return sorted.sort((a, b) => (a.m2 || 0) - (b.m2 || 0));
    case 'm2desc':
      return sorted.sort((a, b) => (b.m2 || 0) - (a.m2 || 0));
    case 'dateasc':
      return sorted.sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());
    case 'datedesc':
      return sorted.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
    case 'globalrelevanceex':
    default:
      // Tri par pertinence globale (prix, surface, date)
      return sorted.sort((a, b) => {
        const scoreA = (a.featured ? 1000 : 0) + (a.price / 1000) + (a.m2 || 0) / 10;
        const scoreB = (b.featured ? 1000 : 0) + (b.price / 1000) + (b.m2 || 0) / 10;
        return scoreB - scoreA;
      });
  }
};

export const usePropertiesData = ({
  bounds,
  filters,
  page,
  pageSize,
  debounceMs = 500
}: UsePropertiesDataProps): UsePropertiesDataReturn => {
  const [debouncedBounds, setDebouncedBounds] = useState(bounds);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce des paramètres de recherche
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedBounds(bounds);
      setDebouncedFilters(filters);
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [bounds, filters, debounceMs]);

  // Requête pour récupérer toutes les propriétés
  const { data: allProperties = [], isLoading, error, refetch } = useQuery<Property[]>({
    queryKey: ['properties', debouncedFilters.listingType],
    queryFn: () => getProperties(debouncedFilters.listingType as ListingType || 'all'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Traitement des données
  const processedData = useCallback(() => {
    if (!allProperties.length) return { properties: [], totalCount: 0 };

    // Filtrer par zone géographique
    const propertiesInBounds = allProperties.filter(property => 
      isPropertyInBounds(property, debouncedBounds)
    );

    // Appliquer les filtres
    const filteredProperties = filterProperties(propertiesInBounds, debouncedFilters);

    // Trier
    const sortedProperties = sortProperties(filteredProperties, debouncedFilters.sort.value);

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProperties = sortedProperties.slice(startIndex, endIndex);

    return {
      properties: paginatedProperties,
      totalCount: sortedProperties.length,
      hasNextPage: endIndex < sortedProperties.length,
      hasPreviousPage: page > 1
    };
  }, [allProperties, debouncedBounds, debouncedFilters, page, pageSize]);

  const { properties, totalCount, hasNextPage, hasPreviousPage } = processedData();

  return {
    properties,
    isLoading,
    error: error as Error | null,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    refetch
  };
};
