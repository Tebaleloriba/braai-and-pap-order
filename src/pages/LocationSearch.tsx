import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface LocationResult {
  id: string;
  place_name: string;
  center: [number, number];
  context?: Array<{ text: string }>;
}

const LocationSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isTokenEntered, setIsTokenEntered] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const popularLocations = [
    "Johannesburg CBD, South Africa",
    "Sandton, Johannesburg, South Africa", 
    "Rosebank, Johannesburg, South Africa",
    "Cape Town City Centre, South Africa",
    "Stellenbosch, South Africa",
    "Durban North, South Africa",
    "Pretoria Central, South Africa",
    "Soweto, Johannesburg, South Africa"
  ];

  useEffect(() => {
    const saved = localStorage.getItem("mapboxToken");
    if (saved) {
      setMapboxToken(saved);
      setIsTokenEntered(true);
    }
  }, []);

  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim() || !mapboxToken) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&country=za&limit=5&types=place,locality,neighborhood,address`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.features || []);
      } else {
        throw new Error('Search failed');
      }
    } catch (error) {
      console.error('Location search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search locations. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  }, [mapboxToken, toast]);

  useEffect(() => {
    if (searchQuery.length > 2 && isTokenEntered) {
      const timeoutId = setTimeout(() => {
        searchLocations(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchLocations, isTokenEntered]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem("mapboxToken", mapboxToken);
      setIsTokenEntered(true);
      toast({
        title: "Token Saved",
        description: "Mapbox token saved successfully!",
      });
    }
  };

  const handleLocationSelect = (location: string) => {
    localStorage.setItem("selectedLocation", location);
    toast({
      title: "Location Set", 
      description: `Delivery location set to ${location}`,
    });
    navigate("/");
  };

  if (!isTokenEntered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Mapbox Token Required</h1>
            <p className="text-muted-foreground">
              To search for real locations, please enter your Mapbox public token.
            </p>
            <p className="text-sm text-muted-foreground">
              Get your token from{" "}
              <a 
                href="https://mapbox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your Mapbox public token..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button 
              onClick={handleTokenSubmit}
              className="w-full"
              disabled={!mapboxToken.trim()}
            >
              Save Token
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Set Delivery Location</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              Search for your location
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Enter area, street, or suburb..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Search Results</h2>
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <Card 
                    key={result.id}
                    className="cursor-pointer hover:shadow-warm transition-all duration-200 hover:border-primary/20"
                    onClick={() => handleLocationSelect(result.place_name)}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <span className="text-foreground">{result.place_name}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Popular Locations */}
          {(!searchQuery || searchResults.length === 0) && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                {searchQuery ? "Popular Areas" : "Quick Select"}
              </h2>
              <div className="space-y-2">
                {popularLocations.map((location) => (
                  <Card 
                    key={location}
                    className="cursor-pointer hover:shadow-warm transition-all duration-200 hover:border-primary/20"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-foreground">{location}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {searchQuery && searchResults.length === 0 && !isSearching && searchQuery.length > 2 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No locations found matching "{searchQuery}"</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => handleLocationSelect(searchQuery)}
              >
                Use "{searchQuery}" as location
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;