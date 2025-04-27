
import React, { useState } from "react";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileMinus, ChevronDown, ChevronUp, Package } from "lucide-react";
import OfferExtrasDialog from "../../Marketplace/components/OfferExtrasDialog";
import { Badge } from "@/components/ui/badge";

interface OfferPlateItemRowProps {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onExtrasChange?: (itemId: string, extras: any[]) => void;
}

const OfferPlateItemRow: React.FC<OfferPlateItemRowProps> = ({
  item,
  onQuantityChange,
  onRemove,
  onExtrasChange
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<{[key: string]: number}>(
    (item.extras || []).reduce((acc, extra) => {
      acc[extra.id] = extra.quantity || 0;
      return acc;
    }, {} as {[key: string]: number})
  );

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

  const handleExtrasChange = (extrasSelection: {[key: string]: number}) => {
    setSelectedExtras(extrasSelection);
    
    if (onExtrasChange && item.id) {
      // Convertir la sélection en array d'extras pour l'API
      const extrasArray = item.offer.extras?.filter(extra => 
        extrasSelection[extra.id] && extrasSelection[extra.id] > 0
      ).map(extra => ({
        ...extra,
        quantity: extrasSelection[extra.id]
      })) || [];
      
      onExtrasChange(item.id, extrasArray);
    }
  };

  // Calcul du nombre d'extras et de leur prix total
  const extrasCount = Object.values(selectedExtras).filter(qty => qty > 0).length;
  const extrasTotalPrice = item.offer.extras?.reduce((sum, extra) => {
    const qty = selectedExtras[extra.id] || 0;
    return sum + (extra.unitPrice * qty);
  }, 0) || 0;

  // Vérifie si l'offre a des extras disponibles
  const hasExtras = item.offer.extras && item.offer.extras.length > 0;

  return (
    <div className="flex flex-col p-4 border rounded-md bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="flex-1">
          <h3 className="font-medium">{item.offer.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.offer.description}</p>
          
          <div className="flex flex-wrap mt-2 gap-2">
            {item.offer.features && item.offer.features.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
                onClick={() => setShowFeatures(!showFeatures)}
              >
                {showFeatures ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" /> 
                    Masquer les fonctionnalités
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" /> 
                    Afficher les fonctionnalités
                  </>
                )}
              </Button>
            )}
            
            {hasExtras && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
                onClick={() => setShowExtras(true)}
              >
                <Package className="w-4 h-4 mr-1" />
                {extrasCount > 0 ? (
                  <>
                    Options ({extrasCount}, +{extrasTotalPrice.toFixed(2)} €)
                  </>
                ) : (
                  <>
                    Sélectionner des options
                  </>
                )}
              </Button>
            )}
          </div>
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
      
      {showFeatures && item.offer.features && item.offer.features.length > 0 && (
        <div className="mt-3 pl-4 border-t pt-3">
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {item.offer.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {hasExtras && (
        <OfferExtrasDialog
          open={showExtras}
          onOpenChange={setShowExtras}
          extras={item.offer.extras || []}
          onSaveSelection={handleExtrasChange}
          initialSelection={selectedExtras}
        />
      )}
    </div>
  );
};

export default OfferPlateItemRow;
