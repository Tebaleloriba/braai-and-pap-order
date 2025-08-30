import { useState, useEffect } from "react";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const LocationSelector = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("selectedLocation");
    if (saved) {
      setSelectedLocation(saved);
    }
  }, []);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            Delivery Location
          </h2>
          
          <Card className="bg-card border-border/50 shadow-warm">
            <CardContent className="p-6">
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-4 hover:bg-muted/50"
                onClick={() => navigate("/location-search")}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">
                      {selectedLocation || "Set Location"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLocation 
                        ? "Tap to change delivery location" 
                        : "Choose where to deliver your order"
                      }
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LocationSelector;