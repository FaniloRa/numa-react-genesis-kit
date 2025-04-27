
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { DashboardStats } from "./components/DashboardStats";
import { PendingQuotes } from "./components/PendingQuotes";
import { RecentActivityList } from "./components/RecentActivity";
import { supabase } from "@/integrations/supabase/client";
import { Folder } from "@/types";
import { fetchFolders } from "../Folders/FoldersService";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const ClientDashboard = () => {
  const { auth } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingQuotes, setPendingQuotes] = useState([]);

  useEffect(() => {
    if (!auth.user) return;

    const loadFolders = async () => {
      try {
        setLoading(true);
        const data = await fetchFolders(auth.user!.id, false);
        setFolders(data);
      } catch (error) {
        console.error("Error loading folders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFolders();

    // Subscribe to folder changes
    const channel = supabase
      .channel('folders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders',
          filter: `client_id=eq.${auth.user.id}`
        },
        () => {
          loadFolders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auth.user]);

  return (
    <div className="space-y-4 p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats 
          stats={[
            { title: "Projets actifs", value: folders.length, description: "Dossiers en cours", icon: null },
            { title: "Devis en attente", value: pendingQuotes.length, description: "À approuver", icon: null },
            { title: "Projets complétés", value: 0, description: "Dossiers fermés", icon: null }
          ]}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Derniers dossiers</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : folders.length > 0 ? (
            folders.slice(0, 5).map((folder) => (
              <div key={folder.id} className="mb-2 p-2 hover:bg-gray-50 rounded">
                <p className="font-medium">{folder.name}</p>
                <p className="text-sm text-muted-foreground">
                  Créé {formatDistanceToNow(new Date(folder.createdAt), { addSuffix: true, locale: fr })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Aucun dossier récent</p>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Devis en attente</h2>
          <PendingQuotes 
            quotes={pendingQuotes} 
            loading={loading}
            onStatusUpdate={async () => {}}
          />
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Activité récente</h2>
        <RecentActivityList 
          activities={[]} 
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default ClientDashboard;
