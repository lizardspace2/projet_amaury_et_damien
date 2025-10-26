import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PropertyType, ListingType } from "@/types/property";
import { Search, Plus, Map, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  // Mot-clé (recherche)
  searchQuery: string;
  onSearchChange: (query: string) => void;
  
  // Type d'annonce
  listingType: ListingType;
  onListingTypeChange: (type: ListingType) => void;
  
  // Type de bien
  propertyTypes: PropertyType[];
  onPropertyTypesChange: (types: PropertyType[]) => void;
  
  // Budget
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  
  // Nombre de pièces
  minRooms: number;
  onRoomsChange: (rooms: number) => void;
  
  // Surface
  minM2: number;
  maxM2: number;
  onM2Change: (min: number, max: number) => void;
  
  // Plus de critères
  onShowMoreFilters?: () => void;
  
  // Mode d'affichage
  viewMode?: 'map' | 'gallery' | 'list';
  onViewModeChange?: (mode: 'map' | 'gallery' | 'list') => void;
  
  // Listing type pour la navigation
  currentListingType?: ListingType;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  listingType,
  onListingTypeChange,
  propertyTypes,
  onPropertyTypesChange,
  minPrice,
  maxPrice,
  onPriceChange,
  minRooms,
  onRoomsChange,
  minM2,
  maxM2,
  onM2Change,
  onShowMoreFilters,
  viewMode,
  onViewModeChange,
  currentListingType,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPath = window.location.pathname;
  const listingTypeOptions = [
    { value: "all" as ListingType, label: "Toutes les annonces" },
    { value: "sale" as ListingType, label: "À vendre" },
    { value: "rent" as ListingType, label: "À louer" },
    { value: "rent_by_day" as ListingType, label: "Location journalière" },
    { value: "lease" as ListingType, label: "Bail à céder" },
    { value: "auction" as ListingType, label: "Enchères" },
    { value: "viager" as ListingType, label: "Viager" },
    { value: "exceptional_property" as ListingType, label: "Biens d'exception" },
    { value: "remere" as ListingType, label: "Réméré" },
    { value: "vefa" as ListingType, label: "VEFA" },
    { value: "vente_a_terme" as ListingType, label: "Vente à terme" },
    { value: "remere_inverse" as ListingType, label: "Réméré inversé" },
    { value: "indivision_nue_propriete" as ListingType, label: "Indivision/Nue-propriété" },
    { value: "brs" as ListingType, label: "BRS" },
    { value: "demenbrement_temporaire" as ListingType, label: "Démembrement temporaire" },
    { value: "credit_vendeur" as ListingType, label: "Crédit-vendeur" },
    { value: "copropriete_lot_volume" as ListingType, label: "Copropriété/Lot de volume" },
  ];

  const propertyTypeOptions = [
    { value: "apartment" as PropertyType, label: "Appartement" },
    { value: "house" as PropertyType, label: "Maison" },
    { value: "land" as PropertyType, label: "Terrain" },
    { value: "commercial" as PropertyType, label: "Commercial" },
  ];

  const roomOptions = [0, 1, 2, 3, 4, 5, 6];

  const handlePropertyTypeToggle = (type: PropertyType) => {
    if (propertyTypes.includes(type)) {
      onPropertyTypesChange(propertyTypes.filter(t => t !== type));
    } else {
      onPropertyTypesChange([...propertyTypes, type]);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 relative z-50">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Mot-clé - Champ de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Mots-clés..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64 h-9"
          />
        </div>

        {/* Type d'annonce */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 text-sm">
              {listingTypeOptions.find(o => o.value === listingType)?.label || "Type d'annonce"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 z-[1000]" align="start">
            <div className="space-y-1">
              {listingTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onListingTypeChange(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                    listingType === option.value ? 'bg-blue-50 text-blue-700 font-medium' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Type de bien */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 text-sm">
              {propertyTypes.length === 0
                ? "Type de bien"
                : propertyTypes.length === 1
                ? propertyTypeOptions.find(o => o.value === propertyTypes[0])?.label
                : `${propertyTypes.length} types`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 z-[1000]" align="start">
            <div className="space-y-1">
              {propertyTypeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1.5"
                >
                  <input
                    type="checkbox"
                    checked={propertyTypes.includes(option.value)}
                    onChange={() => handlePropertyTypeToggle(option.value)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Budget */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 text-sm">
              {minPrice > 0 || maxPrice < 50000000 ? `Budget (${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} €)` : "Budget"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 z-[1000]" align="start">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Prix minimum</label>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
                  className="mt-1"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Prix maximum</label>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
                  className="mt-1"
                  placeholder="Prix max"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Nb de pièces */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 text-sm">
              {minRooms > 0 ? `${minRooms}+ pièces` : "Nb de pièces"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 z-[1000]" align="start">
            <div className="space-y-1">
              {roomOptions.map((rooms) => (
                <button
                  key={rooms}
                  onClick={() => onRoomsChange(rooms)}
                  className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                    minRooms === rooms ? 'bg-blue-50 text-blue-700 font-medium' : ''
                  }`}
                >
                  {rooms === 0 ? "Toutes" : `${rooms}+ pièces`}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Surface */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 text-sm">
              Surface {minM2 > 0 || maxM2 < 50000 ? `(${minM2} - ${maxM2} m²)` : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 z-[1000]" align="start">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Surface min (m²)</label>
                <Input
                  type="number"
                  value={minM2}
                  onChange={(e) => onM2Change(Number(e.target.value), maxM2)}
                  className="mt-1"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Surface max (m²)</label>
                <Input
                  type="number"
                  value={maxM2}
                  onChange={(e) => onM2Change(minM2, Number(e.target.value))}
                  className="mt-1"
                  placeholder="Prix max"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Plus de critères */}
        {onShowMoreFilters && (
          <Button
            variant="outline"
            className="h-9 px-4 text-sm"
            onClick={onShowMoreFilters}
          >
            <Plus size={16} className="mr-1" />
            Plus de critères
          </Button>
        )}

        {/* Boutons de mode d'affichage à droite */}
        <div className="ml-auto flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden">
          <Button
            variant={currentPath === '/map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/map')}
            className="rounded-none h-8 px-3"
            title="Vue Carte"
          >
            <Map size={16} />
          </Button>
          <Button
            variant={currentPath === '/properties' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              const type = currentListingType || listingType || 'all';
              navigate(`/properties?type=${type}`);
            }}
            className="rounded-none h-8 px-3 border-x border-gray-300"
            title="Vue Galerie/Liste"
          >
            <LayoutGrid size={16} />
          </Button>
          <Button
            variant={currentPath === '/properties' && viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              const type = currentListingType || listingType || 'all';
              navigate(`/properties?type=${type}`);
              onViewModeChange?.('list');
            }}
            className="rounded-none h-8 px-3"
            title="Vue Liste"
          >
            <List size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
