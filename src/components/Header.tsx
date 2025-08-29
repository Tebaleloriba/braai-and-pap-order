import { Button } from "@/components/ui/button";
import { ShoppingCart, MapPin } from "lucide-react";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemCount, onCartClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-hero rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm sm:text-lg">M</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">Mzansi Kitchen</h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Traditional SA Cuisine</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#menu" className="text-foreground hover:text-primary transition-colors">Menu</a>
          <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
          <a href="#location" className="text-foreground hover:text-primary transition-colors">Location</a>
        </nav>
        
        <div className="flex items-center space-x-1 sm:space-x-4">
          <Button variant="outline" size="sm" className="hidden lg:flex">
            <MapPin className="w-4 h-4 mr-2" />
            Track Order
          </Button>
          <Button onClick={onCartClick} variant="secondary" size="sm" className="relative">
            <ShoppingCart className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;