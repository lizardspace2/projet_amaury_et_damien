// src/components/PropertyCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, Calendar, Pause, Play, Heart, Images, Camera } from "lucide-react";
import { Property } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import MissingImagePlaceholder from "@/components/ui/MissingImagePlaceholder";
import { useCurrency } from "@/CurrencyContext";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Property;
  isEditable?: boolean;
  variant?: 'gallery' | 'list'; // Add variant prop
  onEdit?: (propertyId: string) => void;
  onDelete?: (propertyId: string) => void;
  onPause?: (propertyId: string) => void;
  onResume?: (propertyId: string) => void;
}

const PropertyCard = ({ property, isEditable, variant = 'gallery', onEdit, onDelete, onPause, onResume }: PropertyCardProps) => {
  const { formatPrice } = useCurrency();

  const getFormattedDate = () => {
    try {
      if (typeof property.created_at === 'string') {
        return format(parseISO(property.created_at), 'MMM d, yyyy');
      }
      if (property.created_at instanceof Date) {
        return format(property.created_at, 'MMM d, yyyy');
      }
      return "Date non disponible";
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Date non disponible";
    }
  };

  // List variant - compact for sidebar
  if (variant === 'list') {
    return (
      <Link to={`/property/${property.id}`} className="block">
        <div className="bg-white hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="flex gap-3 p-3">
            {/* Compact image */}
            <div className="relative w-24 h-24 flex-shrink-0">
              {(!property.images || property.images.length === 0 || !property.images[0]) ? (
                <MissingImagePlaceholder className="w-full h-full object-cover" />
              ) : (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Compact badges */}
              <div className="absolute top-2 left-2 flex gap-1">
                {property.featured && property.status !== "pause" && (
                  <Badge className="bg-red-600 hover:bg-red-600 text-xs px-2 py-0.5">
                    EXCLUSIVITÉ
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-2 right-2">
                <button 
                  className="bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Heart size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Compact details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div className="flex-1">
                <p className="text-xs text-gray-500 truncate mb-1">
                  {property.property_type === "apartment" && "Appartement"}
                  {property.property_type === "house" && "Maison"}
                  {property.rooms && ` ${property.rooms} pièce${property.rooms > 1 ? 's' : ''}`}
                  {property.m2 && ` • ${property.m2} m²`}
                </p>

                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
                  {property.title}
                </h4>

                <p className="text-xs text-gray-600 truncate mb-2">
                  {property.code_postal} {property.address_city}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  {property.beds && property.beds > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed size={12} />
                      {property.beds}
                    </span>
                  )}
                  {property.baths && property.baths > 0 && (
                    <span className="flex items-center gap-1">
                      <Bath size={12} />
                      {property.baths}
                    </span>
                  )}
                  {property.m2 && (
                    <span className="flex items-center gap-1">
                      <Square size={12} />
                      {property.m2} m²
                    </span>
                  )}
                </div>
              </div>

              <p className="text-base font-bold text-gray-900 mt-2">
                {property.listing_type === "rent"
                  ? `${formatPrice(property.price)}/mois`
                  : formatPrice(property.price)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Gallery variant (default)
  return (
    <Link to={`/property/${property.id}`} className="block">
      <div className="property-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        {/* Property Image */}
        <div className="relative h-56 overflow-hidden group">
          {(!property.images || property.images.length === 0 || !property.images[0]) ? (
            <MissingImagePlaceholder className="w-full h-full object-cover" />
          ) : (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
          )}
          
          {/* Badges overlays */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.featured && property.status !== "pause" && (
              <Badge className="bg-red-600 hover:bg-red-600 font-semibold">
                EXCLUSIVITÉ
              </Badge>
            )}
            {property.status === "sold" && (
              <Badge className="bg-gray-800 hover:bg-gray-800 font-semibold">
                VENDU
              </Badge>
            )}
            {property.condition === "new" && (
              <Badge className="bg-green-600 hover:bg-green-600 font-semibold">
                NEUF
              </Badge>
            )}
          </div>
          
          {/* Action icons top right */}
          <div className="absolute top-3 right-3 flex gap-2">
            {property.images && property.images.length > 0 && (
              <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                <Images size={14} />
                {property.images.length}
              </div>
            )}
            {property.lien_visite_virtuelle && (
              <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                <Camera size={14} />
                360°
              </div>
            )}
          </div>
          
          {/* Favorite button */}
          <div className="absolute bottom-3 right-3">
            <button 
              className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4">
          {/* Title with property type */}
          <div className="mb-2">
            <p className="text-sm text-gray-600 font-medium">
              {property.property_type === "apartment" && "Appartement"}
              {property.property_type === "house" && "Maison"}
              {property.property_type === "land" && "Terrain"}
              {property.property_type === "commercial" && "Commercial"}
              {property.rooms && ` ${property.rooms} pièce${property.rooms > 1 ? 's' : ''}`}
              {property.m2 && ` • ${property.m2} m²`}
            </p>
          </div>

          {/* Price - Prominent */}
          <div className="mb-3">
            <p className="text-2xl font-bold text-estate-800">
              {property.listing_type === "rent"
                ? `${formatPrice(property.price)}/mois`
                : formatPrice(property.price)}
            </p>
            {property.price_per_m2 && (
              <p className="text-sm text-gray-600 mt-0.5">
                {property.price_per_m2.toLocaleString()} €/m²
              </p>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start text-gray-600 mb-3">
            <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0" />
            <p className="text-sm leading-tight">
              {property.code_postal && `${property.code_postal} `}
              {property.address_city}
              {property.address_district && ` • ${property.address_district}`}
            </p>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
            {property.beds && property.beds > 0 && (
              <div className="flex items-center text-gray-700">
                <Bed size={16} className="mr-1" />
                <span className="text-sm">{property.beds}</span>
              </div>
            )}
            {property.baths && property.baths > 0 && (
              <div className="flex items-center text-gray-700">
                <Bath size={16} className="mr-1" />
                <span className="text-sm">{property.baths}</span>
              </div>
            )}
            {property.m2 && (
              <div className="flex items-center text-gray-700">
                <Square size={16} className="mr-1" />
                <span className="text-sm">
                  {property.property_type === "land"
                    ? `${(property.m2 / 4046.86).toFixed(2)} acres`
                    : `${property.m2} m²`}
                </span>
              </div>
            )}
          </div>
        </div>
        {isEditable && (
          <div className="p-4 flex justify-between gap-2 border-t border-estate-neutral-100">
            <div className="flex gap-2">
              {property.status === "pause" ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    onResume?.(property.id);
                  }}
                  className="flex items-center gap-1"
                >
                  <Play size={14} />
                  Reprendre
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPause?.(property.id);
                  }}
                  className="flex items-center gap-1"
                >
                  <Pause size={14} />
                  Pause
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={(e) => {
                e.preventDefault();
                onEdit?.(property.id);
              }}>
                Modifier
              </Button>
              <Button variant="destructive" size="sm" onClick={(e) => {
                e.preventDefault();
                onDelete?.(property.id);
              }}>
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;