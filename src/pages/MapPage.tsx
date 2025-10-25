import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/CurrencyContext';
import { getProperties } from '@/lib/api/properties';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les propriétés et initialiser la carte en même temps
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        // Charger les données
        const data = await getProperties('all');
        const withCoords = data.filter(p => p.lat && p.lng);
        
        if (!isMounted) return;
        
        setProperties(withCoords);
        setLoading(false);

        // Attendre un peu que le DOM soit prêt
        setTimeout(() => {
          if (!isMounted || !mapContainerRef.current) return;

          // Créer la carte
          const map = L.map(mapContainerRef.current, {
            center: [45.75805500216428, 4.789653750976552],
            zoom: 13,
            zoomControl: true
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          mapRef.current = map;

          // Ajouter les marqueurs immédiatement
          withCoords.forEach(property => {
            const marker = L.marker([property.lat, property.lng]).addTo(map);
            
            const popupContent = `
              <div style="width: 200px; padding: 10px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px;">${property.title}</h3>
                <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold; color: #e74c3c;">
                  ${formatPrice(property.price)}
                </p>
                <p style="margin: 0 0 10px 0; color: #666;">
                  📐 ${property.m2} m²
                </p>
                <button onclick="window.openProperty('${property.id}')" style="
                  width: 100%; 
                  background: #3498db; 
                  color: white; 
                  border: none; 
                  padding: 8px; 
                  border-radius: 4px; 
                  cursor: pointer;
                  font-size: 14px;
                ">
                  Voir détails
                </button>
              </div>
            `;

            marker.bindPopup(popupContent);
            marker.on('click', () => marker.openPopup());
          });

        }, 50);

      } catch (error) {
        console.error('Erreur:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [formatPrice]);

  // Fonction globale
  useEffect(() => {
    (window as any).openProperty = (id: string) => {
      navigate(`/property/${id}`);
    };

    return () => {
      delete (window as any).openProperty;
    };
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-teal-600" />
              <h1 className="text-2xl font-bold text-gray-800">
                Propriétés sur la carte
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Chargement...</p>
            </div>
          </div>
        ) : (
          <div 
            ref={mapContainerRef}
            className="h-full w-full"
            style={{ minHeight: '500px' }}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MapPage;