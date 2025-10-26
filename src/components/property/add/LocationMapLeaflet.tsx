import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapLeafletProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onAddressSelect: (address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function LocationMapLeaflet({ 
  onLocationSelect,
  onAddressSelect,
  initialLat = 45.764043,
  initialLng = 4.835659
}: LocationMapLeafletProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) {
      return;
    }

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      scrollWheelZoom: true,
      zoomControl: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapRef.current);

    // Create draggable marker
    markerRef.current = L.marker([initialLat, initialLng], {
      draggable: true
    }).addTo(mapRef.current);

    // Handle marker drag
    markerRef.current.on('dragend', async (e) => {
      const marker = e.target;
      const position = marker.getLatLng();
      onLocationSelect(position.lat, position.lng);
      
      // Get address using Nominatim reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1&accept-language=fr`
        );
        const data = await response.json();
        if (data.display_name) {
          onAddressSelect(data.display_name);
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }
    });

    // Handle map click
    mapRef.current.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      markerRef.current?.setLatLng([lat, lng]);
      onLocationSelect(lat, lng);
      
      // Get address using Nominatim reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=fr`
        );
        const data = await response.json();
        if (data.display_name) {
          onAddressSelect(data.display_name);
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }
    });

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initialLat, initialLng, onLocationSelect, onAddressSelect]);

  // Update marker position when initial coordinates change
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      const newPos = [initialLat, initialLng] as [number, number];
      markerRef.current.setLatLng(newPos);
      mapRef.current.setView(newPos, mapRef.current.getZoom());
    }
  }, [initialLat, initialLng]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] rounded-lg border border-gray-300"
      style={{ zIndex: 0 }}
    />
  );
}
