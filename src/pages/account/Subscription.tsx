import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/client';
import { toast } from 'sonner';
import { useAuth } from '@/AuthContext';
import { getApiBase } from '@/lib/utils';
import { startProUpgradeCheckout } from '@/lib/billing';

const SubscriptionPage: React.FC = () => {
  React.useEffect(() => {
    const onError = (event: ErrorEvent) => {
      console.error('[subscription] window.onerror', event?.message, event?.error);
    };
    const onUnhandled = (event: PromiseRejectionEvent) => {
      console.error('[subscription] window.onunhandledrejection', event?.reason);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandled as any);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandled as any);
    };
  }, []);
  const { user } = useAuth();

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
      if (!user) return 0;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', now.toISOString());
      return count || 0;
    },
    enabled: !!user
  });

  const openPortal = async () => {
    try {
      toast.info('Ouverture du portail client…');
      if (!user) throw new Error('Non authentifié');
      console.log('[subscription] openPortal: user', { id: user.id, email: user.email });
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const resp = await fetch(`${getApiBase()}/api/stripe/create-portal-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      console.log('[subscription] portal-session status', resp.status);
      const portalJson = await resp.json().catch(() => ({} as any));
      console.log('[subscription] portal-session payload', portalJson);
      if (!resp.ok) throw new Error(portalJson?.error || `Impossible d’ouvrir le portail client (status ${resp.status})`);
      const { url } = portalJson as { url?: string };
      window.location.href = url;
    } catch (e: any) {
      toast.error(e?.message || 'Erreur');
      console.error('[subscription] openPortal error', e);
    }
  };

  const [isStarting, setIsStarting] = React.useState(false);

  const startUpgrade = async () => {
    try {
      console.log('[subscription] startUpgrade invoked');
      if (isStarting) {
        console.log('[subscription] startUpgrade ignored: already in progress');
        return;
      }
      setIsStarting(true);
      toast.info('Préparation du paiement…');

      // Ensure user is authenticated
      if (!user) {
        throw new Error('Veuillez vous connecter pour continuer');
      }

      // Delegate to shared billing helper for consistency
      await startProUpgradeCheckout();
    } catch (e: any) {
      toast.error(e?.message || 'Erreur');
      console.error('[subscription] startUpgrade error', e);
    } finally {
      setIsStarting(false);
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
                <Button
                  id="btn-upgrade-pro"
                  onClick={() => {
                    console.log('[subscription] click upgrade button');
                    startUpgrade();
                  }}
                  disabled={isStarting}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Passer à Pro+ (jusqu'à 500)
                </Button>
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



