
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AgentDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord Agent</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dossiers créés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Devis envoyés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Devis acceptés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-muted-foreground">Taux de conversion: 62%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clients actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-8">Activités récentes</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Client {['Martin', 'Dubois', 'Lefebvre', 'Petit', 'Richard'][i-1]}</p>
                  <p className="text-sm text-muted-foreground">
                    {['Devis envoyé', 'Dossier créé', 'Plaquette envoyée', 'Devis accepté', 'Nouvel client'][i-1]} • il y a {i} jour{i > 1 ? "s" : ""}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  i % 3 === 0 ? 'bg-green-100 text-green-800' : 
                  i % 3 === 1 ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {i % 3 === 0 ? 'Terminé' : i % 3 === 1 ? 'En cours' : 'En attente'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentDashboard;
