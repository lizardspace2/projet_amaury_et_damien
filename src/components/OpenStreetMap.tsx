import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './OpenStreetMap.css';
import { Property } from '@/types/property';
import { useCurrency } from '@/CurrencyContext';

// Fix for Leaflet default markers in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OpenStreetMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  properties?: Property[];
  onPropertyClick?: (property: Property) => void;
  onMapViewChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  onMapRef?: (mapInstance: any) => void;
}

const OpenStreetMap = ({ 
  center = [46.2276, 2.2137], 
  zoom = 6,
  className = "h-96 w-full rounded-lg",
  properties = [],
  onPropertyClick,
  onMapViewChange,
  onMapRef
}: OpenStreetMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const { formatPrice } = useCurrency();

  // Fonction pour créer des icônes personnalisées
  const createCustomIcon = (property: Property) => {
    const color = getPropertyColor(property);
    const iconType = getPropertyTypeIcon(property);
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: white;
          font-weight: bold;
          z-index: 1000;
        ">
          ${iconType}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  // Fonction pour déterminer la couleur selon le type de propriété
  const getPropertyColor = (property: Property): string => {
    switch (property.listing_type) {
      case 'sale':
        return '#e74c3c'; // Rouge pour vente
      case 'rent':
        return '#3498db'; // Bleu pour location
      case 'auction':
        return '#f39c12'; // Orange pour enchères
      default:
        return '#2ecc71'; // Vert par défaut
    }
  };

  // Fonction pour déterminer l'icône selon le type de propriété
  const getPropertyTypeIcon = (property: Property): string => {
    switch (property.property_type) {
      case 'house':
        return '🏠';
      case 'apartment':
        return '🏢';
      case 'land':
        return '🌍';
      case 'commercial':
        return '🏪';
      default:
        return '🏠';
    }
  };

  // Fonction pour créer le contenu de la popup
  const createPopupContent = (property: Property) => {
    const address = [property.address_street, property.address_city, property.address_district]
      .filter(Boolean)
      .join(', ') || 'Localisation non spécifiée';

    return `
      <div style="min-width: 250px; font-family: Arial, sans-serif;">
        <div style="margin-bottom: 8px;">
          <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold; color: #2c3e50;">
            ${property.title}
          </h3>
          <p style="margin: 0; font-size: 12px; color: #7f8c8d;">
            ${address}
          </p>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 18px; font-weight: bold; color: #e74c3c;">
            ${formatPrice(property.price)}
          </span>
          <span style="font-size: 14px; color: #7f8c8d;">
            ${property.m2}m²
          </span>
        </div>
        
        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
          ${property.beds ? `<span style="font-size: 12px; color: #7f8c8d;">🛏️ ${property.beds} ch.</span>` : ''}
          ${property.baths ? `<span style="font-size: 12px; color: #7f8c8d;">🚿 ${property.baths} sdb</span>` : ''}
        </div>
        
        <div style="display: flex; gap: 4px; margin-bottom: 8px;">
          <span style="
            background-color: ${getPropertyColor(property)};
            color: white;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
          ">
            ${property.listing_type === 'sale' ? 'Vente' : 
              property.listing_type === 'rent' ? 'Location' : 
              property.listing_type === 'auction' ? 'Enchères' : 'Autre'}
          </span>
          ${property.featured ? '<span style="background-color: #f39c12; color: white; padding: 2px 6px; border-radius: 12px; font-size: 10px; font-weight: bold;">⭐ Vedette</span>' : ''}
        </div>
        
        <button 
          onclick="window.selectProperty('${property.id}')"
          style="
            width: 100%;
            background-color: #3498db;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
          "
          onmouseover="this.style.backgroundColor='#2980b9'"
          onmouseout="this.style.backgroundColor='#3498db'"
        >
          Voir les détails
        </button>
      </div>
    `;
  };

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) {
      return;
    }

    const initMap = () => {
      if (!mapContainerRef.current) {
        return;
      }

      try {
        // Créer la carte
        mapRef.current = L.map(mapContainerRef.current, {
          center,
          zoom,
          scrollWheelZoom: true,
          zoomControl: true
        });

        // Ajouter la couche OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(mapRef.current);

        // Ajouter les événements de changement de vue
        if (onMapViewChange) {
          const updateBounds = () => {
            if (mapRef.current) {
              const bounds = mapRef.current.getBounds();
              onMapViewChange({
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest()
              });
            }
          };

          mapRef.current.on('moveend', updateBounds);
          mapRef.current.on('zoomend', updateBounds);
        }

        // Passer la référence de la carte au composant parent
        if (onMapRef) {
          onMapRef(mapRef.current);
        }

        // Redimensionner la carte après un délai
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 500);

      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
      }
    };

    // Délai pour s'assurer que le conteneur est prêt
    const timer = setTimeout(initMap, 200);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Ajouter les marqueurs des propriétés
  useEffect(() => {
    if (!mapRef.current || !properties.length) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs avec icônes personnalisées
    properties.forEach(property => {
      if (property.lat && property.lng) {
        const marker = L.marker([property.lat, property.lng], {
          icon: createCustomIcon(property)
        })
        .addTo(mapRef.current!)
        .bindPopup(createPopupContent(property), {
          maxWidth: 300,
          className: 'custom-popup'
        });

        if (onPropertyClick) {
          marker.on('click', () => onPropertyClick(property));
        }

        markersRef.current.push(marker);
      }
    });

    // Ajuster la vue pour inclure tous les marqueurs
    if (properties.length > 0 && properties.some(p => p.lat && p.lng)) {
      const group = new L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }

  }, [properties, onPropertyClick]);

  // Fonction globale pour les popups et le centrage
  useEffect(() => {
    (window as any).selectProperty = (propertyId: string) => {
      const property = properties.find(p => p.id === propertyId);
      if (property && onPropertyClick) {
        onPropertyClick(property);
      }
    };

    (window as any).centerOnMarkers = () => {
      if (mapRef.current && markersRef.current.length > 0) {
        const group = new L.featureGroup(markersRef.current);
        mapRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    };
  }, [properties, onPropertyClick]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainerRef} 
        className={className}
        style={{ 
          zIndex: 1,
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '400px'
        }}
      />
    </div>
  );
};

export default OpenStreetMap;
