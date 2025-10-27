import React, { useState, useEffect, useRef, useCallback } from 'react';

interface AddressResult {
  properties: {
    label: string;
    name: string;
    city: string;
    postcode: string;
    context: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface AutocompleteProps {
  onPlaceChanged?: (place: { formatted_address: string; geometry: { location: { lat: () => number; lng: () => number } } }) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  className?: string;
}

const Autocomplete = ({ onPlaceChanged, value, onChange, placeholder, label, className }: AutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions from adresse.data.gouv.fr API
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value) {
        fetchSuggestions(value);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, fetchSuggestions]);

  const handleSelectAddress = (suggestion: AddressResult) => {
    const formattedAddress = suggestion.properties.label;
    onChange(formattedAddress);
    setShowSuggestions(false);
    setSuggestions([]);

    // Create a Google-like place object for compatibility
    if (onPlaceChanged) {
      const place = {
        formatted_address: formattedAddress,
        geometry: {
          location: {
            lat: () => suggestion.geometry.coordinates[1],
            lng: () => suggestion.geometry.coordinates[0],
          },
        },
      };
      onPlaceChanged(place);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectAddress(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="relative">
      {label && <label className="block mb-2">{label}</label>}
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        className={`flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSelectAddress(suggestion)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
            >
              <div className="font-medium">{suggestion.properties.label}</div>
              <div className="text-sm text-gray-500">
                {suggestion.properties.postcode && suggestion.properties.city && 
                  `${suggestion.properties.postcode} ${suggestion.properties.city}`
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Autocomplete.displayName = "Autocomplete";

export default Autocomplete;
