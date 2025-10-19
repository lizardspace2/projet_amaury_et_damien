import React, { useRef, useEffect } from 'react';

interface AutocompleteProps {
  onPlaceChanged: (place: google.maps.places.PlaceResult) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

const Autocomplete = ({ onPlaceChanged, value, onChange, placeholder, label }: AutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (inputRef.current && !autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: ["fr", "de", "es", "it", "gb"] },
        types: ["address"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          onPlaceChanged(place);
        }
      });

      autocompleteRef.current = autocomplete;
    }
  }, [onPlaceChanged]);

  return (
    <div>
      <label htmlFor={label}>{label}</label>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export default Autocomplete;
