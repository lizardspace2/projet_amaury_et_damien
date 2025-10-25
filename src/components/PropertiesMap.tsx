import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PropertiesMap.css';
import { MapPin, Home, Euro, Eye } from 'lucide-react';
import { Property } from '@/types/property';
import { useCurrency } from '@/CurrencyContext';

interface PropertiesMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const PropertiesMap = ({ 
  properties, 
  onPropertyClick, 
  center = [46.2276, 2.2137], // Centre de la France par défaut
  zoom = 6,
  className = "h-96 w-full rounded-lg"
}: PropertiesMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { formatPrice } = useCurrency();

  // Configuration des icônes personnalisées
  const createCustomIcon = (property: Property, isSelected: boolean = false) => {
    const color = getPropertyColor(property);
    const size = isSelected ? 35 : 25;
    
    return L.divIcon({
      className: 'custom-property-marker',
      html: `
        <div style="
          background: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          ${isSelected ? '🏠' : '🏡'}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
  };

  const getPropertyColor = (property: Property): string => {
    if (property.listing_type === 'sale') return '#10b981'; // Vert pour vente
    if (property.listing_type === 'rent') return '#3b82f6'; // Bleu pour location
    if (property.listing_type === 'auction') return '#f59e0b'; // Orange pour enchères
    return '#6b7280'; // Gris par défaut
  };

  const getPropertyTypeIcon = (property: Property): string => {
    switch (property.property_type) {
      case 'house': return '🏠';
      case 'apartment': return '🏢';
      case 'commercial': return '🏪';
      case 'land': return '🌱';
      default: return '🏡';
    }
  };

  const createPopupContent = (property: Property) => {
    return `
      <div class="property-popup" style="min-width: 250px; max-width: 300px;">
        <div class="property-image" style="width: 100%; height: 150px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
          ${getPropertyTypeIcon(property)}
        </div>
        <div class="property-info" style="padding: 12px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937; line-height: 1.3;">
            ${property.title}
          </h3>
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px; color: #6b7280; font-size: 14px;">
            <span>📍</span>
            <span>${property.address_city}${property.address_district ? `, ${property.address_district}` : ''}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 18px; font-weight: bold; color: #059669;">
              ${formatPrice(property.price)}
            </span>
            ${property.m2 ? `<span style="color: #6b7280; font-size: 14px;">${property.m2} m²</span>` : ''}
          </div>
          <div style="display: flex; gap: 12px; margin-bottom: 12px; font-size: 14px; color: #6b7280;">
            ${property.beds ? `<span>🛏️ ${property.beds} ch.</span>` : ''}
            ${property.baths ? `<span>🚿 ${property.baths} sdb</span>` : ''}
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.selectProperty('${property.id}')" style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              flex: 1;
            ">
              Voir détails
            </button>
            <button onclick="window.viewProperty('${property.id}')" style="
              background: #10b981;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
            ">
              👁️
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // Initialisation de la carte
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    // Configuration de l'icône par défaut de Leaflet
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    // Initialisation de la carte
    mapRef.current = L.map(mapContainerRef.current, {
      center,
      zoom,
      scrollWheelZoom: true,
      zoomControl: true
    });

    // Ajout de la couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapRef.current);

    // Fonctions globales pour les popups
    (window as any).selectProperty = (propertyId: string) => {
      const property = properties.find(p => p.id === propertyId);
      if (property && onPropertyClick) {
        onPropertyClick(property);
      }
    };

    (window as any).viewProperty = (propertyId: string) => {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        setSelectedProperty(property);
      }
    };

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Mise à jour des marqueurs quand les propriétés changent
  useEffect(() => {
    if (!mapRef.current) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs
    properties.forEach(property => {
      if (property.lat && property.lng) {
        const isSelected = selectedProperty?.id === property.id;
        const marker = L.marker([property.lat, property.lng], {
          icon: createCustomIcon(property, isSelected)
        });

        marker.bindPopup(createPopupContent(property), {
          maxWidth: 300,
          className: 'custom-popup'
        });

        marker.on('click', () => {
          setSelectedProperty(property);
        });

        marker.addTo(mapRef.current!);
        markersRef.current.push(marker);
      }
    });

    // Ajuster la vue pour inclure tous les marqueurs
    if (properties.length > 0 && properties.some(p => p.lat && p.lng)) {
      const group = new L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [properties, selectedProperty, formatPrice]);

  return (
    <div className="relative">
      <div 
        ref={mapContainerRef} 
        className={className}
        style={{ zIndex: 1 }}
      />
      
      {/* Légende */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10 max-w-xs">
        <h4 className="font-semibold text-sm mb-3 text-gray-800">Types de propriétés</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>À vendre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>À louer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Enchères</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Autres</span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
        <div className="text-sm text-gray-600">
          <div className="font-semibold text-gray-800">{properties.length} propriétés</div>
          <div className="text-xs text-gray-500">
            {properties.filter(p => p.lat && p.lng).length} avec localisation
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesMap;
