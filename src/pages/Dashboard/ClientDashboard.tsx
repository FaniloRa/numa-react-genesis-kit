
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const ClientDashboard: React.FC = () => {
  const { toast } = useToast();
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  const [recentFolders, setRecentFolders] = useState<any[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClientData = async () => {
    if (!auth.user) return;
    
    try {
      setLoading(true);
      
      const [
        { data: folders },
        { data: quotes },
        { data: pendingQuotesData }
      ] = await Promise.all([
        supabase
          .from("folders")
          .select(`
            id,
            name,
            created_at,
            agent_id,
            profiles!folders_agent_id_fkey (
              first_name,
              last_name
            )
          `)
          .eq("client_id", auth.user.id)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("quotes")
          .select(`
            id,
            total_amount,
            status,
            created_at,
            agent_id,
            profiles!quotes_agent_id_fkey (
              first_name,
              last_name
            )
          `)
          .eq("client_id", auth.user.id)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("quotes")
          .select(`
            id,
            total_amount,
            status,
            created_at,
            agent_id,
            profiles!quotes_agent_id_fkey (
              first_name,
              last_name
            )
          `)
          .eq("client_id", auth.user.id)
          .eq("status", "sent")
          .order("created_at", { ascending: false })
          .limit(5)
      ]);
      
      setRecentFolders(folders || []);
      setRecentQuotes(quotes || []);
      setPendingQuotes(pendingQuotesData || []);
    } catch (error) {
      console.error("Error loading client dashboard:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données du tableau de bord.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, [auth.user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bienvenue, {auth.user?.firstName}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => navigate("/marketplace")}>
            Parcourir la marketplace
          </Button>
          <Button variant="outline" onClick={() => navigate("/folders")}>
            Voir mes dossiers
          </Button>
          <Button variant="outline" onClick={() => navigate("/quotes")}>
            Voir mes devis
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Devis à valider</CardTitle>
              {pendingQuotes.length > 0 && (
                <Button variant="link" size="sm" onClick={() => navigate("/quotes")}>
                  Voir tous
                </Button>
              )}
            </div>
            <CardDescription>
              Devis en attente de votre validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-2 border-b">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-36"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : pendingQuotes.length > 0 ? (
              <div className="space-y-4">
                {pendingQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">Devis #{quote.id.substring(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {Number(quote.total_amount).toFixed(2)} € - {quote.profiles?.first_name || "Agent"} {quote.profiles?.last_name || ""}
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => navigate("/quotes")}
                    >
                      Voir
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Aucun devis en attente</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Derniers dossiers</CardTitle>
              {recentFolders.length > 0 && (
                <Button variant="link" size="sm" onClick={() => navigate("/folders")}>
                  Voir tous
                </Button>
              )}
            </div>
            <CardDescription>
              Vos dossiers les plus récents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-2 border-b">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-36"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : recentFolders.length > 0 ? (
              <div className="space-y-4">
                {recentFolders.map((folder) => (
                  <div key={folder.id} className="flex items-center justify-between p-2 border-b last:border-0">
                    <div>
                      <p className="font-medium flex items-center">
                        <FolderOpen className="h-4 w-4 mr-1" />
                        {folder.name}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(folder.created_at), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate("/folders")}
                    >
                      Voir
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Aucun dossier trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Derniers devis</CardTitle>
            {recentQuotes.length > 0 && (
              <Button variant="link" size="sm" onClick={() => navigate("/quotes")}>
                Voir tous
              </Button>
            )}
          </div>
          <CardDescription>
            Vos devis les plus récents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border rounded-md">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : recentQuotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => navigate("/quotes")}>
                  <p className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Devis #{quote.id.substring(0, 8)}
                  </p>
                  <p className="text-lg font-bold my-1">{Number(quote.total_amount).toFixed(2)} €</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true, locale: fr })}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Aucun devis trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
