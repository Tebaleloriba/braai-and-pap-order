import { Button } from "@/components/ui/button";
import { Home, Menu, ShoppingCart, Tag, MoreHorizontal } from "lucide-react";

interface BottomNavigationProps {
  cartItemCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const BottomNavigation = ({ cartItemCount, onCartClick, onMenuClick }: BottomNavigationProps) => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around py-2 px-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          onClick={() => scrollToSection('menu')}
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs">Menu</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center gap-1 h-auto py-2 px-3 relative"
          onClick={onCartClick}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-xs">Cart</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center gap-1 h-auto py-2 px-3"
        >
          <Tag className="w-5 h-5" />
          <span className="text-xs">Promos</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center gap-1 h-auto py-2 px-3"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-xs">More</span>
        </Button>
      </div>
    </div>
  );
};

export default BottomNavigation;