import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Home, Menu, ShoppingCart, Tag, MoreHorizontal, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface BottomNavigationProps {
  cartItemCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  user: any;
  onSignInClick: () => void;
}

const BottomNavigation = ({ cartItemCount, onCartClick, onMenuClick, user, onSignInClick }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
          onClick={() => navigate('/promos')}
        >
          <Tag className="w-5 h-5" />
          <span className="text-xs">Promos</span>
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center gap-1 h-auto py-2 px-3"
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-xs">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <User className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Signed in as</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-muted-foreground mb-3">You are not signed in</p>
                    <Button
                      onClick={onSignInClick}
                      className="w-full flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default BottomNavigation;