
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClientDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Dossiers en cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Devis récents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-muted-foreground">En attente de validation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Offres proposées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-muted-foreground">Disponibles dans votre espace</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-8">Dernières activités</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Devis #{1000 + i}</p>
                  <p className="text-sm text-muted-foreground">
                    Reçu il y a {i} jour{i > 1 ? "s" : ""}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  En attente
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;
