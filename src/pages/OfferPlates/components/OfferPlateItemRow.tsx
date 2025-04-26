
import React, { useState } from "react";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileMinus } from "lucide-react";

interface OfferPlateItemRowProps {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const OfferPlateItemRow: React.FC<OfferPlateItemRowProps> = ({
  item,
  onQuantityChange,
  onRemove
}) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleBlur = () => {
    if (quantity !== item.quantity) {
      onQuantityChange(item.id || "", quantity);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 border rounded-md bg-white">
      <div className="flex-1">
        <h3 className="font-medium">{item.offer.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.offer.description}</p>
      </div>
      
      <div className="flex items-center mt-3 sm:mt-0">
        <div className="mr-4">
          <div className="text-xs text-muted-foreground mb-1">Prix mensuel</div>
          <div className="font-medium">{item.offer.priceMonthly} €</div>
        </div>
        
        {item.offer.setupFee > 0 && (
          <div className="mr-4">
            <div className="text-xs text-muted-foreground mb-1">Frais d'installation</div>
            <div className="font-medium">{item.offer.setupFee} €</div>
          </div>
        )}
        
        <div className="w-20 mr-4">
          <div className="text-xs text-muted-foreground mb-1">Quantité</div>
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleBlur}
            min={1}
            className="h-8"
          />
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id || "")}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <FileMinus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OfferPlateItemRow;
