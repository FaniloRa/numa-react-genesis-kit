import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CartItem, OfferExtra } from "@/types";
import { updateCartItemQuantity, removeCartItem } from "../CartService";
import { useToast } from "@/hooks/use-toast";

interface CartItemRowProps {
  item: CartItem;
  onUpdate: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdate }) => {
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);

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

  const calculateExtrasTotal = () => {
    if (!item.selectedExtras || !item.offer.extras) return 0;
    return item.selectedExtras.reduce((total, selected) => {
      const extra = item.offer.extras?.find(e => e.id === selected.extraId);
      if (extra) {
        total += extra.unitPrice * selected.quantity;
      }
      return total;
    }, 0);
  };

  const getSelectedExtrasCount = () => {
    return item.selectedExtras?.reduce((total, extra) => total + extra.quantity, 0) || 0;
  };

  return (
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
        {getSelectedExtrasCount() > 0 ? (
          <div className="text-sm">
            <div>{getSelectedExtrasCount()} extra(s)</div>
            <div className="text-muted-foreground">{calculateExtrasTotal().toFixed(2)}€</div>
          </div>
        ) : "-"}
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
  );
};

export default CartItemRow;
