import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Property, ListingType } from "@/types/property";
import { getProperties } from "@/lib/properties";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResultSidebar from "@/components/ResultSidebar";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Autocomplete from "@/components/Autocomplete";

const PropertiesSearchPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialListingType = (queryParams.get("type") as ListingType) || "sale";
  
  const [listingType, setListingType] = useState<ListingType>(initialListingType);
  const [viewMode, setViewMode] = useState<'map' | 'gallery' | 'list'>('map');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState("");

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['properties', listingType],
    queryFn: () => getProperties(listingType === 'all' ? undefined : listingType),
  });

  const filteredProperties = properties.filter(property => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      property.title?.toLowerCase().includes(query) ||
      property.address_city?.toLowerCase().includes(query) ||
      property.address_street?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 overflow-hidden">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left column - Map */}
          <div className="flex-1 relative bg-gray-100">
            <div className="absolute top-4 left-4 z-10 w-96 max-w-[calc(100vw-28rem)]">
              {/* Search bar */}
              <div className="bg-white rounded-lg shadow-lg p-4 mb-3">
                <div className="flex items-center gap-2">
                  <Search className="text-gray-400" size={20} />
                  <Autocomplete
                    label=""
                    placeholder="Rechercher une ville, un code postal..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                </div>
              </div>

              {/* Map controls */}
              <div className="bg-white rounded-lg shadow-lg p-3">
                <p className="text-sm text-gray-600">
                  {filteredProperties.length} résultat{filteredProperties.length > 1 ? 's' : ''} dans cette zone
                </p>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">Carte interactive (à intégrer)</p>
            </div>
          </div>

          {/* Right column - Results sidebar */}
          <div className="w-96 bg-white border-l border-gray-200">
            <ResultSidebar
              properties={filteredProperties}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onCreateAlert={() => {
                console.log('Create alert');
              }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesSearchPage;
