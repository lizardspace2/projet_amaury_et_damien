import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

interface PropertyMapCompactProps {
  lat: number;
  lng: number;
  address: string;
  className?: string;
  height?: string;
}

const PropertyMapCompact = ({ 
  lat, 
  lng, 
  address, 
  className = "h-48 w-full rounded-lg",
  height = "h-48"
}: PropertyMapCompactProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    // Configuration de l'icône personnalisée
    const CustomIcon = L.divIcon({
      className: 'custom-marker-compact',
      html: `
        <div style="
          background: #3b82f6;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
        ">
          🏠
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });

    // Initialisation de la carte
    mapRef.current = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: false
    });

    // Ajout de la couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(mapRef.current);

    // Ajout du marqueur
    markerRef.current = L.marker([lat, lng], {
      icon: CustomIcon
    })
      .addTo(mapRef.current)
      .bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">📍 Localisation</div>
          <div style="font-size: 14px; color: #666;">${address}</div>
        </div>
      `);

    // Nettoyage
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, address]);

  return (
    <div className="relative">
      <div 
        ref={mapContainerRef} 
        className={`${className} ${height} overflow-hidden relative z-0`}
      />
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-gray-600 flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        <span>Localisation</span>
      </div>
    </div>
  );
};

export default PropertyMapCompact;
