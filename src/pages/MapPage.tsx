import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NavigationButton from '@/components/ui/navigation-button';
import { useCurrency } from '@/CurrencyContext';
import { getProperties } from '@/lib/api/properties';
import PropertyCard from '@/components/PropertyCard';
import FilterBar from '@/components/FilterBar';
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
  const markersRef = useRef<L.Marker[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [listingType, setListingType] = useState<any>("all");
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [minRooms, setMinRooms] = useState(0);
  const [minM2, setMinM2] = useState(0);
  const [maxM2, setMaxM2] = useState(50000);
  const [viewMode, setViewMode] = useState<'map' | 'gallery' | 'list'>('gallery');

  // Fonction pour ajouter les marqueurs à la carte
  const addMarkersToMap = useCallback((propertiesToAdd: any[]) => {
    if (!mapRef.current) return;

    // Supprimer tous les marqueurs existants
    markersRef.current.forEach(marker => {
      if (mapRef.current) {
        mapRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs
    propertiesToAdd.forEach(property => {
      const marker = L.marker([property.lat, property.lng]).addTo(mapRef.current!);
      
      const popupContent = `
        <div style="width: 250px; padding: 0; margin: 0;">
          <!-- Photo -->
          <div style="width: 100%; height: 150px; background-color: #f3f4f6; border-radius: 8px 8px 0 0; overflow: hidden; position: relative;">
            ${property.images && property.images.length > 0 ? `
              <img 
                src="${property.images[0]}" 
                alt="${property.title}"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            ` : `
              <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 24px;">
                🏠
              </div>
            `}
          </div>
          
          <!-- Contenu -->
          <div style="padding: 12px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${property.title}</h3>
            <p style="margin: 0 0 6px 0; font-size: 18px; font-weight: bold; color: #e74c3c;">
              ${formatPrice(property.price)}
            </p>
            <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">
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
              font-weight: 500;
            ">
              Voir détails
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => marker.openPopup());
      
      markersRef.current.push(marker);
    });
  }, [formatPrice]);

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

          // Ajouter les marqueurs initiaux
          // Les marqueurs seront mis à jour automatiquement par l'effet sur filteredProperties

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

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...properties];

    // Filtre de recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.title?.toLowerCase().includes(query) ||
        property.address_city?.toLowerCase().includes(query) ||
        property.address_street?.toLowerCase().includes(query)
      );
    }

    // Filtre par type de propriété
    if (propertyTypes.length > 0) {
      filtered = filtered.filter(property =>
        property.property_type && propertyTypes.includes(property.property_type)
      );
    }

    // Filtre par prix
    filtered = filtered.filter(property =>
      property.price >= minPrice && property.price <= maxPrice
    );

    // Filtre par pièces
    if (minRooms > 0) {
      filtered = filtered.filter(property => (property.rooms || 0) >= minRooms);
    }

    // Filtre par surface
    filtered = filtered.filter(property =>
      (property.m2 || 0) >= minM2 && (property.m2 || 0) <= maxM2
    );

    setFilteredProperties(filtered);
  }, [properties, searchQuery, propertyTypes, minPrice, maxPrice, minRooms, minM2, maxM2]);

  // Mettre à jour les marqueurs sur la carte quand les propriétés filtrées changent
  useEffect(() => {
    if (!loading && mapRef.current) {
      addMarkersToMap(filteredProperties);
    }
  }, [filteredProperties, loading, addMarkersToMap]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />
      
      {/* FilterBar */}
      <div className="flex-shrink-0">
        <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        listingType={listingType}
        onListingTypeChange={setListingType}
        propertyTypes={propertyTypes}
        onPropertyTypesChange={setPropertyTypes}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
        minRooms={minRooms}
        onRoomsChange={setMinRooms}
        minM2={minM2}
        maxM2={maxM2}
        onM2Change={(min, max) => {
          setMinM2(min);
          setMaxM2(max);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentListingType={listingType}
      />
      </div>

      {/* Layout 2 colonnes - flex-1 pour prendre tout l'espace disponible */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Colonne gauche - Carte (100% sur mobile, 70% sur desktop) */}
        <div className="w-full lg:w-[70%] relative h-[60vh] lg:h-full min-h-[500px] z-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p>Chargement de la carte...</p>
              </div>
            </div>
          ) : (
            <div 
              ref={mapContainerRef}
              className="h-full w-full relative z-0"
            />
          )}
        </div>

        {/* Colonne droite - Panneau latéral (100% sur mobile, 30% sur desktop) */}
        <div className="w-full lg:w-96 bg-white lg:border-l border-gray-200 overflow-hidden flex flex-col h-[40vh] lg:h-auto">
          {/* Header du panneau */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="text-lg font-semibold">
              {filteredProperties.length} annonce{filteredProperties.length > 1 ? 's' : ''}
            </h3>
          </div>

          {/* Liste des résultats */}
          <div className="flex-1 overflow-y-auto">
            {filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Search size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">Aucun résultat</p>
                <p className="text-sm text-gray-400 mt-2">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : viewMode === 'gallery' ? (
              <div className="grid grid-cols-1 gap-2 p-2">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} variant="gallery" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {filteredProperties.map(property => (
                  <div key={property.id} className="border-b border-gray-100 last:border-0">
                    <PropertyCard property={property} variant="list" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;