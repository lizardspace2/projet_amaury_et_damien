import { supabase } from '@/lib/api/supabaseClient';

export const startProUpgradeCheckout = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id, userEmail: user.email }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Unable to start checkout');
  }

  const { url } = await response.json();
  if (url) {
    window.location.href = url;
  } else {
    throw new Error('No checkout URL received');
  }
};



