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

      <div className="bg-white rounded-xl p-8 shadow-lg border-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <span className="w-1 h-8 bg-teal-500 rounded-full"></span>
          Caractéristiques principales
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {property.m2 && (
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center mb-3">
                <Square size={28} className="text-white" />
              </div>
              <p className="text-2xl font-extrabold text-teal-800 mb-1">
                {property.property_type === "land" 
                  ? `${(property.m2 / 4046.86).toFixed(2)} acres`
                  : `${property.m2.toLocaleString()}`}
              </p>
              <p className="text-sm text-teal-700 font-semibold">
                {property.property_type === "land" ? "Taille du terrain" : "m²"}
              </p>
            </div>
          )}
          
          {property.rooms && property.rooms > 0 && (
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
                <Home size={28} className="text-white" />
              </div>
              <p className="text-2xl font-extrabold text-blue-800 mb-1">{property.rooms}</p>
              <p className="text-sm text-blue-700 font-semibold">pièce{property.rooms > 1 ? 's' : ''}</p>
            </div>
          )}
          
          {property.beds && property.beds > 0 && (
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-3">
                <Bed size={28} className="text-white" />
              </div>
              <p className="text-2xl font-extrabold text-purple-800 mb-1">{property.beds}</p>
              <p className="text-sm text-purple-700 font-semibold">chambre{property.beds > 1 ? 's' : ''}</p>
            </div>
          )}
          
          {property.baths && property.baths > 0 && (
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center mb-3">
                <Bath size={28} className="text-white" />
              </div>
              <p className="text-2xl font-extrabold text-indigo-800 mb-1">{property.baths}</p>
              <p className="text-sm text-indigo-700 font-semibold">SDB</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {property.cave && (
            <div className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                <Building size={22} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Cave</p>
                <p className="text-sm text-gray-600">Disponible</p>
              </div>
            </div>
          )}

          {property.parking_box && property.parking_box > 0 && (
            <div className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                <Car size={22} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{property.parking_box} place{property.parking_box > 1 ? 's' : ''}</p>
                <p className="text-sm text-gray-600">Parking/Box</p>
              </div>
            </div>
          )}

          {property.surface_balcon_terrasse && property.surface_balcon_terrasse > 0 && (
            <div className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                <Layers size={22} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{property.surface_balcon_terrasse} m²</p>
                <p className="text-sm text-gray-600">Balcon/Terrasse</p>
              </div>
            </div>
          )}

          {property.year_built && property.year_built > 0 && (
            <div className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                <Calendar size={22} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{property.year_built}</p>
                <p className="text-sm text-gray-600">Année construction</p>
              </div>
            </div>
          )}

          {property.nombre_etages_immeuble && (
            <div className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                <Building size={22} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{property.nombre_etages_immeuble} étages</p>
                <p className="text-sm text-gray-600">Immeuble</p>
              </div>
            </div>
          )}

          {property.annee_construction && (
            <div className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                <Calendar size={22} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{property.annee_construction}</p>
                <p className="text-sm text-gray-600">Bâtiment</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {property.condition && (
            <div className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 mb-3">État</h3>
              <Badge variant="secondary" className="text-base py-1 px-3">
                {property.condition.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          )}

          {property.status && (
            <div className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 mb-3">Statut</h3>
              <Badge variant="secondary" className="text-base py-1 px-3">
                {property.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          )}

          {property.kitchen_type && (
            <div className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 mb-3">Type de cuisine</h3>
              <Badge variant="secondary" className="text-base py-1 px-3">
                {property.kitchen_type.toUpperCase()}
              </Badge>
            </div>
          )}

          {(property.floor_level !== undefined || property.total_floors !== undefined) && (
            <div className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 mb-3">Informations sur l'étage</h3>
              <div className="flex items-center gap-2">
                <Building size={20} className="text-teal-500" />
                <span className="font-semibold text-gray-700">
                  {property.floor_level !== undefined && `Étage ${property.floor_level}`}
                  {property.total_floors !== undefined && ` de ${property.total_floors}`}
                </span>
              </div>
            </div>
          )}

          {property.ceiling_height && (
            <div className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 mb-3">Hauteur sous plafond</h3>
              <div className="flex items-center gap-2">
                <ArrowUp size={20} className="text-teal-500" />
                <span className="font-semibold text-gray-700">{property.ceiling_height}m</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySpecs;