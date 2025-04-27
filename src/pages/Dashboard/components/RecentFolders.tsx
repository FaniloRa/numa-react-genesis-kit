
import React from 'react';
import { Card } from '@/components/ui/card';
import { Folder } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecentFoldersProps {
  folders: Folder[];
  loading: boolean;
}

export const RecentFolders: React.FC<RecentFoldersProps> = ({ folders, loading }) => {
  return (
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
  );
};
