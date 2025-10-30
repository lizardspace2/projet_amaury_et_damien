import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/api/supabaseClient';
import { toast } from 'sonner';

const SubscriptionPage: React.FC = () => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type, max_listings, stripe_subscription_status')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      return data as { user_type?: string; max_listings?: number; stripe_subscription_status?: string };
    },
    enabled: !!user
  });

  const { data: monthlyCount } = useQuery({
    queryKey: ['my-properties-monthly-count'],
    queryFn: async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return 0;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', currentUser.id)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', now.toISOString());
      return count || 0;
    },
    enabled: !!user
  });

  const openPortal = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Non authentifié');
      const resp = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (!resp.ok) throw new Error('Impossible d’ouvrir le portail client');
      const { url } = await resp.json();
      window.location.href = url;
    } catch (e: any) {
      toast.error(e?.message || 'Erreur');
    }
  };

  const startUpgrade = async () => {
    try {
      const r = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, userEmail: user?.email }),
      });
      if (!r.ok) throw new Error('Impossible de démarrer le paiement');
      const { url } = await r.json();
      window.location.href = url;
    } catch (e: any) {
      toast.error(e?.message || 'Erreur');
    }
  };

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Mon abonnement</h1>
        <p className="text-slate-600">Gérez votre offre et vos limites d’annonces</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statut</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Type de compte: {profile?.user_type || '—'}</p>
            <p>Quota actuel: {profile?.max_listings ?? 50} annonces</p>
            <p>Annonces publiées ce mois-ci: {monthlyCount ?? 0}</p>
            <p>Statut abonnement: {profile?.stripe_subscription_status || '—'}</p>
            <div className="flex gap-3 pt-2">
              {(profile?.max_listings ?? 50) < 500 && (
                <Button onClick={startUpgrade} className="bg-teal-600 hover:bg-teal-700">Passer à Pro+ (jusqu'à 500)</Button>
              )}
              {profile?.stripe_subscription_status && (
                <Button variant="outline" onClick={openPortal}>Ouvrir le portail client</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;



