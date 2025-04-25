
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const CartPage: React.FC = () => {
  // Mock data for the cart
  const cartItems = [
    { id: 1, name: "Offre Standard", description: "Description de l'offre", price: 129.99, quantity: 1 },
    { id: 2, name: "Offre Premium", description: "Description de l'offre", price: 249.99, quantity: 1 },
    { id: 3, name: "Option Supplémentaire", description: "Description de l'option", price: 49.99, quantity: 2 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mon Panier</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Articles sélectionnés</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.price.toFixed(2)} €</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Continuer mes achats</Button>
          <Button>Créer une plaquette d'offres</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CartPage;
