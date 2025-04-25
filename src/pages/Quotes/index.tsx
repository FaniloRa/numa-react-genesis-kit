
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { UserRole } from "@/types";
import { useAuth } from "@/lib/auth";

const QuotesPage: React.FC = () => {
  const { auth } = useAuth();
  const userRole = auth.user?.role;

  // Mock data for quotes
  const quotes = [
    { 
      id: 1, 
      reference: "DEVIS-2023-001", 
      client: "Client A", 
      agent: "Agent Smith", 
      createdAt: "2023-01-15", 
      status: "approved",
      total: 1250.50
    },
    { 
      id: 2, 
      reference: "DEVIS-2023-002", 
      client: "Client B", 
      agent: "Agent Johnson", 
      createdAt: "2023-02-20", 
      status: "pending",
      total: 2340.75
    },
    { 
      id: 3, 
      reference: "DEVIS-2023-003", 
      client: "Client C", 
      agent: "Agent Brown", 
      createdAt: "2023-03-05", 
      status: "sent",
      total: 830.25
    },
    { 
      id: 4, 
      reference: "DEVIS-2023-004", 
      client: "Client A", 
      agent: "Agent Smith", 
      createdAt: "2023-03-15", 
      status: "rejected",
      total: 4750.00
    },
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Approuvé', classes: 'bg-green-100 text-green-800' };
      case 'pending':
        return { label: 'En attente', classes: 'bg-yellow-100 text-yellow-800' };
      case 'sent':
        return { label: 'Envoyé', classes: 'bg-blue-100 text-blue-800' };
      case 'rejected':
        return { label: 'Refusé', classes: 'bg-red-100 text-red-800' };
      default:
        return { label: status, classes: 'bg-gray-100 text-gray-800' };
    }
  };

  const renderAdminActions = (quote: any) => (
    <div className="flex space-x-2 justify-end">
      <Button variant="outline" size="sm" className="h-8 px-2 flex items-center">
        <Eye className="h-3.5 w-3.5 mr-1" />
        Voir
      </Button>
      {quote.status === 'pending' && (
        <>
          <Button variant="outline" size="sm" className="h-8 px-2 flex items-center text-green-600 border-green-600 hover:bg-green-50">
            Approuver
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 flex items-center text-red-600 border-red-600 hover:bg-red-50">
            Refuser
          </Button>
        </>
      )}
    </div>
  );

  const renderAgentActions = (quote: any) => (
    <div className="flex space-x-2 justify-end">
      <Button variant="outline" size="sm" className="h-8 px-2 flex items-center">
        <Eye className="h-3.5 w-3.5 mr-1" />
        Voir
      </Button>
      <Button variant="outline" size="sm" className="h-8 px-2 flex items-center">
        <Download className="h-3.5 w-3.5 mr-1" />
        PDF
      </Button>
    </div>
  );

  const renderClientActions = (quote: any) => (
    <div className="flex space-x-2 justify-end">
      <Button variant="outline" size="sm" className="h-8 px-2 flex items-center">
        <Eye className="h-3.5 w-3.5 mr-1" />
        Voir
      </Button>
      <Button variant="outline" size="sm" className="h-8 px-2 flex items-center">
        <Download className="h-3.5 w-3.5 mr-1" />
        PDF
      </Button>
    </div>
  );

  const renderTableActions = (quote: any) => {
    if (userRole === UserRole.ADMIN) return renderAdminActions(quote);
    if (userRole === UserRole.AGENT) return renderAgentActions(quote);
    return renderClientActions(quote);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {userRole === UserRole.ADMIN ? "Gestion des Devis" : "Mes Devis"}
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {userRole === UserRole.CLIENT ? "Devis reçus" : "Liste des devis"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                {userRole !== UserRole.CLIENT && <TableHead>Client</TableHead>}
                {userRole === UserRole.ADMIN && <TableHead>Agent</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => {
                const status = getStatusLabel(quote.status);
                return (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.reference}</TableCell>
                    {userRole !== UserRole.CLIENT && <TableCell>{quote.client}</TableCell>}
                    {userRole === UserRole.ADMIN && <TableCell>{quote.agent}</TableCell>}
                    <TableCell>{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${status.classes}`}>
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{quote.total.toFixed(2)} €</TableCell>
                    <TableCell className="text-right">
                      {renderTableActions(quote)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotesPage;
