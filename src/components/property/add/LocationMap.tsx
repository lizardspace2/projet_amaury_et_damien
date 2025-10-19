import { useEffect, useRef, useState } from 'react';

interface LocationMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onAddressSelect: (address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function LocationMap({ 
  onLocationSelect,
  onAddressSelect,
  initialLat = 41.7151,
  initialLng = 44.7871
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: initialLat, lng: initialLng },
        zoom: 12,
      });
      setMap(newMap);

      const newMarker = new window.google.maps.Marker({
        position: { lat: initialLat, lng: initialLng },
        map: newMap,
        draggable: true,
      });
      setMarker(newMarker);

      newMarker.addListener('dragend', () => {
        const pos = newMarker.getPosition();
        if (pos) {
          onLocationSelect(pos.lat(), pos.lng());
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              onAddressSelect(results[0].formatted_address);
            }
          });
        }
      });

      newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            newMarker.setPosition(e.latLng);
            onLocationSelect(e.latLng.lat(), e.latLng.lng());
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: e.latLng }, (results, status) => {
                if (status === 'OK' && results?.[0]) {
                    onAddressSelect(results[0].formatted_address);
                }
            });
        }
      });
    }
  }, [mapRef, map, initialLat, initialLng, onLocationSelect, onAddressSelect]);

  useEffect(() => {
    if (map && marker) {
        const newPos = { lat: initialLat, lng: initialLng };
        map.setCenter(newPos);
        marker.setPosition(newPos);
    }
  }, [initialLat, initialLng, map, marker]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-lg border border-gray-300 z-0"
      aria-label="Carte de localisation de la propriété"
    />
  );
}
