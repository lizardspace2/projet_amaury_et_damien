import { Property } from "@/types/property";
import { Check } from "lucide-react";

interface PropertyAdditionalFeaturesProps {
  property: Property;
}

const PropertyAdditionalFeatures = ({ property }: PropertyAdditionalFeaturesProps) => {
  const features = [
    { label: "Elevator", value: property.has_elevator },
    { label: "Ventilation", value: property.has_ventilation },
    { label: "Air Conditioning", value: property.has_air_conditioning },
    { label: "Accessible", value: property.is_accessible },
  ].filter(feature => feature.value);

  const hasEquipment = property.equipment && property.equipment.length > 0;
  const hasInternetTV = property.internet_tv && property.internet_tv.length > 0;
  const hasStorage = property.storage && property.storage.length > 0;
  const hasSecurity = property.security && property.security.length > 0;
  const hasNearbyPlaces = property.nearby_places && property.nearby_places.length > 0;

  if (!features.length && !hasEquipment && !hasInternetTV && !hasStorage && !hasSecurity && !hasNearbyPlaces) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-estate-800 mb-4">Additional Features</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">General Features</h3>
              <div className="grid grid-cols-1 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={18} className="text-teal-500" />
                    <span>{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasEquipment && (
            <div>
              <h3 className="font-medium mb-3">Equipment</h3>
              <div className="grid grid-cols-1 gap-2">
                {property.equipment?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={18} className="text-teal-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasInternetTV && (
            <div>
              <h3 className="font-medium mb-3">Internet & TV</h3>
              <div className="grid grid-cols-1 gap-2">
                {property.internet_tv?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={18} className="text-teal-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasSecurity && (
            <div>
              <h3 className="font-medium mb-3">Security</h3>
              <div className="grid grid-cols-1 gap-2">
                {property.security?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={18} className="text-teal-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasNearbyPlaces && (
            <div>
              <h3 className="font-medium mb-3">Nearby Places</h3>
              <div className="grid grid-cols-1 gap-2">
                {property.nearby_places?.map((place, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={18} className="text-teal-500" />
                    <span>{place}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyAdditionalFeatures;