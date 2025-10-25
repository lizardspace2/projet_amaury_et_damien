import { useState } from 'react';
import { X, MapPin, Filter, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Property } from '@/types/property';
import PropertiesMap from './PropertiesMap';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  title?: string;
}

const MapModal = ({ 
  isOpen, 
  onClose, 
  properties, 
  onPropertyClick,
  title = "Voir sur la carte"
}: MapModalProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredProperties = selectedType === 'all' 
    ? properties 
    : properties.filter(p => p.listing_type === selectedType);

  const propertyTypes = [
    { value: 'all', label: 'Toutes les propriétés', count: properties.length },
    { value: 'sale', label: 'À vendre', count: properties.filter(p => p.listing_type === 'sale').length },
    { value: 'rent', label: 'À louer', count: properties.filter(p => p.listing_type === 'rent').length },
    { value: 'auction', label: 'Enchères', count: properties.filter(p => p.listing_type === 'auction').length },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <MapPin className="h-6 w-6 text-blue-600" />
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Fermer
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Filtres latéraux */}
          {showFilters && (
            <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Filtrer par type
              </h3>
              <div className="space-y-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedType === type.value
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {type.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Conseils d'utilisation</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Cliquez sur un marqueur pour voir les détails</li>
                  <li>• Utilisez la molette pour zoomer</li>
                  <li>• Glissez pour naviguer sur la carte</li>
                  <li>• Les couleurs indiquent le type de propriété</li>
                </ul>
              </div>
            </div>
          )}

          {/* Carte */}
          <div className="flex-1 relative">
            <PropertiesMap
              properties={filteredProperties}
              onPropertyClick={onPropertyClick}
              className="h-full w-full"
              center={[46.2276, 2.2137]}
              zoom={6}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
