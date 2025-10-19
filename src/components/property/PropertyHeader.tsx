import { Property } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
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
        <Link
          to="/properties"
          className="flex items-center text-estate-neutral-600 hover:text-estate-800 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Retour aux propriétés</span>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-estate-800">{property.title}</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
        {property.listing_type &&
          <Badge className="bg-teal-500 hover:bg-teal-500">
            {listingTypes[property.listing_type.toLowerCase()]}
          </Badge>}
          {property.property_type && <Badge className="bg-estate-neutral-700 hover:bg-estate-neutral-700">
            {propertyTypes[property.property_type.toLowerCase()]}
          </Badge>}
          <span className="text-2xl font-bold text-estate-800 ml-auto">
            {property.listing_type === "rent"
              ? `${formatPrice(property.price)}/mois`
              : formatPrice(property.price)}
          </span>
        </div>
      </div>
    </>
  );
};

export default PropertyHeader;
