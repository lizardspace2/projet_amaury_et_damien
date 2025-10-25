import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './OpenStreetMap.css';
import { Property } from '@/types/property';
import { useCurrency } from '@/CurrencyContext';
import { MapBounds } from '@/contexts/SearchStateContext';
import PropertyPopup from './PropertyPopup';
import { useFavorites } from '@/hooks/useFavorites';

// Fix for Leaflet default markers in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapContainerProps {
  bounds: MapBounds;
  zoom: number;
  properties: Property[];
  onBoundsChange: (bounds: MapBounds, zoom: number) => void;
  onPropertyClick?: (property: Property) => void;
  className?: string;
  isVisible?: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({
  bounds,
  zoom,
  properties,
  onBoundsChange,
  onPropertyClick,
  className = "h-full w-full",
  isVisible = true
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const popupRefs = useRef<Map<string, { popup: L.Popup; root: any }>>(new Map());
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Fonction pour créer des icônes personnalisées
  const createCustomIcon = useCallback((property: Property) => {
    const color = getPropertyColor(property);
    const iconType = getPropertyTypeIcon(property);
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          font-weight: bold;
          z-index: 1000;
          cursor: pointer;
          pointer-events: auto;
        ">
          ${iconType}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  }, []);

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

  // Fonction pour créer un popup React
  const createReactPopup = useCallback((property: Property) => {
    console.log('Création du popup React pour:', property.title);
    const popupElement = document.createElement('div');
    popupElement.className = 'react-popup-container';
    
    const popup = L.popup({
      maxWidth: 400,
      className: 'custom-react-popup'
    }).setContent(popupElement);

    // Créer le root React et rendre le composant
    const root = createRoot(popupElement);
    root.render(
      <PropertyPopup
        property={property}
        onClose={() => {
          popup.close();
          popupRefs.current.delete(property.id);
        }}
        onPropertyClick={onPropertyClick || (() => {})}
        onToggleFavorite={toggleFavorite}
        isFavorite={isFavorite(property.id)}
        formatPrice={formatPrice}
      />
    );

    // Stocker la référence
    popupRefs.current.set(property.id, { popup, root });

    return popup;
  }, [onPropertyClick, toggleFavorite, isFavorite]);

  // Fonction pour nettoyer les popups
  const cleanupPopups = useCallback(() => {
    popupRefs.current.forEach(({ popup, root }) => {
      // Utiliser setTimeout pour éviter le conflit de démontage
      setTimeout(() => {
        try {
          root.unmount();
        } catch (error) {
          console.log('Erreur lors du démontage du root:', error);
        }
      }, 0);
      popup.remove();
    });
    popupRefs.current.clear();
  }, []);

  // Fonction pour centrer sur une propriété
  const centerOnProperty = useCallback((lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], Math.max(mapRef.current.getZoom(), 15));
    }
  }, []);

  // Exposer la fonction globalement
  useEffect(() => {
    (window as any).centerOnProperty = centerOnProperty;
  }, [centerOnProperty]);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [(bounds.north + bounds.south) / 2, (bounds.east + bounds.west) / 2],
        zoom,
        scrollWheelZoom: true,
        zoomControl: true
      });

        // Ajouter la couche OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(mapRef.current);

        // Ajouter un marqueur de test
        const testMarker = L.marker([46.2276, 2.2137])
          .addTo(mapRef.current)
          .bindPopup('Test de la carte - cliquez sur les marqueurs colorés')
          .openPopup();
        
        console.log('Marqueur de test ajouté');

      // Ajouter les événements de changement de vue
      const updateBounds = () => {
        if (mapRef.current) {
          const currentBounds = mapRef.current.getBounds();
          const currentZoom = mapRef.current.getZoom();
          onBoundsChange({
            north: currentBounds.getNorth(),
            south: currentBounds.getSouth(),
            east: currentBounds.getEast(),
            west: currentBounds.getWest()
          }, currentZoom);
        }
      };

      mapRef.current.on('moveend', updateBounds);
      mapRef.current.on('zoomend', updateBounds);

      // Redimensionner la carte après un délai
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 500);

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Mettre à jour les marqueurs quand les propriétés changent
  useEffect(() => {
    if (!mapRef.current) return;

    // Nettoyer les anciens popups
    cleanupPopups();

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs avec popups React
    console.log('Propriétés à afficher:', properties.length);
    properties.forEach((property, index) => {
      console.log(`Propriété ${index}:`, {
        title: property.title,
        lat: property.lat,
        lng: property.lng,
        hasCoords: !!(property.lat && property.lng)
      });
      
      if (property.lat && property.lng) {
        console.log('Création du marqueur pour:', property.title);
        // Test avec marqueur standard d'abord
        const marker = L.marker([property.lat, property.lng]).addTo(mapRef.current!);

        // Créer un popup HTML simple pour tester
        const popupContent = `
          <div style="min-width: 300px; font-family: Arial, sans-serif; padding: 10px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #2c3e50;">
              ${property.title}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #7f8c8d;">
              ${property.address_city || 'Ville non spécifiée'}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 18px; font-weight: bold; color: #e74c3c;">
                ${formatPrice(property.price)}
              </span>
              <span style="font-size: 12px; color: #7f8c8d;">
                ${property.m2}m²
              </span>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              ${property.beds ? `<span style="font-size: 12px; color: #7f8c8d;">🛏️ ${property.beds} ch.</span>` : ''}
              ${property.baths ? `<span style="font-size: 12px; color: #7f8c8d;">🚿 ${property.baths} sdb</span>` : ''}
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
              "
            >
              Voir les détails
            </button>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 350,
          className: 'custom-popup'
        });

        // Gérer le clic sur le marqueur
        marker.on('click', (e) => {
          console.log('Marqueur cliqué:', property.title);
          setSelectedProperty(property);
          marker.openPopup();
        });

        markersRef.current.push(marker);
        console.log('Marqueur ajouté:', property.title);
      } else {
        console.log('Propriété sans coordonnées GPS:', property.title);
      }
    });

    // Ajuster la vue pour inclure tous les marqueurs si nécessaire
    if (properties.length > 0 && properties.some(p => p.lat && p.lng)) {
      const group = new L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }

  }, [properties, createCustomIcon, createReactPopup, cleanupPopups]);

  // Nettoyer les popups au démontage
  useEffect(() => {
    return () => {
      cleanupPopups();
    };
  }, [cleanupPopups]);

  // Fonction globale pour les popups
  useEffect(() => {
    (window as any).selectProperty = (propertyId: string) => {
      const property = properties.find(p => p.id === propertyId);
      if (property && onPropertyClick) {
        onPropertyClick(property);
      }
    };
  }, [properties, onPropertyClick]);

  if (!isVisible) return null;

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

export default MapContainer;
