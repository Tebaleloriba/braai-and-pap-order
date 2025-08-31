import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import LocationSearchBar from "@/components/LocationSearchBar";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Mzansi Kitchen</h1>
              <p className="text-sm text-muted-foreground">Traditional SA Cuisine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              onClick={scrollToMenu}
              size="sm" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-semibold"
            >
              Order Now
            </Button>
          </div>
        </div>
      </header>
      
      {/* Location Search Bar */}
      <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-sm border-b border-border py-3">
        <LocationSearchBar />
      </div>
    </>
  );
};

export default Header;