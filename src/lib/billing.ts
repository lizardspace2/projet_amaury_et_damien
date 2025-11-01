import { supabase } from '@/lib/client';
import { getApiBase } from '@/lib/utils';

export const startProUpgradeCheckout = async (): Promise<void> => {
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



