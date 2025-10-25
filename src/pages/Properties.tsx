import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Filter, MapPin, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/PropertyCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useCurrency } from '@/CurrencyContext';
import { getProperties } from "@/lib/api/properties";
import { Property, PropertyType, ListingType } from "@/types/property";
import { supabase } from "@/lib/api/supabaseClient";
import { getUserProfile } from "@/lib/profiles";
import { FRENCH_CITIES } from "@/data/FrenchCities";
import MapModal from "@/components/MapModal";
import ViewOnMapButton from "@/components/ViewOnMapButton";
import SimpleMap from "@/components/SimpleMap";

// Properties Component
const Properties = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingTypeFromParams = searchParams.get('type');
  const queryParams = new URLSearchParams(location.search);
  const initialListingType = (queryParams.get("type") as ListingType) || "sale";
  const initialSearch = queryParams.get("search") || "";

  const { formatPrice } = useCurrency();

  // State for basic filters
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [listingType, setListingType] = useState<ListingType>(initialListingType);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [minM2, setMinM2] = useState(0);
  const [maxM2, setMaxM2] = useState(50000);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState(minPrice.toString());
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice.toString());
  const [minM2Input, setMinM2Input] = useState(minM2.toString());
  const [maxM2Input, setMaxM2Input] = useState(maxM2.toString());
  const [sortOption, setSortOption] = useState<string>("recent");
  const [activeTab, setActiveTab] = useState("filters");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [userLikedProperties, setUserLikedProperties] = useState<string[] | null>(null); // Added state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [showTestMap, setShowTestMap] = useState(false);

  console.log('Properties - isMapModalOpen:', isMapModalOpen, 'showTestMap:', showTestMap);

  // Listing type buttons with translations
  const listingTypeButtons = [
    { value: "all", label: "Toutes les annonces" },
    { value: "sale", label: "À vendre" },
    { value: "rent", label: "À louer" },
    { value: "rent_by_day", label: "Location journalière" },
    { value: "lease", label: "Bail à céder" },
    { value: "auction", label: "Enchères" },
    { value: "viager", label: "Viager" },
    { value: "exceptional_property", label: "Biens d'exception" },
    { value: "remere", label: "Réméré" },
    { value: "vefa", label: "VEFA" },
    { value: "vente_a_terme", label: "Vente à terme" },
    { value: "remere_inverse", label: "Réméré inversé" },
    { value: "indivision_nue_propriete", label: "Indivision/Nue-propriété" },
    { value: "brs", label: "BRS" },
    { value: "demenbrement_temporaire", label: "Démembrement temporaire" },
    { value: "credit_vendeur", label: "Crédit-vendeur" },
    { value: "copropriete_lot_volume", label: "Copropriété/Lot de volume" }
  ];

  const handleListingTypeChange = (value: ListingType) => {
    setListingType(value);
  };

  const renderListingTypeFilter = () => (
    <RadioGroup
      value={listingType}
      onValueChange={(value: string) => setListingType(value as ListingType)}
      className="flex flex-col space-y-1"
    >
      {listingTypeButtons.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.value}
            id={`listing-type-${option.value}`}
          />
          <Label htmlFor={`listing-type-${option.value}`}>
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );

  // State for advanced filters
  const [features, setFeatures] = useState({
    has_elevator: false,
    has_air_conditioning: false,
    is_accessible: false,
    has_fireplace: false,
    has_internet: false,
    has_cable_tv: false,
    allows_pets: false,
    allows_smoking: false,
    near_subway: false,
    near_park: false,
    near_school: false,
    has_parking: false,
    has_gas: false,
    has_loggia: false,
    has_dishwasher: false,
    has_washing_machine: false,
    has_gas_stove: false,
    has_vent: false,
    has_electric_kettle: false,
    has_induction_oven: false,
    has_microwave: false,
    has_tv: false,
    has_coffee_machine: false,
    has_audio_system: false,
    has_heater: false,
    has_electric_oven: false,
    has_hair_dryer: false,
    has_cinema: false,
    has_refrigerator: false,
    has_vacuum_cleaner: false,
    has_dryer: false,
    has_iron: false,
    has_co_detector: false,
    has_smoke_detector: false,
    has_evacuation_ladder: false,
    has_fire_fighting_system: false,
    has_perimeter_cameras: false,
    has_alarm: false,
    has_live_protection: false,
    has_locked_entrance: false,
    has_locked_yard: false,
    near_bus_stop: false,
    near_bank: false,
    near_supermarket: false,
    near_kindergarten: false,
    near_city_center: false,
    near_pharmacy: false,
    near_greenery: false,
    near_old_district: false,
    has_satellite_tv: false,
    has_phone_line: false,
  });

  const [condition, setCondition] = useState<string[]>([]);
  const [furnitureType, setFurnitureType] = useState<string[]>([]);
  const [heatingType, setHeatingType] = useState<string[]>([]);
  const [parkingType, setParkingType] = useState<string[]>([]);
  const [buildingMaterial, setBuildingMaterial] = useState<string[]>([]);
  const [kitchenType, setKitchenType] = useState<string[]>([]);

  const sortOptions = [
    { value: "recent", label: "Plus récent" },
    { value: "oldest", label: "Plus ancien" },
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix décroissant" },
    { value: "m2-asc", label: "Surface croissante" },
    { value: "m2-desc", label: "Surface décroissante" },
  ];

  const sortProperties = (properties: Property[]) => {
    const sorted = [...properties];

    const parseDate = (dateStr: string | undefined): number => {
      if (!dateStr) return 0;
      if (/^\d+$/.test(dateStr)) {
        return parseInt(dateStr);
      }
      try {
        return new Date(dateStr).getTime();
      } catch (e) {
        return 0;
      }
    };

    switch (sortOption) {
      case "recent":
        return sorted.sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at));
      case "oldest":
        return sorted.sort((a, b) => parseDate(a.created_at) - parseDate(b.created_at));
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "m2-asc":
        return sorted.sort((a, b) => (a.m2 || 0) - (b.m2 || 0));
      case "m2-desc":
        return sorted.sort((a, b) => (b.m2 || 0) - (a.m2 || 0));
      default:
        return sorted;
    }
  };

  // Fetch properties
  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['properties', listingType],
    queryFn: () => getProperties(listingType === 'all' ? undefined : listingType as any),
  });



  useEffect(() => {
    const fetchProfile = async () => {
      try {
      const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const profile = await getUserProfile(user.id);
          setUserLikedProperties(profile?.liked_properties || []);
        } else {
          setUserLikedProperties([]); // No user logged in
        }
      } catch (error) {
        console.error("Error fetching user profile for liked properties:", error);
        setUserLikedProperties([]); // Error case
      }
    };
    fetchProfile();
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    setMinPriceInput(minPrice.toString());
    setMaxPriceInput(maxPrice.toString());
  }, [minPrice, maxPrice]);

  const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMinPriceInput(value);
    if (value) {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setMinPrice(Math.min(numValue, maxPrice));
      }
    }
  };

  const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMaxPriceInput(value);
    if (value) {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setMaxPrice(Math.max(numValue, minPrice));
      }
    }
  };

  const handlePriceBlur = () => {
    const min = parseInt(minPriceInput) || 0;
    const max = parseInt(maxPriceInput) || 5000000;
    setMinPrice(Math.min(min, max));
    setMaxPrice(Math.max(min, max));
  };

  useEffect(() => {
    setMinM2Input(minM2.toString());
    setMaxM2Input(maxM2.toString());
  }, [minM2, maxM2]);

  const handleMinM2InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMinM2Input(value);
    if (value) {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setMinM2(Math.min(numValue, maxM2));
      }
    }
  };

  const handleMaxM2InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMaxM2Input(value);
    if (value) {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setMaxM2(Math.max(numValue, minM2));
      }
    }
  };

  const handleM2Blur = () => {
    const min = parseInt(minM2Input) || 0;
    const max = parseInt(maxM2Input) || 500;
    setMinM2(Math.min(min, max));
    setMaxM2(Math.max(min, max));
  };

  // Apply all filters
  useEffect(() => {
    let filtered = [...properties];
    

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const beforeSearch = filtered.length;
      filtered = filtered.filter(property => {
        const title = property.title || '';
        const addressStreet = property.address_street || '';
        const addressCity = property.address_city || '';
        const description = property.description || '';

        return (
          title.toLowerCase().includes(query) ||
          addressStreet.toLowerCase().includes(query) ||
          addressCity.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query)
        );
      });
    }

    // Property type filter
    if (propertyTypes.length > 0) {
      const beforeType = filtered.length;
      filtered = filtered.filter(property =>
        property.property_type && propertyTypes.includes(property.property_type)
      );
    }

    // Price filter
    const beforePrice = filtered.length;
    filtered = filtered.filter(property =>
      property.price >= minPrice && property.price <= maxPrice
    );

    // Bedrooms filter
    if (minBeds > 0) {
      filtered = filtered.filter(property => (property.beds || 0) >= minBeds);
    }

    // Bathrooms filter
    if (minBaths > 0) {
      filtered = filtered.filter(property => (property.baths || 0) >= minBaths);
    }

    const beforeM2 = filtered.length;
    filtered = filtered.filter(property =>
      (property.m2 || 0) >= minM2 && (property.m2 || 0) <= maxM2
    );
    // Status filter - exclude only "pause" status
    filtered = filtered.filter(property => property.status !== 'pause');

    // City filter
    if (selectedCities.length > 0) {
      filtered = filtered.filter(property => {
        const fullAddress = `${property.address_street || ''} ${property.address_city || ''} ${property.address_district || ''}`.toLowerCase();
        return selectedCities.some(city => fullAddress.includes(city.toLowerCase()));
      });
    }

    // Features filters
    Object.keys(features).forEach(key => {
      if (features[key as keyof typeof features]) {
        filtered = filtered.filter(property => property[key as keyof Property]);
      }
    });
    
    if (features.has_parking) {
        filtered = filtered.filter(property => property.parking_type && property.parking_type !== 'none');
    }

    // Condition filter
    if (condition.length > 0) {
      filtered = filtered.filter(property => property.condition && condition.includes(property.condition));
    }

    // Furniture type filter
    if (furnitureType.length > 0) {
      filtered = filtered.filter(property =>
        property.furniture_type && furnitureType.includes(property.furniture_type)
      );
    }

    // Heating type filter
    if (heatingType.length > 0) {
      filtered = filtered.filter(property =>
        property.heating_type && heatingType.includes(property.heating_type)
      );
    }

    // Parking type filter
    if (parkingType.length > 0) {
      filtered = filtered.filter(property =>
        property.parking_type && parkingType.includes(property.parking_type)
      );
    }

    // Building material filter
    if (buildingMaterial.length > 0) {
      filtered = filtered.filter(property =>
        property.building_material && buildingMaterial.includes(property.building_material)
      );
    }

    // Kitchen type filter
    if (kitchenType.length > 0) {
      filtered = filtered.filter(property =>
        property.kitchen_type && kitchenType.includes(property.kitchen_type)
      );
    }

    // Appliquer le tri final avant de mettre à jour l'état
    const sortedProperties = sortProperties(filtered);
    
    
    setFilteredProperties(sortedProperties);

  }, [
    searchQuery, listingType, propertyTypes, minPrice, maxPrice,
    minBeds, minBaths, minM2, maxM2, features, condition,
    furnitureType, heatingType, parkingType, buildingMaterial,
    kitchenType, properties, sortOption, selectedCities
  ]);

  // Update URL when listing type or search changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("type", listingType);
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    navigate(`/properties?${params.toString()}`, { replace: true });
  }, [listingType, searchQuery, navigate]);

  useEffect(() => {
    if (listingTypeFromParams) {
      switch (listingTypeFromParams) {
        case 'sale':
          setActiveTab('filters');
          setListingType('sale');
          break;
        case 'lease':
          setActiveTab('filters');
          setListingType('lease');
          break;
        case 'rent':
          setActiveTab('filters');
          setListingType('rent');
          break;
        case 'rent_by_day':
          setActiveTab('filters');
          setListingType('rent_by_day');
          break;
        case 'auction':
          setActiveTab('filters');
          setListingType('auction');
          break;
        case 'viager':
          setActiveTab('filters');
          setListingType('viager');
          break;
        case 'exceptional_property':
          setActiveTab('filters');
          setListingType('exceptional_property');
          break;
        case 'remere':
          setActiveTab('filters');
          setListingType('remere');
          break;
        case 'vefa':
          setActiveTab('filters');
          setListingType('vefa');
          break;
        case 'vente_a_terme':
          setActiveTab('filters');
          setListingType('vente_a_terme');
          break;
        case 'remere_inverse':
          setActiveTab('filters');
          setListingType('remere_inverse');
          break;
        case 'indivision_nue_propriete':
          setActiveTab('filters');
          setListingType('indivision_nue_propriete');
          break;
        case 'brs':
          setActiveTab('filters');
          setListingType('brs');
          break;
        case 'demenbrement_temporaire':
          setActiveTab('filters');
          setListingType('demenbrement_temporaire');
          break;
        case 'credit_vendeur':
          setActiveTab('filters');
          setListingType('credit_vendeur');
          break;
        case 'copropriete_lot_volume':
          setActiveTab('filters');
          setListingType('copropriete_lot_volume');
          break;
        default:
          break;
      }
    }
  }, [listingTypeFromParams]);

  // Handler functions
  const handlePropertyTypeChange = (type: PropertyType) => {
    setPropertyTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleFeatureChange = (feature: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const handleMultiSelectChange = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleClearFilters = () => {
    setPropertyTypes([]);
    setMinPrice(0);
    setMaxPrice(50000000);
    setMinBeds(0);
    setMinBaths(0);
    setMinM2(0);
    setMaxM2(50000);
    setFeatures({
        has_elevator: false,
        has_air_conditioning: false,
        is_accessible: false,
        has_fireplace: false,
        has_internet: false,
        has_cable_tv: false,
        allows_pets: false,
        allows_smoking: false,
        near_subway: false,
        near_park: false,
        near_school: false,
        has_parking: false,
        has_gas: false,
        has_loggia: false,
        has_dishwasher: false,
        has_washing_machine: false,
        has_gas_stove: false,
        has_vent: false,
        has_electric_kettle: false,
        has_induction_oven: false,
        has_microwave: false,
        has_tv: false,
        has_coffee_machine: false,
        has_audio_system: false,
        has_heater: false,
        has_electric_oven: false,
        has_hair_dryer: false,
        has_cinema: false,
        has_refrigerator: false,
        has_vacuum_cleaner: false,
        has_dryer: false,
        has_iron: false,
        has_co_detector: false,
        has_smoke_detector: false,
        has_evacuation_ladder: false,
        has_fire_fighting_system: false,
        has_perimeter_cameras: false,
        has_alarm: false,
        has_live_protection: false,
        has_locked_entrance: false,
        has_locked_yard: false,
        near_bus_stop: false,
        near_bank: false,
        near_supermarket: false,
        near_kindergarten: false,
        near_city_center: false,
        near_pharmacy: false,
        near_greenery: false,
        near_old_district: false,
        has_satellite_tv: false,
        has_phone_line: false,
    });
    setCondition([]);
    setFurnitureType([]);
    setHeatingType([]);
    setParkingType([]);
    setBuildingMaterial([]);
    setKitchenType([]);
    setSelectedCities([]);
  };

  // Filter options data
  const propertyTypeOptions = [
    { id: "house", label: "Maison" },
    { id: "apartment", label: "Appartement" },
    { id: "land", label: "Terrain" },
    { id: "commercial", label: "Commercial" },
  ];

  const conditionOptions = [
    { id: "newly_renovated", label: "Rénové récemment" },
    { id: "under_renovation", label: "En cours de rénovation" },
    { id: "white_frame", label: "Cadre blanc" },
    { id: "green_frame", label: "Cadre vert" },
    { id: "not_renovated", label: "Non rénové" },
    { id: "black_frame", label: "Cadre noir" },
    { id: "old_renovation", label: "Ancienne rénovation" },
  ];

  const furnitureOptions = [
    { id: "furnished", label: "Meublé" },
    { id: "semi_furnished", label: "Semi-meublé" },
    { id: "unfurnished", label: "Non meublé" },
  ];

  const heatingOptions = [
    { id: "central", label: "Central" },
    { id: "electric", label: "Électrique" },
    { id: "gas", label: "Gaz" },
    { id: "wood", label: "Bois" },
  ];

  const parkingOptions = [
    { id: "garage", label: "Garage" },
    { id: "underground", label: "Souterrain" },
    { id: "street", label: "Rue" },
    { id: "carport", label: "Abri voiture" },
  ];

  const buildingMaterialOptions = [
    { id: "brick", label: "Brique" },
    { id: "concrete", label: "Béton" },
    { id: "wood", label: "Bois" },
    { id: "steel", label: "Acier" },
  ];

  const kitchenTypeOptions = [
    { id: "open", label: "Ouverte" },
    { id: "closed", label: "Fermée" },
    { id: "kitchenette", label: "Kitchenette" },
    { id: "american", label: "Américaine" },
  ];

  const renderPropertyTypeFilter = (prefix = "") => (
    <div className="space-y-2">
      {propertyTypeOptions.map((option) => (
        <div key={`${prefix}${option.id}`} className="flex items-center space-x-2">
          <Checkbox
            id={`${prefix}${option.id}`}
            checked={propertyTypes.includes(option.id as PropertyType)}
            onCheckedChange={(checked) => {
              if (checked) {
                setPropertyTypes([...propertyTypes, option.id as PropertyType]);
              } else {
                setPropertyTypes(propertyTypes.filter(type => type !== option.id));
              }
            }}
          />
          <Label htmlFor={`${prefix}${option.id}`}>
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );

  const renderConditionFilter = (prefix = "") => (
    <div className="space-y-2">
      {conditionOptions.map((option) => (
        <div key={`${prefix}${option.id}`} className="flex items-center space-x-2">
          <Checkbox
            id={`${prefix}${option.id}`}
            checked={condition.includes(option.id)}
            onCheckedChange={() => handleMultiSelectChange(option.id, condition, setCondition)}
          />
          <label
            htmlFor={`${prefix}${option.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );

  const renderFeaturesFilter = (prefix = "") => (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}elevator`}
          checked={features.has_elevator}
          onCheckedChange={() => handleFeatureChange("has_elevator")}
        />
        <label htmlFor={`${prefix}elevator`} className="text-sm">{"Ascenseur"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}ac`}
          checked={features.has_air_conditioning}
          onCheckedChange={() => handleFeatureChange("has_air_conditioning")}
        />
        <label htmlFor={`${prefix}ac`} className="text-sm">{"Climatisation"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}accessible`}
          checked={features.is_accessible}
          onCheckedChange={() => handleFeatureChange("is_accessible")}
        />
        <label htmlFor={`${prefix}accessible`} className="text-sm">{"Accessible"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}fireplace`}
          checked={features.has_fireplace}
          onCheckedChange={() => handleFeatureChange("has_fireplace")}
        />
        <label htmlFor={`${prefix}fireplace`} className="text-sm">{"Cheminée"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}internet`}
          checked={features.has_internet}
          onCheckedChange={() => handleFeatureChange("has_internet")}
        />
        <label htmlFor={`${prefix}internet`} className="text-sm">{"Internet"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}cable-tv`}
          checked={features.has_cable_tv}
          onCheckedChange={() => handleFeatureChange("has_cable_tv")}
        />
        <label htmlFor={`${prefix}cable-tv`} className="text-sm">{"Télévision par câble"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}pets`}
          checked={features.allows_pets}
          onCheckedChange={() => handleFeatureChange("allows_pets")}
        />
        <label htmlFor={`${prefix}pets`} className="text-sm">{"Animaux acceptés"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}smoking`}
          checked={features.allows_smoking}
          onCheckedChange={() => handleFeatureChange("allows_smoking")}
        />
        <label htmlFor={`${prefix}smoking`} className="text-sm">{"Fumeurs acceptés"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}gas`}
          checked={features.has_gas}
          onCheckedChange={() => handleFeatureChange("has_gas")}
        />
        <label htmlFor={`${prefix}gas`} className="text-sm">{"Gaz"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}loggia`}
          checked={features.has_loggia}
          onCheckedChange={() => handleFeatureChange("has_loggia")}
        />
        <label htmlFor={`${prefix}loggia`} className="text-sm">{"Loggia"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}dishwasher`}
          checked={features.has_dishwasher}
          onCheckedChange={() => handleFeatureChange("has_dishwasher")}
        />
        <label htmlFor={`${prefix}dishwasher`} className="text-sm">{"Lave-vaisselle"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}washing-machine`}
          checked={features.has_washing_machine}
          onCheckedChange={() => handleFeatureChange("has_washing_machine")}
        />
        <label htmlFor={`${prefix}washing-machine`} className="text-sm">{"Lave-linge"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}gas-stove`}
          checked={features.has_gas_stove}
          onCheckedChange={() => handleFeatureChange("has_gas_stove")}
        />
        <label htmlFor={`${prefix}gas-stove`} className="text-sm">{"Cuisinière à gaz"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}vent`}
          checked={features.has_vent}
          onCheckedChange={() => handleFeatureChange("has_vent")}
        />
        <label htmlFor={`${prefix}vent`} className="text-sm">{"Ventilation"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}electric-kettle`}
          checked={features.has_electric_kettle}
          onCheckedChange={() => handleFeatureChange("has_electric_kettle")}
        />
        <label htmlFor={`${prefix}electric-kettle`} className="text-sm">{"Bouilloire électrique"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}induction-oven`}
          checked={features.has_induction_oven}
          onCheckedChange={() => handleFeatureChange("has_induction_oven")}
        />
        <label htmlFor={`${prefix}induction-oven`} className="text-sm">{"Four à induction"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}microwave`}
          checked={features.has_microwave}
          onCheckedChange={() => handleFeatureChange("has_microwave")}
        />
        <label htmlFor={`${prefix}microwave`} className="text-sm">{"Micro-ondes"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}tv`}
          checked={features.has_tv}
          onCheckedChange={() => handleFeatureChange("has_tv")}
        />
        <label htmlFor={`${prefix}tv`} className="text-sm">{"Télévision"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}coffee-machine`}
          checked={features.has_coffee_machine}
          onCheckedChange={() => handleFeatureChange("has_coffee_machine")}
        />
        <label htmlFor={`${prefix}coffee-machine`} className="text-sm">{"Machine à café"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}audio-system`}
          checked={features.has_audio_system}
          onCheckedChange={() => handleFeatureChange("has_audio_system")}
        />
        <label htmlFor={`${prefix}audio-system`} className="text-sm">{"Système audio"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}heater`}
          checked={features.has_heater}
          onCheckedChange={() => handleFeatureChange("has_heater")}
        />
        <label htmlFor={`${prefix}heater`} className="text-sm">{"Chauffage"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}electric-oven`}
          checked={features.has_electric_oven}
          onCheckedChange={() => handleFeatureChange("has_electric_oven")}
        />
        <label htmlFor={`${prefix}electric-oven`} className="text-sm">{"Four électrique"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}hair-dryer`}
          checked={features.has_hair_dryer}
          onCheckedChange={() => handleFeatureChange("has_hair_dryer")}
        />
        <label htmlFor={`${prefix}hair-dryer`} className="text-sm">{"Sèche-cheveux"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}cinema`}
          checked={features.has_cinema}
          onCheckedChange={() => handleFeatureChange("has_cinema")}
        />
        <label htmlFor={`${prefix}cinema`} className="text-sm">{"Cinéma"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}refrigerator`}
          checked={features.has_refrigerator}
          onCheckedChange={() => handleFeatureChange("has_refrigerator")}
        />
        <label htmlFor={`${prefix}refrigerator`} className="text-sm">{"Réfrigérateur"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}vacuum-cleaner`}
          checked={features.has_vacuum_cleaner}
          onCheckedChange={() => handleFeatureChange("has_vacuum_cleaner")}
        />
        <label htmlFor={`${prefix}vacuum-cleaner`} className="text-sm">{"Aspirateur"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}dryer`}
          checked={features.has_dryer}
          onCheckedChange={() => handleFeatureChange("has_dryer")}
        />
        <label htmlFor={`${prefix}dryer`} className="text-sm">{"Sèche-linge"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}iron`}
          checked={features.has_iron}
          onCheckedChange={() => handleFeatureChange("has_iron")}
        />
        <label htmlFor={`${prefix}iron`} className="text-sm">{"Fer à repasser"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}co-detector`}
          checked={features.has_co_detector}
          onCheckedChange={() => handleFeatureChange("has_co_detector")}
        />
        <label htmlFor={`${prefix}co-detector`} className="text-sm">{"Détecteur de CO"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}smoke-detector`}
          checked={features.has_smoke_detector}
          onCheckedChange={() => handleFeatureChange("has_smoke_detector")}
        />
        <label htmlFor={`${prefix}smoke-detector`} className="text-sm">{"Détecteur de fumée"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}evacuation-ladder`}
          checked={features.has_evacuation_ladder}
          onCheckedChange={() => handleFeatureChange("has_evacuation_ladder")}
        />
        <label htmlFor={`${prefix}evacuation-ladder`} className="text-sm">{"Échelle d'évacuation"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}fire-fighting-system`}
          checked={features.has_fire_fighting_system}
          onCheckedChange={() => handleFeatureChange("has_fire_fighting_system")}
        />
        <label htmlFor={`${prefix}fire-fighting-system`} className="text-sm">{"Système anti-incendie"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}perimeter-cameras`}
          checked={features.has_perimeter_cameras}
          onCheckedChange={() => handleFeatureChange("has_perimeter_cameras")}
        />
        <label htmlFor={`${prefix}perimeter-cameras`} className="text-sm">{"Caméras périmétriques"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}alarm`}
          checked={features.has_alarm}
          onCheckedChange={() => handleFeatureChange("has_alarm")}
        />
        <label htmlFor={`${prefix}alarm`} className="text-sm">{"Alarme"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}live-protection`}
          checked={features.has_live_protection}
          onCheckedChange={() => handleFeatureChange("has_live_protection")}
        />
        <label htmlFor={`${prefix}live-protection`} className="text-sm">{"Protection en direct"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}locked-entrance`}
          checked={features.has_locked_entrance}
          onCheckedChange={() => handleFeatureChange("has_locked_entrance")}
        />
        <label htmlFor={`${prefix}locked-entrance`} className="text-sm">{"Entrée sécurisée"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}locked-yard`}
          checked={features.has_locked_yard}
          onCheckedChange={() => handleFeatureChange("has_locked_yard")}
        />
        <label htmlFor={`${prefix}locked-yard`} className="text-sm">{"Cour sécurisée"}</label>
      </div>
    </div>
  );

  const renderNearbyFilter = (prefix = "") => (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}subway`}
          checked={features.near_subway}
          onCheckedChange={() => handleFeatureChange("near_subway")}
        />
        <label htmlFor={`${prefix}subway`} className="text-sm">{"Métro"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}park`}
          checked={features.near_park}
          onCheckedChange={() => handleFeatureChange("near_park")}
        />
        <label htmlFor={`${prefix}park`} className="text-sm">{"Parc"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}school`}
          checked={features.near_school}
          onCheckedChange={() => handleFeatureChange("near_school")}
        />
        <label htmlFor={`${prefix}school`} className="text-sm">{"École"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}bus-stop`}
          checked={features.near_bus_stop}
          onCheckedChange={() => handleFeatureChange("near_bus_stop")}
        />
        <label htmlFor={`${prefix}bus-stop`} className="text-sm">{"Arrêt de bus"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}bank`}
          checked={features.near_bank}
          onCheckedChange={() => handleFeatureChange("near_bank")}
        />
        <label htmlFor={`${prefix}bank`} className="text-sm">{"Banque"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}supermarket`}
          checked={features.near_supermarket}
          onCheckedChange={() => handleFeatureChange("near_supermarket")}
        />
        <label htmlFor={`${prefix}supermarket`} className="text-sm">{"Supermarché"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}kindergarten`}
          checked={features.near_kindergarten}
          onCheckedChange={() => handleFeatureChange("near_kindergarten")}
        />
        <label htmlFor={`${prefix}kindergarten`} className="text-sm">{"Jardin d'enfants"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}city-center`}
          checked={features.near_city_center}
          onCheckedChange={() => handleFeatureChange("near_city_center")}
        />
        <label htmlFor={`${prefix}city-center`} className="text-sm">{"Centre-ville"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}pharmacy`}
          checked={features.near_pharmacy}
          onCheckedChange={() => handleFeatureChange("near_pharmacy")}
        />
        <label htmlFor={`${prefix}pharmacy`} className="text-sm">{"Pharmacie"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}greenery`}
          checked={features.near_greenery}
          onCheckedChange={() => handleFeatureChange("near_greenery")}
        />
        <label htmlFor={`${prefix}greenery`} className="text-sm">{"Verdure"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}old-district`}
          checked={features.near_old_district}
          onCheckedChange={() => handleFeatureChange("near_old_district")}
        />
        <label htmlFor={`${prefix}old-district`} className="text-sm">{"Vieux quartier"}</label>
      </div>
    </div>
  );

  const renderAdditionalFeaturesFilter = (prefix = "") => (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}satellite-tv`}
          checked={features.has_satellite_tv}
          onCheckedChange={() => handleFeatureChange("has_satellite_tv")}
        />
        <label htmlFor={`${prefix}satellite-tv`} className="text-sm">{"TV satellite"}</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${prefix}phone-line`}
          checked={features.has_phone_line}
          onCheckedChange={() => handleFeatureChange("has_phone_line")}
        />
        <label htmlFor={`${prefix}phone-line`} className="text-sm">{"Ligne téléphonique"}</label>
      </div>
    </div>
  );

  const renderKeywordSearch = () => (
    <div className="space-y-4">
      <h3 className="font-medium">{"Recherche par mot-clé"}</h3>
      <div className="flex bg-white rounded-lg p-3">
        <div className="flex items-center pl-3 text-estate-neutral-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Rechercher par titre, adresse, ville..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 py-2 px-3 outline-none"
        />
      </div>
    </div>
  );

  const renderMultiSelectFilter = (
    options: { id: string; label: string }[],
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    title: string,
    prefix = ""
  ) => (
    <div className="space-y-2">
      <h4 className="font-medium">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={`${prefix}${option.id}`} className="flex items-center space-x-2">
            <Checkbox
              id={`${prefix}${option.id}`}
              checked={selected.includes(option.id)}
              onCheckedChange={() => handleMultiSelectChange(option.id, selected, setSelected)}
            />
            <label
              htmlFor={`${prefix}${option.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCityFilter = (prefix = "") => (
    <div className="space-y-2">
      <h4 className="font-medium">{"Ville"}</h4>
      <div className="max-h-60 overflow-y-auto">
        {FRENCH_CITIES.map((city) => (
          <div key={`${prefix}city-${city}`} className="flex items-center space-x-2">
            <Checkbox
              id={`${prefix}city-${city}`}
              checked={selectedCities.includes(city)}
              onCheckedChange={() =>
                handleMultiSelectChange(city, selectedCities, setSelectedCities)
              }
            />
            <Label htmlFor={`${prefix}city-${city}`}>
              {city}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile filters drawer
  const renderMobileFilters = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden ${isFilterOpen ? 'block' : 'hidden'}`}>
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-6 overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{"Filtres"}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-estate-neutral-500"
            onClick={() => setIsFilterOpen(false)}
          >
            <X size={24} />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="filters">{"Filtres"}</TabsTrigger>
            <TabsTrigger value="keyword">{"Recherche par mot-clé"}</TabsTrigger>
          </TabsList>
          <TabsContent value="filters">
            <div className="space-y-6">
              {/* Listing Type */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Type d'annonce"}</h3>
                {renderListingTypeFilter()}
              </div>

              {/* Property Type */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Type de propriété"}</h3>
                {renderPropertyTypeFilter("mobile-")}
              </div>

              {/* City Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Ville"}</h3>
                {renderCityFilter("mobile-")}
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h4 className="font-medium">{"Fourchette de prix"}</h4>
                <div className="px-2">
                  <Slider
                    value={[minPrice, maxPrice]}
                    max={50000000}
                    step={500000}
                    onValueChange={(values) => {
                      setMinPrice(values[0]);
                      setMaxPrice(values[1]);
                    }}
                  />
                </div>
                <div className="flex justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-24 border rounded px-2 py-1 text-sm"
                    />
                    <span>€</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-24 border rounded px-2 py-1 text-sm"
                    />
                    <span>€</span>
                  </div>
                </div>
              </div>

              

              {/* Surface (m²) */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Surface (m²)"}</h3>
                <div className="px-2">
                  <Slider
                    value={[minM2, maxM2]}
                    max={50000}
                    step={100}
                    onValueChange={(values) => {
                      setMinM2(values[0]);
                      setMaxM2(values[1]);
                    }}
                  />
                </div>
                <div className="flex justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={minM2Input}
                      onChange={handleMinM2InputChange}
                      onBlur={handleM2Blur}
                      className="w-20 border rounded px-2 py-1 text-sm"
                    />
                    <span className="text-sm">m²</span>
                  </div>
                  <span className="text-sm">{"à"}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={maxM2Input}
                      onChange={handleMaxM2InputChange}
                      onBlur={handleM2Blur}
                      className="w-20 border rounded px-2 py-1 text-sm"
                    />
                    <span className="text-sm">m²</span>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Chambres"}</h3>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4].map(num => (
                    <Button
                      key={`beds-${num}`}
                      variant={minBeds === num ? "default" : "outline"}
                      onClick={() => setMinBeds(num)}
                    >
                      {num === 0 ? "Toutes" : `${num}+`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Salles de bain"}</h3>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4].map(num => (
                    <Button
                      key={`baths-${num}`}
                      variant={minBaths === num ? "default" : "outline"}
                      onClick={() => setMinBaths(num)}
                    >
                      {num === 0 ? "Toutes" : `${num}+`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Caractéristiques"}</h3>
                {renderFeaturesFilter("mobile-")}
              </div>

              {/* Nearby */}
              <div className="space-y-3">
                <h3 className="font-medium">{"À proximité"}</h3>
                {renderNearbyFilter("mobile-")}
              </div>

              {/* Additional Features */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Caractéristiques supplémentaires"}</h3>
                {renderAdditionalFeaturesFilter("mobile-")}
              </div>

              {/* Condition */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Condition"}</h3>
                {renderConditionFilter("mobile-")}
              </div>

              {/* Furniture */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Ameublement"}</h3>
                {renderMultiSelectFilter(furnitureOptions, furnitureType, setFurnitureType, "", "mobile-furniture-")}
              </div>

              {/* Heating */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Chauffage"}</h3>
                {renderMultiSelectFilter(heatingOptions, heatingType, setHeatingType, "", "mobile-heating-")}
              </div>

              {/* Parking */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Parking"}</h3>
                {renderMultiSelectFilter(parkingOptions, parkingType, setParkingType, "", "mobile-parking-")}
              </div>

              {/* Building Material */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Matériau de construction"}</h3>
                {renderMultiSelectFilter(buildingMaterialOptions, buildingMaterial, setBuildingMaterial, "", "mobile-building-")}
              </div>

              {/* Kitchen Type */}
              <div className="space-y-3">
                <h3 className="font-medium">{"Type de cuisine"}</h3>
                {renderMultiSelectFilter(kitchenTypeOptions, kitchenType, setKitchenType, "", "mobile-kitchen-")}
              </div>

            </div>
          </TabsContent>
          <TabsContent value="keyword">
            {renderKeywordSearch()}
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-between">
          <Button variant="ghost" onClick={handleClearFilters}>{"Effacer les filtres"}</Button>
          <Button onClick={() => setIsFilterOpen(false)}>{"Voir les propriétés"}</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-estate-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{"Filtres"}</h2>
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  {"Effacer"}
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="filters">{"Filtres"}</TabsTrigger>
                  <TabsTrigger value="keyword">{"Mot-clé"}</TabsTrigger>
                </TabsList>
                <TabsContent value="filters">
                  <div className="space-y-6 pt-4">
                    {/* Listing Type */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Type d'annonce"}</h3>
                      {renderListingTypeFilter()}
                    </div>

                    {/* Property Type */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Type de propriété"}</h3>
                      {renderPropertyTypeFilter()}
                    </div>

                    {/* City Filter */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Ville"}</h3>
                      {renderCityFilter()}
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <h4 className="font-medium">{"Fourchette de prix"}</h4>
                      <div className="px-2">
                        <Slider
                          value={[minPrice, maxPrice]}
                          max={50000000}
                          step={500000}
                          onValueChange={(values) => {
                            setMinPrice(values[0]);
                            setMaxPrice(values[1]);
                          }}
                        />
                      </div>
                      <div className="flex justify-between gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="w-24 border rounded px-2 py-1 text-sm"
                          />
                          <span>€</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-24 border rounded px-2 py-1 text-sm"
                          />
                          <span>€</span>
                        </div>
                      </div>
                    </div>

                    {/* Surface (m²) */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Surface (m²)"}</h3>
                      <div className="px-2">
                        <Slider
                          value={[minM2, maxM2]}
                          max={50000}
                          step={100}
                          onValueChange={(values) => {
                            setMinM2(values[0]);
                            setMaxM2(values[1]);
                          }}
                        />
                      </div>
                      <div className="flex justify-between gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={minM2Input}
                            onChange={handleMinM2InputChange}
                            onBlur={handleM2Blur}
                            className="w-20 border rounded px-2 py-1 text-sm"
                          />
                          <span className="text-sm">m²</span>
                        </div>
                        <span className="text-sm">{"à"}</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={maxM2Input}
                            onChange={handleMaxM2InputChange}
                            onBlur={handleM2Blur}
                            className="w-20 border rounded px-2 py-1 text-sm"
                          />
                          <span className="text-sm">m²</span>
                        </div>
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Chambres"}</h3>
                      <div className="flex flex-wrap gap-2">
                        {[0, 1, 2, 3, 4].map(num => (
                          <Button
                            key={`beds-${num}`}
                            variant={minBeds === num ? "default" : "outline"}
                            onClick={() => setMinBeds(num)}
                          >
                            {num === 0 ? "Toutes" : `${num}+`}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Bathrooms */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Salles de bain"}</h3>
                      <div className="flex flex-wrap gap-2">
                        {[0, 1, 2, 3, 4].map(num => (
                          <Button
                            key={`baths-${num}`}
                            variant={minBaths === num ? "default" : "outline"}
                            onClick={() => setMinBaths(num)}
                          >
                            {num === 0 ? "Toutes" : `${num}+`}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Caractéristiques"}</h3>
                      {renderFeaturesFilter()}
                    </div>

                    {/* Nearby */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"À proximité"}</h3>
                      {renderNearbyFilter()}
                    </div>

                    {/* Additional Features */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Caractéristiques supplémentaires"}</h3>
                      {renderAdditionalFeaturesFilter()}
                    </div>

                    {/* Condition */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Condition"}</h3>
                      {renderConditionFilter()}
                    </div>

                    {/* Furniture */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Ameublement"}</h3>
                      {renderMultiSelectFilter(furnitureOptions, furnitureType, setFurnitureType, "")}
                    </div>

                    {/* Heating */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Chauffage"}</h3>
                      {renderMultiSelectFilter(heatingOptions, heatingType, setHeatingType, "")}
                    </div>

                    {/* Parking */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Parking"}</h3>
                      {renderMultiSelectFilter(parkingOptions, parkingType, setParkingType, "")}
                    </div>

                    {/* Building Material */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Matériau de construction"}</h3>
                      {renderMultiSelectFilter(buildingMaterialOptions, buildingMaterial, setBuildingMaterial, "")}
                    </div>

                    {/* Kitchen Type */}
                    <div className="space-y-3">
                      <h3 className="font-medium">{"Type de cuisine"}</h3>
                      {renderMultiSelectFilter(kitchenTypeOptions, kitchenType, setKitchenType, "")}
                    </div>

                  </div>
                </TabsContent>
                <TabsContent value="keyword">
                  <div className="pt-4">
                    {renderKeywordSearch()}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </aside>

          {/* Properties List */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">
                {listingType === 'all' ? 'Toutes les propriétés' : 
                 listingType === 'sale' ? 'Propriétés à vendre' :
                 listingType === 'rent' ? 'Propriétés à louer' :
                 listingType === 'rent_by_day' ? 'Propriétés à louer par jour' :
                 listingType === 'lease' ? 'Baux à céder' :
                 listingType === 'auction' ? 'Enchères' :
                 listingType === 'viager' ? 'Propriétés en viager' :
                 listingType === 'exceptional_property' ? 'Biens d\'exception' :
                 listingType === 'remere' ? 'Propriétés en réméré' :
                 listingType === 'vefa' ? 'Vente en l\'état futur d\'achèvement (VEFA)' :
                 listingType === 'vente_a_terme' ? 'Vente à terme' :
                 listingType === 'remere_inverse' ? 'Vente à réméré inversé' :
                 listingType === 'indivision_nue_propriete' ? 'Vente en indivision ou en nue-propriété' :
                 listingType === 'brs' ? 'Vente en bail réel solidaire (BRS)' :
                 listingType === 'demenbrement_temporaire' ? 'Vente en démembrement temporaire' :
                 listingType === 'credit_vendeur' ? 'Vente avec crédit-vendeur' :
                 listingType === 'copropriete_lot_volume' ? 'Vente en copropriété ou en lot de volume' :
                 'Propriétés'}
              </h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('Properties - Clic sur Test Carte, showTestMap actuel:', showTestMap);
                    setShowTestMap(!showTestMap);
                  }}
                  className="flex items-center gap-2"
                >
                  Test Carte
                </Button>
                <ViewOnMapButton
                  onClick={() => {
                    console.log('Properties - Clic sur Voir sur la carte, ouverture du modal');
                    setIsMapModalOpen(true);
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-estate-neutral-500"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <SlidersHorizontal size={24} />
                </Button>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="animate-pulse">
                      <div className="bg-gray-300 h-48 w-full rounded-md mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Test Map */}
                {showTestMap && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Test de la carte</h3>
                    <SimpleMap 
                      center={[46.2276, 2.2137]} 
                      zoom={6} 
                      className="h-96 w-full rounded-lg border"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      {renderMobileFilters()}
      
      {/* Modal de la carte */}
      {console.log('Properties - Rendu du MapModal avec isOpen:', isMapModalOpen, 'properties count:', filteredProperties.length)}
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => {
          console.log('Properties - Fermeture du modal');
          setIsMapModalOpen(false);
        }}
        properties={filteredProperties}
        onPropertyClick={(property) => {
          console.log('Properties - Clic sur propriété dans la carte:', property.id);
          // Rediriger vers la page de détail de la propriété
          navigate(`/property/${property.id}`);
        }}
        title="Propriétés sur la carte"
      />
      
      <Footer />
    </div>
  );
};

export default Properties;