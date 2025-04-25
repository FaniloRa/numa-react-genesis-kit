
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Offer } from "@/types";
import { fetchOffers, fetchCategories } from "./MarketplaceService";
import OfferCard from "./components/OfferCard";
import OfferDetailDialog from "./components/OfferDetailDialog";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "./components/SearchBar";
import { UserRole } from "@/types";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";

const Marketplace: React.FC = () => {
  const { toast } = useToast();
  const { auth, hasRole } = useAuth();
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const isAdmin = hasRole(UserRole.ADMIN);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await fetchOffers(searchTerm, selectedCategory || undefined);
      setOffers(data);
    } catch (error: any) {
      toast({
        title: "Erreur de chargement",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error: any) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadOffers();
  }, []);

  const handleSearch = () => {
    loadOffers();
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    loadOffers();
  };

  const handleViewDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        {isAdmin && (
          <Button>
            Ajouter une offre
          </Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4">
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex md:hidden items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                  <SheetDescription>
                    Filtrer les offres par catégorie
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => {
                      setSelectedCategory(cat);
                      loadOffers();
                    }}
                  />
                </div>
                <SheetFooter className="mt-4">
                  <Button onClick={() => {
                    setSelectedCategory(null);
                    loadOffers();
                  }}>
                    Réinitialiser les filtres
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[300px] bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">Aucune offre trouvée</p>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/4 hidden md:block">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>
      </div>

      {selectedOffer && (
        <OfferDetailDialog
          offer={selectedOffer}
          open={detailDialogOpen}
          onClose={() => {
            setDetailDialogOpen(false);
            setSelectedOffer(null);
          }}
        />
      )}
    </div>
  );
};

export default Marketplace;
