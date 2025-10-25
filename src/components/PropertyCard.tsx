// src/components/PropertyCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, Calendar, Pause, Play } from "lucide-react";
import { Property } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import MissingImagePlaceholder from "@/components/ui/MissingImagePlaceholder"; // Added import
import { useCurrency } from "@/CurrencyContext";
import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button"; // Added import

interface PropertyCardProps {
  property: Property;
  isEditable?: boolean;
  onEdit?: (propertyId: string) => void;
  onDelete?: (propertyId: string) => void;
  onPause?: (propertyId: string) => void;
  onResume?: (propertyId: string) => void;
}

const PropertyCard = ({ property, isEditable, onEdit, onDelete, onPause, onResume }: PropertyCardProps) => {
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

  return (
    <Link to={`/property/${property.id}`} className="block">
      <div className="property-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        {/* Property Image */}
        <div className="relative h-56 overflow-hidden">
          {(!property.images || property.images.length === 0 || !property.images[0]) ? (
            <MissingImagePlaceholder className="w-full h-full object-cover" />
          ) : (
            <img
              src={property.images[0]} // If check passes, images[0] is safe
              alt={property.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          )}
          <Badge className="absolute top-3 left-3 bg-teal-500 hover:bg-teal-500">
            {property.listing_type === "sale" ? "À vendre" : "À louer"}
          </Badge>
          {property.status === "pause" && (
            <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-500">
              En pause
            </Badge>
          )}
          {property.featured && property.status !== "pause" && (
            <Badge className="absolute top-3 right-3 bg-estate-800 hover:bg-estate-800">
              En vedette
            </Badge>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xl font-semibold text-estate-800 line-clamp-1">
              {property.title}
            </p>
          </div>

          <div className="flex items-center text-estate-neutral-600 mb-3">
            <MapPin size={14} className="mr-1" />
            <p className="text-sm line-clamp-1">
              {[property.address_street, property.address_district, property.address_city]
                .filter(Boolean)
                .join(', ') || 'Localisation non spécifiée'}
            </p>
          </div>

          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-bold text-estate-800">
              {property.listing_type === "rent"
                ? `${formatPrice(property.price)}/month`
                : formatPrice(property.price)}
            </p>
            <div className="flex items-center text-sm text-estate-neutral-500">
              <Calendar size={14} className="mr-1" />
              {getFormattedDate()}
            </div>
          </div>

          <div className="flex justify-between border-t border-estate-neutral-100 pt-3">
            {property.beds && property.beds > 0 && (
              <div className="flex items-center">
                <Bed size={18} className="mr-1 text-estate-neutral-500" />
                <span className="text-sm">{property.beds} Chambres</span>
              </div>
            )}
            {property.baths && property.baths > 0 && (
              <div className="flex items-center">
                <Bath size={18} className="mr-1 text-estate-neutral-500" />
                <span className="text-sm">
                  {property.baths} {property.baths === 1 ? "Salle de bain" : "Salles de bain"}
                </span>
              </div>
            )}
            {property.m2 &&
            <div className="flex items-center">
              <Square size={18} className="mr-1 text-estate-neutral-500" />
              <span className="text-sm">
                {property.property_type === "land"
                  ? `${(property.m2 / 4046.86).toFixed(2)} acres`
                  : `${property.m2} m²`}
              </span>
            </div>
            }
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