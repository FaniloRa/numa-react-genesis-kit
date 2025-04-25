
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";

const FoldersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("plaquettes");

  // Mock data for folders
  const folders = [
    { id: 1, name: "Projet A", client: "Client 1", createdAt: "2023-01-15", agent: "Agent Smith" },
    { id: 2, name: "Projet B", client: "Client 2", createdAt: "2023-02-10", agent: "Agent Johnson" },
    { id: 3, name: "Projet C", client: "Client 3", createdAt: "2023-03-05", agent: "Agent Brown" },
  ];

  const offerPlates = [
    { id: 1, name: "Plaquette Standard", folder: "Projet A", createdAt: "2023-01-20", status: "sent" },
    { id: 2, name: "Plaquette Premium", folder: "Projet B", createdAt: "2023-02-15", status: "draft" },
  ];

  const quotes = [
    { id: 1, name: "Devis #2023-001", folder: "Projet A", createdAt: "2023-01-25", status: "approved" },
    { id: 2, name: "Devis #2023-002", folder: "Projet C", createdAt: "2023-03-10", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dossiers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {folders.map((folder) => (
          <Card key={folder.id}>
            <CardHeader>
              <CardTitle>{folder.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Client:</span>
                  <span className="text-sm font-medium">{folder.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Agent:</span>
                  <span className="text-sm font-medium">{folder.agent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Créé le:</span>
                  <span className="text-sm font-medium">{new Date(folder.createdAt).toLocaleDateString()}</span>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Voir le dossier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contenu des dossiers</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="plaquettes" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="plaquettes">Plaquettes d'offres</TabsTrigger>
              <TabsTrigger value="devis">Devis</TabsTrigger>
            </TabsList>
            <TabsContent value="plaquettes">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Dossier</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offerPlates.map((plate) => (
                    <TableRow key={plate.id}>
                      <TableCell className="font-medium">{plate.name}</TableCell>
                      <TableCell>{plate.folder}</TableCell>
                      <TableCell>{new Date(plate.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${
                            plate.status === 'sent' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {plate.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="devis">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Dossier</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.name}</TableCell>
                      <TableCell>{quote.folder}</TableCell>
                      <TableCell>{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${
                            quote.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {quote.status === 'approved' ? 'Approuvé' : 'En attente'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoldersPage;
