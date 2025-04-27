
import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Package } from "lucide-react";
import { CartItem } from "@/types";
import { updateCartItemQuantity, removeCartItem } from "../CartService";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

  // Calcul du prix des extras pour cet article
  const extrasCount = item.extras?.length || 0;
  const extrasTotalPrice = item.extras?.reduce((total, extra) => {
    return total + (extra.unitPrice * extra.quantity);
  }, 0) || 0;

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
      <TableCell>
        {extrasCount > 0 ? (
          <div className="flex items-center">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              <span>{extrasCount}</span>
            </Badge>
            <span className="ml-2 text-sm text-gray-600">+{extrasTotalPrice.toFixed(2)}€</span>
          </div>
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
  );
};

export default CartItemRow;
