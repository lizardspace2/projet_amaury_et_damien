import { Property } from "@/types/property";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertyFeaturesProps {
  property: Property;
}

const PropertyFeatures = ({ property }: PropertyFeaturesProps) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-estate-800 mb-4">Description</h2>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
          <p className="text-estate-neutral-700 leading-relaxed">
            {property.description}
          </p>
        </div>
      </div>

      {property.cadastral_code && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-estate-800 mb-4">Legal Information</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-estate-neutral-500">Cadastral Code</p>
                <p className="font-medium">{property.cadastral_code}</p>
              </div>
              {property.status && (
                <div>
                  <p className="text-sm text-estate-neutral-500">Status</p>
                  <Badge variant="secondary" className="mt-1">
                    {property.status.replace('_', ' ')}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {property.amenities && property.amenities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-estate-800 mb-4">Amenities</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check size={18} className="text-teal-500" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {property.equipment && property.equipment.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-estate-800 mb-4">Equipment</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {property.equipment.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check size={18} className="text-teal-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {property.nearby_places && property.nearby_places.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-estate-800 mb-4">Nearby Places</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {property.nearby_places.map((place, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check size={18} className="text-teal-500" />
                  <span>{place}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyFeatures;