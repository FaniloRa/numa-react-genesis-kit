
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

const Marketplace: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Marketplace</h1>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une offre..."
            className="pl-8"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-40 bg-muted" />
            <CardHeader>
              <CardTitle>Offre {i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="font-bold">{(Math.floor(Math.random() * 500) + 100).toFixed(2)} €</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Détails</Button>
              <Button>Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
