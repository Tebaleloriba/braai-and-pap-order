
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Trash2, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PaymentMethodDialog from "./PaymentMethodDialog";
import CardPaymentForm from "./CardPaymentForm";

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
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const { toast } = useToast();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = total > 200 ? 0 : 35;
  const finalTotal = total + deliveryFee;

  const validateOrderDetails = () => {
    if (!orderDetails.name || !orderDetails.phone || !orderDetails.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart first",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrderClick = () => {
    if (!validateOrderDetails()) return;
    setShowPaymentMethod(true);
  };

  const handlePaymentMethodSelect = async (method: "cash" | "card") => {
    setShowPaymentMethod(false);

    if (method === "cash") {
      await processOrder("Cash on Delivery");
    } else {
      setShowCardPayment(true);
    }
  };

  const processOrder = async (paymentMethod: string) => {
    try {
      // Send order email notification
      const { error } = await supabase.functions.invoke('send-order-email', {
        body: {
          customerName: orderDetails.name,
          customerPhone: orderDetails.phone,
          customerAddress: orderDetails.address,
          specialInstructions: orderDetails.notes,
          items: cartItems,
          total: finalTotal,
          paymentMethod: paymentMethod
        }
      });

      if (error) {
        console.error('Email sending error:', error);
        toast({
          title: "Order Placed",
          description: "Your order was placed successfully, but we couldn't send the confirmation email.",
          variant: "default"
        });
      } else {
        toast({
          title: "Order Placed!",
          description: `Your delicious meal is being prepared. Payment method: ${paymentMethod}`
        });
      }

      onPlaceOrder({
        ...orderDetails,
        items: cartItems,
        total: finalTotal,
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString()
      });

      // Reset form and close cart
      setOrderDetails({ name: "", phone: "", address: "", notes: "" });
      onClose();
    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: "Error",
        description: "There was an issue placing your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCardPaymentComplete = () => {
    processOrder("Credit/Debit Card");
    setShowCardPayment(false);
  };

  const handleBackFromCardPayment = () => {
    setShowCardPayment(false);
    setShowPaymentMethod(true);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg">
          {!showCardPayment ? (
            <>
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
                    onClick={handlePlaceOrderClick}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                  >
                    Place Order - R{finalTotal}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-6">
              <CardPaymentForm
                total={finalTotal}
                onBack={handleBackFromCardPayment}
                onPaymentComplete={handleCardPaymentComplete}
                orderDetails={orderDetails}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      <PaymentMethodDialog
        isOpen={showPaymentMethod}
        onClose={() => setShowPaymentMethod(false)}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        total={finalTotal}
      />
    </>
  );
};

export default Cart;
