
import React, { useState } from "react";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileMinus, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [showFeatures, setShowFeatures] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [showExtrasDialog, setShowExtrasDialog] = useState(false);
  const [selectedQuantities, setSelectedQuantities] = useState<{[key: string]: number}>(
    item.selectedExtras?.reduce((acc, extra) => ({
      ...acc,
      [extra.extraId]: extra.quantity
    }), {}) || {}
  );

  const calculateTotalPrice = () => {
    let total = item.offer.priceMonthly;
    if (item.selectedExtras && item.offer.extras) {
      total += item.selectedExtras.reduce((sum, selected) => {
        const extra = item.offer.extras?.find(e => e.id === selected.extraId);
        if (extra) {
          sum += extra.unitPrice * selected.quantity;
        }
        return sum;
      }, 0);
    }
    return total;
  };

  const handleExtrasQuantityChange = (extraId: string, quantity: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [extraId]: Math.max(0, quantity)
    }));
  };

  const hasExtras = item.offer.extras && item.offer.extras.length > 0;

  return (
    <div className="flex flex-col p-4 border rounded-md bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="flex-1">
          <h3 className="font-medium">{item.offer.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.offer.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {item.offer.features && item.offer.features.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFeatures(!showFeatures)}
              >
                {showFeatures ? (
                  <ChevronUp className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 mr-1" />
                )}
                Fonctionnalités
              </Button>
            )}

            {hasExtras && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowExtras(!showExtras)}
                >
                  {showExtras ? (
                    <ChevronUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 mr-1" />
                  )}
                  Options
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExtrasDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Gérer les quantités
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center mt-3 sm:mt-0">
          <div className="mr-4">
            <div className="text-xs text-muted-foreground mb-1">Prix mensuel</div>
            <div className="font-medium">{calculateTotalPrice()} €</div>
          </div>
          
          {item.offer.setupFee > 0 && (
            <div className="mr-4">
              <div className="text-xs text-muted-foreground mb-1">Frais d'installation</div>
              <div className="font-medium">{item.offer.setupFee} €</div>
            </div>
          )}
          
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
      
      {showFeatures && item.offer.features && item.offer.features.length > 0 && (
        <div className="mt-3 pl-4 border-t pt-3">
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {item.offer.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {showExtras && hasExtras && (
        <div className="mt-3 pl-4 border-t pt-3">
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {item.offer.extras?.map((extra) => (
              <li key={extra.id}>
                {extra.name} ({extra.unitPrice}€)
                {selectedQuantities[extra.id] > 0 && (
                  <span className="ml-2 text-primary">
                    × {selectedQuantities[extra.id]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog open={showExtrasDialog} onOpenChange={setShowExtrasDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gérer les options</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-4">
              {item.offer.extras?.map((extra) => (
                <div key={extra.id} className="flex items-center justify-between gap-4 py-2 border-b">
                  <div>
                    <h4 className="font-medium">{extra.name}</h4>
                    {extra.description && (
                      <p className="text-sm text-muted-foreground">{extra.description}</p>
                    )}
                    <p className="text-sm font-medium text-primary">{extra.unitPrice}€</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExtrasQuantityChange(
                        extra.id,
                        (selectedQuantities[extra.id] || 0) - 1
                      )}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">
                      {selectedQuantities[extra.id] || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExtrasQuantityChange(
                        extra.id,
                        (selectedQuantities[extra.id] || 0) + 1
                      )}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfferPlateItemRow;
