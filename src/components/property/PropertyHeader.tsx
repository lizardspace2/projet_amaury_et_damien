import { Property } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NavigationButton from "@/components/ui/navigation-button";
import { ChevronLeft, ExternalLink, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from '@/CurrencyContext';

interface PropertyHeaderProps {
  property: Property;
}

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  const { formatPrice } = useCurrency();

  const listingTypes: { [key: string]: string } = {
    sale: "Vente",
    rent: "Location",
    rent_by_day: "Location par jour",
  };

  const propertyTypes: { [key: string]: string } = {
    apartment: "Appartement",
    house: "Maison",
    land: "Terrain",
    commercial: "Commercial",
  };

  return (
    <>
      <div className="mb-6">
        <NavigationButton
          variant="link"
          href="/properties"
          icon="back"
          className="text-estate-neutral-600 hover:text-teal-600 font-medium"
        >
          Retour aux propriétés
        </NavigationButton>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-estate-800 mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-estate-neutral-600">
              <span className="text-lg">
                {property.property_type && propertyTypes[property.property_type.toLowerCase()]}
                {property.beds && ` • ${property.beds} chambre${property.beds > 1 ? 's' : ''}`}
                {property.m2 && ` • ${property.m2} m²`}
                {property.address_city && ` • ${property.address_city}`}
                {property.code_postal && ` (${property.code_postal})`}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl md:text-4xl font-bold text-estate-800">
              {property.listing_type === "rent"
                ? `${formatPrice(property.price)}/mois`
                : formatPrice(property.price)}
            </div>
            {property.price_per_m2 && (
              <div className="text-lg text-estate-neutral-600 mt-1">
                {formatPrice(property.price_per_m2)}/m²
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.listing_type && (
            <Badge className="bg-teal-500 hover:bg-teal-500">
              {listingTypes[property.listing_type.toLowerCase()]}
            </Badge>
          )}
          {property.property_type && (
            <Badge className="bg-estate-neutral-700 hover:bg-estate-neutral-700">
              {propertyTypes[property.property_type.toLowerCase()]}
            </Badge>
          )}
        </div>

        {(property.nom_agence || property.reference_annonce) && (
          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-estate-neutral-600">
            {property.nom_agence && (
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                <span>{property.nom_agence}</span>
              </div>
            )}
            {property.reference_annonce && (
              <span>Réf: {property.reference_annonce}</span>
            )}
          </div>
        )}

        {property.lien_visite_virtuelle && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => window.open(property.lien_visite_virtuelle, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visite virtuelle
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyHeader;
