import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default markers in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SimpleMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const SimpleMap = ({ 
  center = [46.2276, 2.2137], 
  zoom = 6,
  className = "h-96 w-full rounded-lg"
}: SimpleMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('SimpleMap useEffect - mapRef.current:', mapRef.current, 'mapContainerRef.current:', mapContainerRef.current);
    
    if (mapRef.current || !mapContainerRef.current) {
      console.log('SimpleMap - Sortie prématurée:', { hasMap: !!mapRef.current, hasContainer: !!mapContainerRef.current });
      return;
    }

    const initMap = () => {
      console.log('SimpleMap initMap - mapContainerRef.current:', mapContainerRef.current);
      if (!mapContainerRef.current) {
        console.log('SimpleMap initMap - Pas de conteneur, sortie');
        return;
      }

      try {
        console.log('SimpleMap - Création de la carte avec:', { center, zoom });
        
        mapRef.current = L.map(mapContainerRef.current, {
          center,
          zoom,
          scrollWheelZoom: true,
          zoomControl: true
        });

        console.log('SimpleMap - Carte créée:', mapRef.current);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(mapRef.current);

        console.log('SimpleMap - Couche de tuiles ajoutée');

        // Ajouter un marqueur de test
        L.marker(center).addTo(mapRef.current)
          .bindPopup('Test de la carte')
          .openPopup();

        console.log('SimpleMap - Marqueur ajouté');
        console.log('SimpleMap - Carte initialisée avec succès');
        
        // Vérifier la taille du conteneur
        const container = mapContainerRef.current;
        console.log('SimpleMap - Taille du conteneur:', {
          width: container.offsetWidth,
          height: container.offsetHeight,
          clientWidth: container.clientWidth,
          clientHeight: container.clientHeight
        });
        
        // Forcer le redimensionnement de la carte
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
            console.log('SimpleMap - Carte redimensionnée');
          }
        }, 200);
        
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
      }
    };

    console.log('SimpleMap - Démarrage du timer');
    const timer = setTimeout(initMap, 100);

    return () => {
      console.log('SimpleMap - Nettoyage');
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]);

  return (
    <div className="relative">
      <div 
        ref={mapContainerRef} 
        className={className}
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

export default SimpleMap;
