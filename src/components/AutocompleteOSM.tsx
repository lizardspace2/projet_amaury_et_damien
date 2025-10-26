import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';

interface AutocompleteOSMProps {
  onPlaceChanged: (place: {
    formatted_address: string;
    geometry: { location: { lat: () => number; lng: () => number } };
    address_components?: Array<{
      types: string[];
      long_name: string;
    }>;
  }) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    city?: string;
    town?: string;
    country?: string;
    postcode?: string;
  };
}

const AutocompleteOSM = ({ onPlaceChanged, value, onChange, placeholder, label }: AutocompleteOSMProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=fr,de,es,it,gb&addressdetails=1&accept-language=fr`
      );
      const results: NominatimResult[] = await response.json();
      setSuggestions(results);
      setIsOpen(true);
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      searchAddress(newValue);
    }, 300);
  };

  const handleSelectSuggestion = (result: NominatimResult) => {
    onChange(result.display_name);
    setIsOpen(false);
    setSuggestions([]);

    // Parse address components
    const components: Array<{ types: string[]; long_name: string }> = [];
    
    if (result.address) {
      if (result.address.road) components.push({ types: ['route'], long_name: result.address.road });
      if (result.address.city) components.push({ types: ['locality'], long_name: result.address.city });
      else if (result.address.town) components.push({ types: ['locality'], long_name: result.address.town });
      if (result.address.country) components.push({ types: ['country'], long_name: result.address.country });
      if (result.address.postcode) components.push({ types: ['postal_code'], long_name: result.address.postcode });
    }

    // Call onPlaceChanged with a compatible structure
    onPlaceChanged({
      formatted_address: result.display_name,
      geometry: {
        location: {
          lat: () => parseFloat(result.lat),
          lng: () => parseFloat(result.lon)
        }
      },
      address_components: components
    });
  };

  return (
    <div className="relative">
      <label htmlFor={label} className="text-sm font-medium mb-2 block">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        
        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(result)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0 focus:outline-none focus:bg-gray-100"
              >
                <div className="font-medium text-sm">{result.display_name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutocompleteOSM;
