
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { fetchQuoteById } from '../Quotes/QuotesService';
import { Quote } from '@/types';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get('quoteId');
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuote = async () => {
      if (!quoteId) return;
      
      try {
        setLoading(true);
        const data = await fetchQuoteById(quoteId);
        setQuote(data);
      } catch (error) {
        console.error("Error fetching quote:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuote();
  }, [quoteId]);

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Paiement réussi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Votre paiement a été traité avec succès.
          </p>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : quote ? (
            <div className="space-y-2 text-center">
              <p>Devis #{quote.id.substring(0, 8)}</p>
              <p className="font-medium">Montant payé: {Number(quote.totalAmount).toFixed(2)} €</p>
              <p className="text-sm text-muted-foreground">
                Une confirmation a été envoyée par email.
              </p>
            </div>
          ) : null}
          
          <div className="flex flex-col space-y-2">
            <Button onClick={() => navigate(`/quotes/${quoteId}`)}>
              Voir les détails du devis
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Retour au tableau de bord
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
