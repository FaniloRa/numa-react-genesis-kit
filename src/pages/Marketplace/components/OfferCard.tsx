
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Offer } from "@/types";
import { addToCart } from "../MarketplaceService";
import { Eye, ShoppingCart, List } from "lucide-react";

interface OfferCardProps {
  offer: Offer;
  onViewDetails: (offer: Offer) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onViewDetails }) => {
  const { toast } = useToast();
  const { auth } = useAuth();

  const handleAddToCart = async () => {
    try {
      if (!auth.user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour ajouter des articles au panier.",
          variant: "destructive",
        });
        return;
      }

      await addToCart(offer, 1, auth.user.id);
      toast({
        title: "Ajouté au panier",
        description: `${offer.name} a été ajouté à votre panier.`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter au panier: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (!offer.isActive) {
    return null;
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-1">{offer.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {offer.description}
        </p>
        <div className="space-y-1">
          {offer.priceMonthly > 0 && (
            <p className="font-bold">
              A partir de {Number(offer.priceMonthly).toFixed(2)} € <span className="text-sm font-normal text-muted-foreground">/mois</span>
            </p>
          )}
          {offer.setupFee > 0 && (
            <p className="text-sm text-muted-foreground">
              Prix de création : {Number(offer.setupFee).toFixed(2)} €
            </p>
          )}
          {offer.priceMonthly === 0 && offer.setupFee === 0 && (
            <p className="font-medium text-muted-foreground">Sur devis</p>
          )}
        </div>
        <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
          {offer.category}
        </div>
        {offer.features && offer.features.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-3 bg-[#6E59A5] text-white hover:bg-[#7E69AB] hover:text-white border-none"
              >
                <List className="h-4 w-4 mr-1" />
                <span className="text-xs">Fonctionnalités</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px]">
              <DropdownMenuLabel>Fonctionnalités</DropdownMenuLabel>
              {offer.features.map((feature, index) => (
                <DropdownMenuItem key={index} className="py-2">
                  {feature}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          className="w-[48%]"
          onClick={() => onViewDetails(offer)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Détails
        </Button>
        <Button
          size="sm"
          className="w-[48%]"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfferCard;
