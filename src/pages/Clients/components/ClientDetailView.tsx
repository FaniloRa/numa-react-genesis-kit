
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { fetchClientDetails, fetchClientFolders, fetchClientQuotes } from "../ClientsService";
import { ArrowLeft, Mail, Phone, MapPin, CalendarDays, FolderOpen, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { createFolder } from "@/pages/Folders/FoldersService";
import { useAuth } from "@/lib/auth";

interface ClientDetailViewProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ clientId, onBack }) => {
  const { toast } = useToast();
  const { auth } = useAuth();
  
  const [client, setClient] = useState<User | null>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingFolder, setCreatingFolder] = useState(false);

  const loadClientDetails = async () => {
    try {
      setLoading(true);
      
      const [clientData, foldersData, quotesData] = await Promise.all([
        fetchClientDetails(clientId),
        fetchClientFolders(clientId),
        fetchClientQuotes(clientId)
      ]);
      
      setClient(clientData);
      setFolders(foldersData);
      setQuotes(quotesData);
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

  useEffect(() => {
    loadClientDetails();
  }, [clientId]);

  const handleCreateFolder = async () => {
    if (!auth.user || !client) return;
    
    try {
      setCreatingFolder(true);
      const folderName = `Dossier de ${client.firstName} ${client.lastName}`;
      await createFolder(folderName, clientId, auth.user.id);
      
      toast({
        title: "Dossier créé",
        description: "Le dossier a été créé avec succès.",
      });
      
      loadClientDetails();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">
          Fiche client
        </h2>
      </div>

      {loading ? (
        <Card className="mb-6 animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </CardContent>
        </Card>
      ) : client ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              {client.firstName} {client.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {client.email}
                </p>
                
                {client.phone && (
                  <p className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {client.phone}
                  </p>
                )}
                
                {client.address && (
                  <p className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {client.address}
                  </p>
                )}
                
                {client.birthDate && (
                  <p className="flex items-center text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {new Date(client.birthDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div>
                <div className="flex justify-end">
                  <Button onClick={handleCreateFolder} disabled={creatingFolder}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Créer un dossier
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground">Client non trouvé</p>
      )}

      <Tabs defaultValue="folders">
        <TabsList className="mb-4">
          <TabsTrigger value="folders">Dossiers</TabsTrigger>
          <TabsTrigger value="quotes">Devis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="folders">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : folders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {folders.map((folder) => (
                <Card key={folder.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FolderOpen className="h-5 w-5 mr-2" />
                      {folder.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Créé {formatDistanceToNow(new Date(folder.created_at), { addSuffix: true, locale: fr })}
                    </p>
                    <p className="text-sm mb-3">
                      Agent: {folder.profiles.first_name} {folder.profiles.last_name}
                    </p>
                    <Button size="sm">Voir détails</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">Aucun dossier trouvé</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quotes">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : quotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quotes.map((quote) => (
                <Card key={quote.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Devis #{quote.id.substring(0, 8)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{Number(quote.total_amount).toFixed(2)} €</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          quote.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : quote.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : quote.status === "sent"
                            ? "bg-purple-100 text-purple-800"
                            : quote.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : quote.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {quote.status === "pending"
                          ? "En attente"
                          : quote.status === "approved"
                          ? "Approuvé"
                          : quote.status === "sent"
                          ? "Envoyé"
                          : quote.status === "accepted"
                          ? "Accepté"
                          : quote.status === "rejected"
                          ? "Rejeté"
                          : quote.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Créé {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true, locale: fr })}
                    </p>
                    <p className="text-sm mb-3">
                      Agent: {quote.profiles.first_name} {quote.profiles.last_name}
                    </p>
                    <Button size="sm">Voir détails</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">Aucun devis trouvé</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetailView;
