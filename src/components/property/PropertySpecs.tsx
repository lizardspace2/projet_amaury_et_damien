import { Property } from "@/types/property";
import { MapPin, Bed, Bath, Square, Calendar, Building, ArrowUp, Car, Home, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertySpecsProps {
  property: Property;
}

const PropertySpecs = ({ property }: PropertySpecsProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center text-estate-neutral-600 mb-6">
        <MapPin size={20} className="mr-3 text-teal-500" />
        <div>
          <p className="text-lg font-medium">
            {property.address_street && `${property.address_street}, `}
            {property.address_district && `${property.address_district}, `}
            {property.address_city}
            {property.code_postal && ` (${property.code_postal})`}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
        <h2 className="text-xl font-semibold text-estate-800 mb-6">Caractéristiques principales</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {property.m2 && (
            <div className="flex flex-col items-center p-4 bg-teal-50 rounded-lg border border-teal-200">
              <Square size={28} className="text-teal-600 mb-2" />
              <p className="text-xl font-bold text-teal-800">
                {property.property_type === "land" 
                  ? `${(property.m2 / 4046.86).toFixed(2)} acres`
                  : `${property.m2.toLocaleString()}`}
              </p>
              <p className="text-sm text-teal-600 font-medium">
                {property.property_type === "land" ? "Taille du terrain" : "m²"}
              </p>
            </div>
          )}
          
          {property.rooms && property.rooms > 0 && (
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Home size={28} className="text-blue-600 mb-2" />
              <p className="text-xl font-bold text-blue-800">{property.rooms}</p>
              <p className="text-sm text-blue-600 font-medium">pièce{property.rooms > 1 ? 's' : ''}</p>
            </div>
          )}
          
          {property.beds && property.beds > 0 && (
            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Bed size={28} className="text-purple-600 mb-2" />
              <p className="text-xl font-bold text-purple-800">{property.beds}</p>
              <p className="text-sm text-purple-600 font-medium">chambre{property.beds > 1 ? 's' : ''}</p>
            </div>
          )}
          
          {property.baths && property.baths > 0 && (
            <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <Bath size={28} className="text-indigo-600 mb-2" />
              <p className="text-xl font-bold text-indigo-800">{property.baths}</p>
              <p className="text-sm text-indigo-600 font-medium">SDB</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {property.cave && (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Building size={20} className="text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800">Cave</p>
                <p className="text-sm text-gray-600">Disponible</p>
              </div>
            </div>
          )}

          {property.parking_box && property.parking_box > 0 && (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Car size={20} className="text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800">{property.parking_box} place{property.parking_box > 1 ? 's' : ''}</p>
                <p className="text-sm text-gray-600">Parking/Box</p>
              </div>
            </div>
          )}

          {property.surface_balcon_terrasse && property.surface_balcon_terrasse > 0 && (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Layers size={20} className="text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800">{property.surface_balcon_terrasse} m²</p>
                <p className="text-sm text-gray-600">Balcon/Terrasse</p>
              </div>
            </div>
          )}

          {property.year_built && property.year_built > 0 && (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Calendar size={20} className="text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800">{property.year_built}</p>
                <p className="text-sm text-gray-600">Année construction</p>
              </div>
            </div>
          )}

          {property.nombre_etages_immeuble && (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Building size={20} className="text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800">{property.nombre_etages_immeuble} étages</p>
                <p className="text-sm text-gray-600">Immeuble</p>
              </div>
            </div>
          )}

          {property.annee_construction && (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Calendar size={20} className="text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800">{property.annee_construction}</p>
                <p className="text-sm text-gray-600">Bâtiment</p>
              </div>
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

          {property.nombre_etages_immeuble && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Immeuble</h3>
              <div className="flex items-center gap-2">
                <Building size={18} className="text-teal-500" />
                <span>{property.nombre_etages_immeuble} étages</span>
              </div>
            </div>
          )}

          {property.annee_construction && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Année de construction du bâtiment</h3>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-teal-500" />
                <span>{property.annee_construction}</span>
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