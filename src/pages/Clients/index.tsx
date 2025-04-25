
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, FolderOpen, FileText } from "lucide-react";
import { UserRole } from "@/types";
import { useAuth } from "@/lib/auth";

const ClientsPage: React.FC = () => {
  const { auth } = useAuth();
  const isAdmin = auth.user?.role === UserRole.ADMIN;

  // Mock data for clients
  const clients = [
    { 
      id: 1, 
      name: "Martin Dupont", 
      email: "martin.dupont@example.com",
      phone: "01 23 45 67 89",
      address: "123 Avenue de Paris, 75001 Paris",
      folders: 3,
      quotes: 5,
      createdAt: "2023-01-10"
    },
    { 
      id: 2, 
      name: "Julie Dubois", 
      email: "julie.dubois@example.com",
      phone: "01 98 76 54 32",
      address: "456 Rue de Lyon, 69000 Lyon",
      folders: 2,
      quotes: 3,
      createdAt: "2023-02-15"
    },
    { 
      id: 3, 
      name: "Thomas Leclerc", 
      email: "thomas.leclerc@example.com",
      phone: "01 45 67 89 10",
      address: "789 Boulevard de Marseille, 13000 Marseille",
      folders: 1,
      quotes: 2,
      createdAt: "2023-03-20"
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des clients</h1>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            className="pl-8"
          />
        </div>
        <Button>Nouveau client</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Dossiers</TableHead>
                <TableHead>Devis</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.folders}</TableCell>
                  <TableCell>{client.quotes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsPage;
