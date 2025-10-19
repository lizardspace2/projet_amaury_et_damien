import { Property } from "@/types/property";
import { MapPin, Bed, Bath, Square, Calendar, Building, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertySpecsProps {
  property: Property;
}

const PropertySpecs = ({ property }: PropertySpecsProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center text-estate-neutral-600 mb-4">
        <MapPin size={18} className="mr-2" />
        <p className="text-lg">
          {property.address_street}, {property.address_district && `${property.address_district}, `}
          {property.address_city}
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {property.beds && property.beds > 0 && (
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Bed size={24} className="text-teal-500 mb-2" />
              <p className="text-lg font-semibold">{property.beds}</p>
              <p className="text-estate-neutral-500">Chambres</p>
            </div>
          )}
          
          {property.baths && property.baths > 0 && (
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Bath size={24} className="text-teal-500 mb-2" />
              <p className="text-lg font-semibold">{property.baths}</p>
              <p className="text-estate-neutral-500">Salles de bain</p>
            </div>
          )}
          
          {property.m2 && <div className="flex flex-col items-center p-4 border rounded-lg">
            <Square size={24} className="text-teal-500 mb-2" />
            <p className="text-lg font-semibold">
              {property.property_type === "land" 
                ? `${(property.m2 / 4046.86).toFixed(2)} acres`
                : `${property.m2.toLocaleString()}`}
            </p>
            <p className="text-estate-neutral-500">
              {property.property_type === "land" ? "Taille du terrain" : "Mètres carrés"}
            </p>
          </div>}
          
          {property.year_built && property.year_built > 0 && (
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Calendar size={24} className="text-teal-500 mb-2" />
              <p className="text-lg font-semibold">{property.year_built}</p>
              <p className="text-estate-neutral-500">Année de construction</p>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {property.condition && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">État</h3>
              <Badge variant="secondary">
                {property.condition.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          )}

          {property.status && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Statut</h3>
              <Badge variant="secondary">
                {property.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          )}

          {property.kitchen_type && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Type de cuisine</h3>
              <Badge variant="secondary">
                {property.kitchen_type.toUpperCase()}
              </Badge>
            </div>
          )}

          {(property.floor_level !== undefined || property.total_floors !== undefined) && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Informations sur l'étage</h3>
              <div className="flex items-center gap-2">
                <Building size={18} className="text-teal-500" />
                <span>
                  {property.floor_level !== undefined && `Étage ${property.floor_level}`}
                  {property.total_floors !== undefined && ` de ${property.total_floors}`}
                </span>
              </div>
            </div>
          )}

          {property.ceiling_height && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Hauteur sous plafond</h3>
              <div className="flex items-center gap-2">
                <ArrowUp size={18} className="text-teal-500" />
                <span>{property.ceiling_height}m</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySpecs;