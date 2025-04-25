
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, FolderOpen, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";

interface DashboardStat {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

interface RecentActivity {
  id: string;
  type: string;
  name: string;
  date: string;
  status?: string;
}

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch counts for dashboard stats
      const [
        { count: usersCount },
        { count: quotesCount },
        { count: foldersCount },
        { data: pendingQuotesData },
        { data: recentActivityData }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("quotes").select("*", { count: "exact" }),
        supabase.from("folders").select("*", { count: "exact" }),
        supabase.from("quotes")
          .select(`
            id,
            total_amount,
            status,
            created_at,
            agent_id,
            profiles(
              first_name,
              last_name
            )
          `)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("quotes")
          .select(`
            id,
            total_amount,
            status,
            created_at,
            agent_id,
            profiles(
              first_name,
              last_name
            )
          `)
          .order("created_at", { ascending: false })
          .limit(10)
      ]);
      
      // Set dashboard stats
      setStats([
        {
          title: "Utilisateurs",
          value: usersCount || 0,
          description: "Total des utilisateurs",
          icon: <Users className="h-8 w-8 text-blue-500" />,
        },
        {
          title: "Devis",
          value: quotesCount || 0,
          description: "Devis générés",
          icon: <FileText className="h-8 w-8 text-green-500" />,
        },
        {
          title: "Dossiers",
          value: foldersCount || 0,
          description: "Dossiers actifs",
          icon: <FolderOpen className="h-8 w-8 text-amber-500" />,
        },
      ]);
      
      // Set pending quotes, handling potential null values or missing relations
      setPendingQuotes(pendingQuotesData?.map(quote => {
        return {
          ...quote,
          profiles: quote.profiles || { first_name: "Agent", last_name: "Inconnu" }
        };
      }) || []);
      
      // Transform recent activity, handling potential null values or missing relations
      const activities = (recentActivityData || []).map(item => ({
        id: item.id,
        type: "quote",
        name: `Devis #${item.id.substring(0, 8)} - ${
          item.profiles?.first_name || "Agent"} ${item.profiles?.last_name || "Inconnu"
        }`,
        date: item.created_at,
        status: item.status,
      }));
      
      setRecentActivity(activities);
    } catch (error) {
      console.error("Error loading admin dashboard data:", error);
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
    loadDashboardData();
  }, []);

  const handleQuoteStatusUpdate = async (quoteId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("quotes")
        .update({ status })
        .eq("id", quoteId);
      
      if (error) throw error;
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut du devis a été mis à jour.",
      });
      
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/3 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <CardDescription>{stat.description}</CardDescription>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Devis en attente d'approbation</CardTitle>
            <CardDescription>
              Devis qui nécessitent votre validation
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
                    <div className="flex space-x-2">
                      <div className="h-8 bg-muted rounded w-20"></div>
                      <div className="h-8 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : pendingQuotes.length > 0 ? (
              <div className="space-y-4">
                {pendingQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <p className="font-medium">Devis #{quote.id.substring(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {quote.profiles.first_name} {quote.profiles.last_name} - {Number(quote.total_amount).toFixed(2)} €
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        onClick={() => handleQuoteStatusUpdate(quote.id, "approved")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={() => handleQuoteStatusUpdate(quote.id, "rejected")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Aucun devis en attente d'approbation</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>
              Les dernières activités sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-2 border-b">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-48"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                    <div className="h-6 bg-muted rounded w-24"></div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : activity.status === "approved"
                          ? "bg-blue-100 text-blue-800"
                          : activity.status === "sent"
                          ? "bg-purple-100 text-purple-800"
                          : activity.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {activity.status === "pending"
                        ? "En attente"
                        : activity.status === "approved"
                        ? "Approuvé"
                        : activity.status === "sent"
                        ? "Envoyé"
                        : activity.status === "accepted"
                        ? "Accepté"
                        : activity.status === "rejected"
                        ? "Rejeté"
                        : activity.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Aucune activité récente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
