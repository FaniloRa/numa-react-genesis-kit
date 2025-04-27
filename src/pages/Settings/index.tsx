
import React from "react";
import { Card } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-4 p-8">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Paramètres du compte</h2>
        {/* Settings content will go here */}
        <p className="text-muted-foreground">Configuration des paramètres à venir...</p>
      </Card>
    </div>
  );
};

export default Settings;
