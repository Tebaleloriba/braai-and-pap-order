import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Cart from "@/components/Cart";
import BottomNavigation from "@/components/BottomNavigation";
import AuthModal from "@/components/AuthModal";
import ContactForm from "@/components/ContactForm";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spicy?: boolean;
  popular?: boolean;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToCart = (item: MenuItem, quantity: number) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const placeOrder = async (orderDetails: any) => {
    try {
      // Save order to database
      const { error } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderDetails.name,
          customer_phone: orderDetails.phone,
          customer_address: orderDetails.address,
          special_instructions: orderDetails.notes,
          items: orderDetails.items,
          total: orderDetails.total,
          payment_method: orderDetails.paymentMethod,
          status: 'pending'
        }]);

      if (error) {
        throw error;
      }

      setOrders(prev => [...prev, orderDetails]);
      setCartItems([]);
      
      toast({
        title: "Order Saved",
        description: "Your order has been saved to our system"
      });
    } catch (error: any) {
      console.error('Error saving order:', error);
      toast({
        title: "Warning",
        description: "Order placed but not saved to system",
        variant: "destructive"
      });
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header />
      
      <Hero />
      
      <Menu onAddToCart={addToCart} />
      
      <ContactForm />
      
      <BottomNavigation
        cartItemCount={cartItemCount}
        onCartClick={() => {
          if (!user) {
            setIsAuthModalOpen(true);
            return;
          }
          setIsCartOpen(true);
        }}
        onMenuClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
      />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onPlaceOrder={placeOrder}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          toast({
            title: "Success!",
            description: "You can now place your order"
          });
        }}
      />
    </div>
  );
};

export default Index;
