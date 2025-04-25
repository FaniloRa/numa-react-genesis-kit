
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { Folder } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface FolderCardProps {
  folder: Folder;
  onSelect: (folder: Folder) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, onSelect }) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(folder)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{folder.name}</CardTitle>
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          Créé {formatDistanceToNow(new Date(folder.createdAt), { addSuffix: true, locale: fr })}
        </p>
        
        <Button size="sm" onClick={() => onSelect(folder)}>
          Voir le dossier
        </Button>
      </CardContent>
    </Card>
  );
};

export default FolderCard;
