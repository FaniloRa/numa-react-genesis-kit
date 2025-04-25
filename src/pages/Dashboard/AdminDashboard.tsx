
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">152</p>
            <p className="text-sm text-muted-foreground">+12 ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Agents actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Sur 10 agents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Devis à valider</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14</p>
            <p className="text-sm text-muted-foreground">Traitement en attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CA Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">42 850€</p>
            <p className="text-sm text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-8">Devis en attente de validation</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Devis #{3000 + i}</p>
                  <p className="text-sm text-muted-foreground">
                    Agent: {['Dupont', 'Martin', 'Robert', 'Simon'][i-1]} • Client: {['Entreprise A', 'Société B', 'Corporation C', 'Groupe D'][i-1]}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    En attente
                  </span>
                  <button className="px-2 py-1 text-xs bg-green-500 text-white rounded">Valider</button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
