import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface MapBounds {
  west: number;
  east: number;
  south: number;
  north: number;
}

export interface FilterState {
  sort: {
    value: string;
  };
  propertyType?: string;
  listingType?: string;
  priceMin?: number;
  priceMax?: number;
  m2Min?: number;
  m2Max?: number;
  beds?: number;
  baths?: number;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface SearchQueryState {
  pagination: PaginationState;
  isMapVisible: boolean;
  mapBounds: MapBounds;
  filterState: FilterState;
  isListVisible: boolean;
  mapZoom: number;
}

interface SearchStateContextType {
  searchState: SearchQueryState;
  setSearchState: (state: SearchQueryState | ((prev: SearchQueryState) => SearchQueryState)) => void;
  updateMapBounds: (bounds: MapBounds, zoom?: number) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  updatePagination: (pagination: Partial<PaginationState>) => void;
  toggleMapVisibility: () => void;
  toggleListVisibility: () => void;
  resetToDefault: () => void;
}

const SearchStateContext = createContext<SearchStateContextType | undefined>(undefined);

// État par défaut (France entière)
const defaultSearchState: SearchQueryState = {
  pagination: { page: 1, pageSize: 20 },
  isMapVisible: true,
  mapBounds: {
    west: -5.5591,
    east: 9.6625,
    south: 41.3253,
    north: 51.1242
  },
  filterState: {
    sort: { value: 'globalrelevanceex' }
  },
  isListVisible: true,
  mapZoom: 6
};

// Fonction pour encoder l'état en URL
const encodeSearchState = (state: SearchQueryState): string => {
  return encodeURIComponent(JSON.stringify(state));
};

// Fonction pour décoder l'état depuis l'URL
const decodeSearchState = (encoded: string): SearchQueryState | null => {
  try {
    const decoded = decodeURIComponent(encoded);
    const parsed = JSON.parse(decoded);
    
    // Valider que l'objet a la structure attendue
    if (parsed && typeof parsed === 'object' && 
        parsed.mapBounds && parsed.filterState && parsed.pagination) {
      return parsed as SearchQueryState;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors du décodage de l\'état de recherche:', error);
    return null;
  }
};

interface SearchStateProviderProps {
  children: ReactNode;
}

export const SearchStateProvider: React.FC<SearchStateProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState<SearchQueryState>(defaultSearchState);

  // Charger l'état depuis l'URL au montage
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQueryState = searchParams.get('searchQueryState');
    
    if (searchQueryState) {
      const decodedState = decodeSearchState(searchQueryState);
      if (decodedState) {
        setSearchState(decodedState);
      }
    }
  }, [location.search]);

  // Synchroniser l'état avec l'URL
  useEffect(() => {
    const encodedState = encodeSearchState(searchState);
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('searchQueryState', encodedState);
    
    const newUrl = `${location.pathname}?${currentParams.toString()}`;
    if (newUrl !== location.pathname + location.search) {
      navigate(newUrl, { replace: true });
    }
  }, [searchState, location.pathname, location.search, navigate]);

  // Fonctions de mise à jour
  const updateMapBounds = (bounds: MapBounds, zoom?: number) => {
    setSearchState(prev => ({
      ...prev,
      mapBounds: bounds,
      mapZoom: zoom ?? prev.mapZoom,
      pagination: { ...prev.pagination, page: 1 } // Reset page on map change
    }));
  };

  const updateFilters = (filters: Partial<FilterState>) => {
    setSearchState(prev => ({
      ...prev,
      filterState: { ...prev.filterState, ...filters },
      pagination: { ...prev.pagination, page: 1 } // Reset page on filter change
    }));
  };

  const updatePagination = (pagination: Partial<PaginationState>) => {
    setSearchState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, ...pagination }
    }));
  };

  const toggleMapVisibility = () => {
    setSearchState(prev => ({
      ...prev,
      isMapVisible: !prev.isMapVisible
    }));
  };

  const toggleListVisibility = () => {
    setSearchState(prev => ({
      ...prev,
      isListVisible: !prev.isListVisible
    }));
  };

  const resetToDefault = () => {
    setSearchState(defaultSearchState);
  };

  const contextValue: SearchStateContextType = {
    searchState,
    setSearchState,
    updateMapBounds,
    updateFilters,
    updatePagination,
    toggleMapVisibility,
    toggleListVisibility,
    resetToDefault
  };

  return (
    <SearchStateContext.Provider value={contextValue}>
      {children}
    </SearchStateContext.Provider>
  );
};

export const useSearchState = (): SearchStateContextType => {
  const context = useContext(SearchStateContext);
  if (context === undefined) {
    throw new Error('useSearchState must be used within a SearchStateProvider');
  }
  return context;
};
