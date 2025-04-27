
import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { CartItem } from "@/types";
import { updateCartItemQuantity, removeCartItem } from "../CartService";
import { useToast } from "@/hooks/use-toast";

interface CartItemRowProps {
  item: CartItem;
  onUpdate: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdate }) => {
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);
  const [showExtras, setShowExtras] = useState(false);

  const handleRemoveItem = async () => {
    if (!item.id) return;
    
    try {
      setIsRemoving(true);
      await removeCartItem(item.id);
      toast({
        title: "Article supprimé",
        description: `${item.offer.name} a été supprimé du panier.`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const totalExtrasPrice = item.extras?.reduce((sum, extra) => 
    sum + (extra.quantity * extra.unitPrice), 0) || 0;

  const extrasCount = item.extras?.reduce((sum, extra) => 
    sum + extra.quantity, 0) || 0;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{item.offer.name}</TableCell>
        <TableCell>{item.offer.description}</TableCell>
        <TableCell className="text-right">
          {item.offer.setupFee > 0 ? `${Number(item.offer.setupFee).toFixed(2)}€` : "-"}
        </TableCell>
        <TableCell className="text-right">
          {item.offer.priceMonthly > 0 ? `${Number(item.offer.priceMonthly).toFixed(2)}€` : "-"}
        </TableCell>
        <TableCell className="text-right">
          {extrasCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExtras(!showExtras)}
              className="text-primary"
            >
              {extrasCount} extra{extrasCount > 1 ? 's' : ''} 
              ({totalExtrasPrice.toFixed(2)}€)
              {showExtras ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>
          <Button 
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleRemoveItem}
            disabled={isRemoving}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
      {showExtras && item.extras && item.extras.length > 0 && (
        <TableRow className="bg-muted/50">
          <TableCell colSpan={6} className="py-2">
            <div className="pl-4 space-y-1">
              {item.extras.map((extra, idx) => (
                <div key={idx} className="text-sm flex justify-between">
                  <span>{extra.name}</span>
                  <span className="text-muted-foreground">
                    {extra.quantity} × {extra.unitPrice}€ = {(extra.quantity * extra.unitPrice).toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default CartItemRow;
