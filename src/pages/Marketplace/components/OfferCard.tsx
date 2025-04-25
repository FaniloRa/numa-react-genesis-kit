
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Offer } from "@/types";
import { addToCart } from "../MarketplaceService";
import { Eye, ShoppingCart } from "lucide-react";

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

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="h-40 bg-muted"
        style={
          offer.image_url 
            ? { backgroundImage: `url(${offer.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
            : {}
        }
      />
      <CardHeader>
        <CardTitle className="line-clamp-1">{offer.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {offer.description}
        </p>
        <p className="font-bold">{Number(offer.price).toFixed(2)} €</p>
        <div className="text-xs text-muted-foreground mt-1 inline-block bg-gray-100 px-2 py-0.5 rounded-full">
          {offer.category}
        </div>
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
