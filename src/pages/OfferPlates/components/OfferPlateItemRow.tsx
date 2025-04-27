
import React, { useState } from "react";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileMinus, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OfferPlateItemRowProps {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number, extras?: any[]) => void;
  onRemove: (itemId: string) => void;
}

const OfferPlateItemRow: React.FC<OfferPlateItemRowProps> = ({
  item,
  onQuantityChange,
  onRemove
}) => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [extrasDialogOpen, setExtrasDialogOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState(item.extras || []);

  const handleExtrasUpdate = () => {
    onQuantityChange(item.id || "", item.quantity, selectedExtras);
    setExtrasDialogOpen(false);
  };

  const hasExtras = item.offer.extras && item.offer.extras.length > 0;
  const extrasCount = selectedExtras.reduce((sum, extra) => sum + extra.quantity, 0);
  const totalExtrasPrice = selectedExtras.reduce((sum, extra) => 
    sum + (extra.quantity * extra.unitPrice), 0);

  return (
    <div className="flex flex-col p-4 border rounded-md bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="flex-1">
          <h3 className="font-medium">{item.offer.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.offer.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {item.offer.features && item.offer.features.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFeatures(!showFeatures)}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
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
                onClick={() => setShowExtras(!showExtras)}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
              >
                {showExtras ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" /> 
                    Masquer les options
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" /> 
                    Afficher les options
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
          
          {hasExtras && (
            <div className="mr-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExtrasDialogOpen(true)}
                className="h-8"
              >
                {extrasCount > 0 
                  ? `${extrasCount} extra${extrasCount > 1 ? 's' : ''} (${totalExtrasPrice}€)`
                  : "Gérer les options"}
              </Button>
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
            {item.offer.extras.map((extra, idx) => (
              <li key={idx}>
                {extra.name} ({extra.unitPrice}€)
                {selectedExtras.find(e => e.id === extra.id)?.quantity > 0 && (
                  <span className="ml-2 text-primary">
                    × {selectedExtras.find(e => e.id === extra.id)?.quantity}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog open={extrasDialogOpen} onOpenChange={setExtrasDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gestion des options</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {item.offer.extras?.map((extra) => {
                const quantity = selectedExtras.find(e => e.id === extra.id)?.quantity || 0;
                return (
                  <div
                    key={extra.id}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <div>
                      <p className="font-medium">{extra.name}</p>
                      <p className="text-sm text-muted-foreground">{extra.description}</p>
                      <p className="text-sm text-primary">{extra.unitPrice}€</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newExtras = selectedExtras.filter(e => e.id !== extra.id);
                          if (quantity > 1) {
                            newExtras.push({ ...extra, quantity: quantity - 1 });
                          }
                          setSelectedExtras(newExtras);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newExtras = selectedExtras.filter(e => e.id !== extra.id);
                          newExtras.push({ ...extra, quantity: quantity + 1 });
                          setSelectedExtras(newExtras);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setExtrasDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleExtrasUpdate}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfferPlateItemRow;
