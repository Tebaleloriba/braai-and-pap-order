import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Promos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Promos</h1>
          </div>
          
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center bg-gradient-card border-border/50 shadow-warm">
            <CardHeader className="pb-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Tag className="w-10 h-10 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl md:text-3xl text-foreground">
                No Promos Available
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                We don't have any active promotions at the moment
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-muted-foreground max-w-lg mx-auto">
                Stay tuned! We're always cooking up something special for our valued customers. 
                Check back soon for exciting deals and offers on your favorite traditional South African dishes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Browse Menu
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Promos;