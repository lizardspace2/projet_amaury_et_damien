import React, { useState } from "react";
import { PropertyType, ListingType } from "@/types/property";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterPanelProps {
  listingType: ListingType;
  onListingTypeChange: (type: ListingType) => void;
  propertyTypes: PropertyType[];
  onPropertyTypesChange: (types: PropertyType[]) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  minBeds: number;
  onBedsChange: (beds: number) => void;
  minBaths: number;
  onBathsChange: (baths: number) => void;
  minM2: number;
  maxM2: number;
  onM2Change: (min: number, max: number) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  listingType,
  onListingTypeChange,
  propertyTypes,
  onPropertyTypesChange,
  minPrice,
  maxPrice,
  onPriceChange,
  minBeds,
  onBedsChange,
  minBaths,
  onBathsChange,
  minM2,
  maxM2,
  onM2Change,
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const listingTypeOptions: Array<{ value: ListingType; label: string }> = [
    { value: "all", label: "Toutes les annonces" },
    { value: "sale", label: "À vendre" },
    { value: "rent", label: "À louer" },
    { value: "rent_by_day", label: "Location journalière" },
    { value: "auction", label: "Enchères" },
  ];

  const propertyTypeOptions: Array<{ value: PropertyType; label: string }> = [
    { value: "apartment", label: "Appartement" },
    { value: "house", label: "Maison" },
    { value: "land", label: "Terrain" },
    { value: "commercial", label: "Commercial" },
  ];

  const bedOptions = [1, 2, 3, 4, 5];
  const bathOptions = [1, 2, 3, 4, 5];

  const handlePropertyTypeToggle = (type: PropertyType) => {
    if (propertyTypes.includes(type)) {
      onPropertyTypesChange(propertyTypes.filter(t => t !== type));
    } else {
      onPropertyTypesChange([...propertyTypes, type]);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Type d'annonce */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 text-sm">
              {listingType === "all" ? "Type d'annonce" : listingTypeOptions.find(o => o.value === listingType)?.label}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              {listingTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onListingTypeChange(option.value)}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
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
                : `${propertyTypes.length} types de biens`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              {propertyTypeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={propertyTypes.includes(option.value)}
                    onChange={() => handlePropertyTypeToggle(option.value)}
                    className="w-4 h-4 text-blue-600"
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
              Budget {minPrice > 0 || maxPrice < 1000000000 ? `(${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} €)` : ''}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div>
                <Label htmlFor="min-price" className="text-sm font-medium">Prix minimum</Label>
                <Input
                  id="min-price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="max-price" className="text-sm font-medium">Prix maximum</Label>
                <Input
                  id="max-price"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Nombre de pièces */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 text-sm">
              {minBeds > 0 ? `${minBeds}+ pièces` : "Nb de pièces"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              <button
                onClick={() => onBedsChange(0)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                  minBeds === 0 ? 'bg-blue-50 text-blue-700 font-medium' : ''
                }`}
              >
                Tous
              </button>
              {bedOptions.map((beds) => (
                <button
                  key={beds}
                  onClick={() => onBedsChange(beds)}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    minBeds === beds ? 'bg-blue-50 text-blue-700 font-medium' : ''
                  }`}
                >
                  {beds}+ pièces
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Nombre de salles de bain */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 text-sm">
              {minBaths > 0 ? `${minBaths}+ salles de bain` : "Salles de bain"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              <button
                onClick={() => onBathsChange(0)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                  minBaths === 0 ? 'bg-blue-50 text-blue-700 font-medium' : ''
                }`}
              >
                Tous
              </button>
              {bathOptions.map((baths) => (
                <button
                  key={baths}
                  onClick={() => onBathsChange(baths)}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    minBaths === baths ? 'bg-blue-50 text-blue-700 font-medium' : ''
                  }`}
                >
                  {baths}+ salles de bain
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Surface */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 text-sm">
              Surface {minM2 > 0 || maxM2 < 100000 ? `(${minM2} - ${maxM2} m²)` : ''}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div>
                <Label htmlFor="min-m2" className="text-sm font-medium">Surface minimum (m²)</Label>
                <Input
                  id="min-m2"
                  type="number"
                  value={minM2}
                  onChange={(e) => onM2Change(Number(e.target.value), maxM2)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="max-m2" className="text-sm font-medium">Surface maximum (m²)</Label>
                <Input
                  id="max-m2"
                  type="number"
                  value={maxM2}
                  onChange={(e) => onM2Change(minM2, Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Show more filters button */}
        {!showMoreFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreFilters(true)}
            className="h-9 px-3 text-sm"
          >
            <Plus size={16} className="mr-1" />
            Plus de critères
          </Button>
        )}
      </div>

      {/* More filters panel */}
      {showMoreFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Critères avancés</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreFilters(false)}
              className="h-8"
            >
              <X size={16} />
            </Button>
          </div>
          {/* Add more advanced filters here */}
          <div className="text-sm text-gray-500">
            Filtres avancés à venir (Année, DPE, GES, etc.)
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
