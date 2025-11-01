import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/AuthContext';

const getApiBase = (): string => {
  const base = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
  return base && base.trim().length > 0 ? base.replace(/\/$/, '') : '';
};

const StripePaiementCheckout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Veuillez vous connecter pour continuer');
      }

      toast.info('Préparation du paiement…');

      const response = await fetch(`${getApiBase()}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          userEmail: user.email 
        }),
      });

      const json = await response.json().catch(() => ({} as any));

      if (!response.ok) {
        throw new Error(json?.error || `Impossible de démarrer le paiement (status ${response.status})`);
      }

      const { url } = json as { url?: string };
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Aucune URL de checkout reçue');
      }
    } catch (e: any) {
      const errorMessage = e?.message || 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('[stripe-paiement-checkout] error', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Paiement Stripe - Abonnement Pro+</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-slate-600">
              Accédez à l'abonnement Pro+ et publiez jusqu'à 500 annonces.
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Prix : 29,99€ / mois</li>
              <li>Jusqu'à 500 annonces actives</li>
              <li>Résiliation à tout moment</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={startCheckout}
              disabled={isLoading || !user}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isLoading ? 'Chargement...' : 'Procéder au paiement'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/account/subscription')}
            >
              Annuler
            </Button>
          </div>

          {!user && (
            <p className="text-sm text-slate-500 mt-4">
              Vous devez être connecté pour procéder au paiement.{' '}
              <button
                onClick={() => navigate('/account')}
                className="text-teal-600 hover:underline"
              >
                Se connecter
              </button>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StripePaiementCheckout;

