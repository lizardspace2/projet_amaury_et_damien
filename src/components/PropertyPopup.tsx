import React, { useState } from 'react';
import { Heart, MapPin, Bed, Bath, Square, Calendar, Building, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';

interface PropertyPopupProps {
  property: Property;
  onClose: () => void;
  onPropertyClick: (property: Property) => void;
  onToggleFavorite?: (propertyId: string) => void;
  isFavorite?: boolean;
  formatPrice: (price: number) => string;
  className?: string;
}

const PropertyPopup: React.FC<PropertyPopupProps> = ({
  property,
  onClose,
  onPropertyClick,
  onToggleFavorite,
  isFavorite = false,
  formatPrice,
  className = ""
}) => {
  const [isFavorited, setIsFavorited] = useState(isFavorite);

  // Calculer le nombre de jours sur le marché
  const getDaysOnMarket = (createdAt?: string) => {
    if (!createdAt) return 0;
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Obtenir l'image principale
  const getMainImage = () => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    return '/placeholder-property.jpg'; // Image par défaut
  };

  // Obtenir l'adresse complète
  const getFullAddress = () => {
    const parts = [
      property.address_street,
      property.address_city,
      property.address_district
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'Adresse non spécifiée';
  };

  // Obtenir le type de propriété en français
  const getPropertyTypeLabel = () => {
    switch (property.property_type) {
      case 'house': return 'Maison';
      case 'apartment': return 'Appartement';
      case 'land': return 'Terrain';
      case 'commercial': return 'Commercial';
      default: return 'Propriété';
    }
  };

  // Obtenir le type d'annonce en français
  const getListingTypeLabel = () => {
    switch (property.listing_type) {
      case 'sale': return 'À vendre';
      case 'rent': return 'À louer';
      case 'auction': return 'Enchères';
      default: return 'Disponible';
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onToggleFavorite?.(property.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPropertyClick(property);
  };

  const daysOnMarket = getDaysOnMarket(property.created_at);

  return (
    <div className={`bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-w-sm ${className}`}>
      {/* Image principale */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={getMainImage()}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
          }}
        />
        
        {/* Badge de durée sur le marché */}
        {daysOnMarket > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-white text-gray-800 shadow-md">
              <Calendar className="h-3 w-3 mr-1" />
              {daysOnMarket} jour{daysOnMarket !== 1 ? 's' : ''} sur le marché
            </Badge>
          </div>
        )}

        {/* Badge vedette */}
        {property.featured && (
          <div className="absolute top-3 right-12">
            <Badge className="bg-yellow-500 text-white shadow-md">
              <Star className="h-3 w-3 mr-1" />
              Vedette
            </Badge>
          </div>
        )}

        {/* Bouton favori */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          style={{ right: '12px', top: '12px' }}
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Contenu du popup */}
      <div className="p-4">
        {/* Prix et type */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </div>
            <div className="text-sm text-gray-600">
              {getPropertyTypeLabel()} • {getListingTypeLabel()}
            </div>
          </div>
          {property.price_per_m2 && (
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                {formatPrice(property.price_per_m2)}/m²
              </div>
            </div>
          )}
        </div>

        {/* Caractéristiques */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          {property.beds && property.beds > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.beds} ch.</span>
            </div>
          )}
          {property.baths && property.baths > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.baths} sdb</span>
            </div>
          )}
          {property.m2 && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.m2} m²</span>
            </div>
          )}
        </div>

        {/* Adresse */}
        <div className="flex items-start gap-2 mb-4">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-700">{getFullAddress()}</span>
        </div>

        {/* Agence immobilière */}
        {property.agent_name && (
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {property.agent_name}
              </div>
              {property.agent_phone && (
                <div className="text-xs text-gray-600">
                  {property.agent_phone}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description courte */}
        {property.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {property.description}
            </p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <Button
            onClick={handleViewDetails}
            className="flex-1"
            size="sm"
          >
            Voir les détails
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Fonction pour centrer la carte sur cette propriété
              if (property.lat && property.lng) {
                (window as any).centerOnProperty?.(property.lat, property.lng);
              }
            }}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Référence: {property.reference_number || 'N/A'}</span>
            {property.year_built && (
              <span>Construit en {property.year_built}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPopup;
