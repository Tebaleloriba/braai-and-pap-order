import { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const LocationSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const popularLocations = [
    "Johannesburg CBD",
    "Sandton",
    "Rosebank",
    "Cape Town City Centre",
    "Stellenbosch",
    "Durban North",
    "Pretoria Central",
    "Soweto"
  ];

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", location);
    toast({
      title: "Location Set",
      description: `Delivery location set to ${location}`,
    });
    navigate("/");
  };

  const filteredLocations = popularLocations.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Input
              id="search"
              type="text"
              placeholder="Enter area, street, or suburb..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Popular Areas</h2>
            <div className="space-y-2">
              {filteredLocations.map((location) => (
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

          {searchQuery && filteredLocations.length === 0 && (
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