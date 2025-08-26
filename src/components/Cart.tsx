import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Trash2, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: (orderDetails: any) => void;
}

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onPlaceOrder }: CartProps) => {
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  const { toast } = useToast();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = total > 200 ? 0 : 35;
  const finalTotal = total + deliveryFee;

  const handlePlaceOrder = () => {
    if (!orderDetails.name || !orderDetails.phone || !orderDetails.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart first",
        variant: "destructive"
      });
      return;
    }

    onPlaceOrder({
      ...orderDetails,
      items: cartItems,
      total: finalTotal,
      timestamp: new Date().toISOString()
    });

    toast({
      title: "Order Placed!",
      description: "Your delicious meal is being prepared. We'll track your location for delivery."
    });

    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Order</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Cart Items */}
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">R{item.price} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Order Total */}
          {cartItems.length > 0 && (
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R{total}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? "FREE" : `R${deliveryFee}`}</span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-xs text-primary">Free delivery on orders over R200!</p>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>R{finalTotal}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Order Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Delivery Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={orderDetails.name}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={orderDetails.phone}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Your phone"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={orderDetails.address}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Your delivery address"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Special Instructions</Label>
              <Textarea
                id="notes"
                value={orderDetails.notes}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requests..."
                rows={2}
              />
            </div>

            <Button 
              onClick={handlePlaceOrder}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Place Order - R{finalTotal}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;