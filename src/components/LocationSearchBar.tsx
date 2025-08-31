import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

interface LocationSearchBarProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const LocationSearchBar = ({ onLocationSelect }: LocationSearchBarProps) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);

  useEffect(() => {
    // Check if API key is stored
    const storedApiKey = localStorage.getItem('googleMapsApiKey');
    if (storedApiKey) {
      setGoogleMapsApiKey(storedApiKey);
      setShowApiKeyInput(false);
      loadGoogleMaps(storedApiKey);
    }
  }, []);

  const loadGoogleMaps = (apiKey: string) => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
        initializeServices();
      };
      script.onerror = () => {
        alert('Failed to load Google Maps. Please check your API key.');
      };
      document.head.appendChild(script);
    } else {
      setIsGoogleMapsLoaded(true);
      initializeServices();
    }
  };

  const handleApiKeySubmit = () => {
    if (googleMapsApiKey.trim()) {
      localStorage.setItem('googleMapsApiKey', googleMapsApiKey);
      setShowApiKeyInput(false);
      loadGoogleMaps(googleMapsApiKey);
    }
  };

  const initializeServices = () => {
    if (window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      // Create a dummy div for PlacesService
      const dummyMap = new window.google.maps.Map(document.createElement('div'));
      placesService.current = new window.google.maps.places.PlacesService(dummyMap);
    }
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    
    if (!value.trim() || !autocompleteService.current) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    const request = {
      input: value,
      componentRestrictions: { country: 'za' }, // Restrict to South Africa
      types: ['address', 'establishment']
    };

    autocompleteService.current.getPlacePredictions(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setPredictions(results);
        setIsOpen(true);
      } else {
        setPredictions([]);
        setIsOpen(false);
      }
    });
  };

  const handleSelectLocation = (prediction: PlacePrediction) => {
    if (!placesService.current) return;

    const request = {
      placeId: prediction.place_id,
      fields: ['geometry', 'formatted_address']
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || prediction.description
        };
        
        setSelectedLocation(prediction.description);
        setQuery("");
        setIsOpen(false);
        setPredictions([]);
        
        // Store in localStorage
        localStorage.setItem('selectedLocation', JSON.stringify(location));
        
        onLocationSelect?.(location);
      }
    });
  };

  const clearLocation = () => {
    setSelectedLocation("");
    localStorage.removeItem('selectedLocation');
  };

  // Load saved location on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedLocation');
    if (saved) {
      const location = JSON.parse(saved);
      setSelectedLocation(location.address);
    }
  }, []);

  if (showApiKeyInput) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <Card className="p-4">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Enter your Google Maps API key to enable location search:
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Google Maps API Key"
                value={googleMapsApiKey}
                onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
              />
              <Button onClick={handleApiKeySubmit} size="sm">
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key from{' '}
              <a 
                href="https://console.cloud.google.com/google/maps-apis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isGoogleMapsLoaded) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center text-muted-foreground">
          Loading location services...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 relative">
      {selectedLocation ? (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium truncate flex-1">{selectedLocation}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLocation}
            className="h-6 w-6 p-0 hover:bg-destructive/10"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for your location..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          
          {isOpen && predictions.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-auto">
              {predictions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  onClick={() => handleSelectLocation(prediction)}
                  className="w-full p-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                >
                  <div className="font-medium text-sm">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </button>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearchBar;