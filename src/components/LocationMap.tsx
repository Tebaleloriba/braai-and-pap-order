import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Navigation } from "lucide-react";

interface LocationMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

const LocationMap = ({ onLocationSelect }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isTokenEntered, setIsTokenEntered] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenEntered(true);
      initializeMap();
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          onLocationSelect?.({
            ...location,
            address: "Current Location"
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const initializeMap = async () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      // Dynamic import of mapbox-gl
      const mapboxgl = await import('mapbox-gl');
      
      mapboxgl.default.accessToken = mapboxToken;
      
      const map = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [28.0473, -26.2041], // Johannesburg coordinates
        zoom: 10
      });

      // Add navigation controls
      map.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      // Add click event to select location
      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        
        // Remove existing markers
        const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
        existingMarkers.forEach(marker => marker.remove());
        
        // Add new marker
        new mapboxgl.default.Marker()
          .setLngLat([lng, lat])
          .addTo(map);

        onLocationSelect?.({
          lat,
          lng,
          address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        });
      });

      // If we have current location, center map there
      if (currentLocation) {
        map.setCenter([currentLocation.lng, currentLocation.lat]);
        new mapboxgl.default.Marker()
          .setLngLat([currentLocation.lng, currentLocation.lat])
          .addTo(map);
      }

    } catch (error) {
      console.error("Error loading map:", error);
    }
  };

  useEffect(() => {
    if (isTokenEntered && mapboxToken) {
      initializeMap();
    }
  }, [isTokenEntered, mapboxToken, currentLocation]);

  if (!isTokenEntered) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Delivery Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              To show the delivery map, please enter your Mapbox API token. You can get one free at{" "}
              <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                mapbox.com
              </a>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your Mapbox API token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={handleTokenSubmit} className="flex-1">
                Initialize Map
              </Button>
              <Button variant="outline" onClick={getCurrentLocation}>
                <Navigation className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </div>
          </div>

          {currentLocation && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Current Location:</strong><br />
                Latitude: {currentLocation.lat.toFixed(4)}<br />
                Longitude: {currentLocation.lng.toFixed(4)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <section id="location" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Select Delivery Location
          </h2>
          <p className="text-xl text-muted-foreground">
            Click on the map to set your delivery location
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Card>
              <CardContent className="p-0">
                <div ref={mapContainer} className="w-full h-96 rounded-lg" />
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-80 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Location Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" onClick={getCurrentLocation} className="w-full justify-start">
                  <Navigation className="w-4 h-4 mr-2" />
                  Use Current Location
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Johannesburg CBD
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Sandton
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Cape Town
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Restaurant Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Mzansi Kitchen</p>
                  <p className="text-muted-foreground">
                    123 Heritage Street<br />
                    Johannesburg, 2001<br />
                    South Africa
                  </p>
                  <p className="text-muted-foreground">
                    Phone: +27 11 123 4567
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;