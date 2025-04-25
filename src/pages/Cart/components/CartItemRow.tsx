
import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/types";
import { updateCartItemQuantity, removeCartItem } from "../CartService";
import { useToast } from "@/hooks/use-toast";

interface CartItemRowProps {
  item: CartItem;
  onUpdate: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdate }) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 || e.target.value === '') {
      setQuantity(value || 0);
    }
  };

  const handleUpdateQuantity = async () => {
    if (quantity === item.quantity || quantity <= 0) return;
    
    try {
      setIsUpdating(true);
      await updateCartItemQuantity(item.id!, quantity);
      toast({
        title: "Quantité mise à jour",
        description: `La quantité de ${item.offer.name} a été mise à jour.`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async () => {
    try {
      setIsRemoving(true);
      await removeCartItem(item.id!);
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

  return (
    <TableRow>
      <TableCell className="font-medium">{item.offer.name}</TableCell>
      <TableCell>{item.offer.description}</TableCell>
      <TableCell className="text-right">{Number(item.offer.price).toFixed(2)} €</TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Input
            type="number"
            min="1"
            className="w-20 text-right"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleUpdateQuantity}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleQuantityChange}
            disabled={quantity === item.quantity || isUpdating}
          >
            ✓
          </Button>
        </div>
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
