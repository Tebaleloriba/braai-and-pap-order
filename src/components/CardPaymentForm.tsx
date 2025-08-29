
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Lock, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CardPaymentFormProps {
  total: number;
  onBack: () => void;
  onPaymentComplete: () => void;
  orderDetails: any;
  onLocationUpdate?: (address: string) => void;
}

const CardPaymentForm = ({ total, onBack, onPaymentComplete, orderDetails, onLocationUpdate }: CardPaymentFormProps) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const isFormValid = () => {
    return cardDetails.cardNumber.replace(/\s/g, '').length >= 16 &&
           cardDetails.expiryDate.length === 5 &&
           cardDetails.cvv.length === 3 &&
           cardDetails.cardholderName.trim().length > 0;
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          onLocationUpdate?.(locationString);
          setIsGettingLocation(false);
          toast({
            title: "Location Updated",
            description: "Current location has been set as delivery address"
          });
        },
        (error) => {
          setIsGettingLocation(false);
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to get current location. Please enter address manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
    }
  };

  const handlePayment = async () => {
    if (!isFormValid()) {
      toast({
        title: "Invalid Card Details",
        description: "Please fill in all card details correctly",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful!",
        description: "Your order has been confirmed and is being prepared."
      });
      onPaymentComplete();
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Card Payment</span>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-2xl font-bold text-primary">R{total}</p>
          <p className="text-sm text-muted-foreground">Total Amount</p>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="text-xs text-muted-foreground">{orderDetails.address || "No address set"}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  "Getting..."
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-1" />
                    Use Current
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="cardholderName" className="text-sm">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={cardDetails.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              className="text-sm sm:text-base"
            />
          </div>

          <div>
            <Label htmlFor="cardNumber" className="text-sm">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              maxLength={19}
              className="text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="expiryDate" className="text-sm">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                maxLength={5}
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="text-sm">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                maxLength={3}
                className="text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Your payment is secured with SSL encryption</span>
        </div>

        <Button 
          onClick={handlePayment}
          disabled={!isFormValid() || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? "Processing..." : `Pay R${total}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardPaymentForm;
