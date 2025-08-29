
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentMethodSelect: (method: "cash" | "card") => void;
  total: number;
}

const PaymentMethodDialog = ({ isOpen, onClose, onPaymentMethodSelect, total }: PaymentMethodDialogProps) => {
  const [selectedMethod, setSelectedMethod] = useState<"cash" | "card">("cash");

  const handleProceed = () => {
    onPaymentMethodSelect(selectedMethod);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold">Total: R{total}</p>
          </div>

          <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as "cash" | "card")}>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center space-x-3 cursor-pointer flex-1">
                <Banknote className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleProceed} className="flex-1">
              Proceed with {selectedMethod === "cash" ? "Cash" : "Card"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
