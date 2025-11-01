import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

const getApiBase = (): string => {
  const base = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
  return base && base.trim().length > 0 ? base.replace(/\/$/, '') : '';
};

const startProUpgradeCheckout = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  console.log('[billing] startProUpgradeCheckout: user', {
    id: user.id,
    email: user.email,
  });

  const response = await fetch(`${getApiBase()}/api/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id, userEmail: user.email }),
  });

  console.log('[billing] create-checkout-session status', response.status);
  const json = await response.json().catch(() => ({} as any));
  console.log('[billing] create-checkout-session payload', json);
  if (!response.ok) {
    throw new Error(json?.error || `Unable to start checkout (status ${response.status})`);
  }

  const { url } = json as { url?: string };
  if (url) {
    window.location.href = url;
  } else {
    throw new Error('No checkout URL received');
  }
};

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
  const { user, monthlyCount, monthlyAncillaryCount, subscriptionInfo } = useAuth();
  
  // Use custom hook for profile with specific fields
  const { data: profile } = useUserProfile<{ 
    user_type?: string; 
    max_listings?: number; 
    stripe_subscription_status?: string;
    subscription_current_period_start?: string;
    subscription_current_period_end?: string;
    subscription_cancel_at_period_end?: boolean;
  }>('user_type, max_listings, stripe_subscription_status, subscription_current_period_start, subscription_current_period_end, subscription_cancel_at_period_end');

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
        <p className="text-slate-600">Publier des annonces de services annexes</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statut</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p><strong>Type de compte:</strong> {profile?.user_type || '—'}</p>
              
              {(profile?.user_type === 'Professionnelle' || profile?.user_type === 'Partenaire') && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Services annexes</p>
                  <p><strong>Quota actuel:</strong> {subscriptionInfo.maxAncillaryServices} annonces de services annexes</p>
                  <p><strong>Services publiés ce mois-ci:</strong> {monthlyAncillaryCount ?? 0}</p>
                </div>
              )}
              <div className="mt-3 pt-3 border-t">
                <p><strong>Statut abonnement:</strong> {
                  subscriptionInfo.subscriptionStatus 
                    ? subscriptionInfo.subscriptionStatus === 'active' 
                      ? (subscriptionInfo.isExpired ? 'Expiré' : 'Actif ✅') 
                      : subscriptionInfo.subscriptionStatus 
                    : 'Non abonné'
                }</p>
              </div>
              
              {subscriptionInfo.currentPeriodStart && subscriptionInfo.currentPeriodEnd && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-slate-600 mb-1"><strong>Période d'abonnement:</strong></p>
                  <p className="text-sm">
                    Du {new Date(subscriptionInfo.currentPeriodStart).toLocaleDateString('fr-FR')} 
                    {' '}au {new Date(subscriptionInfo.currentPeriodEnd).toLocaleDateString('fr-FR')}
                  </p>
                  {subscriptionInfo.cancelAtPeriodEnd && (
                    <p className="text-sm text-amber-600 mt-1">
                      ⚠️ L'abonnement sera annulé à la fin de cette période
                    </p>
                  )}
                  {subscriptionInfo.isExpired && (
                    <p className="text-sm text-red-600 mt-1">
                      ⚠️ L'abonnement a expiré
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-2">
              {!subscriptionInfo.isSubscribed && (
                <Button
                  id="btn-upgrade-pro"
                  onClick={() => {
                    console.log('[subscription] click upgrade button');
                    startUpgrade();
                  }}
                  disabled={isStarting}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Passer à Pro+ 
                </Button>
              )}
              {(subscriptionInfo.stripeCustomerId || profile?.stripe_subscription_status) && (
                <Button variant="outline" onClick={openPortal}>
                  {subscriptionInfo.cancelAtPeriodEnd ? 'Réactiver l\'abonnement' : 'Ouvrir le portail client'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;



