import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    // Load profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('user_id', userId)
      .single();
    if (profileError) return res.status(400).json({ error: 'Profile not found' });

    let customerId = profile?.stripe_customer_id as string | null;
    if (!customerId) {
      // Create a customer if missing
      const customer = await stripe.customers.create({ email: profile?.email || undefined, metadata: { userId } });
      customerId = customer.id;
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
    }

    const returnUrl = `https://${process.env.APP_BASE_URL || process.env.VERCEL_URL}`;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId!,
      return_url: returnUrl,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Create portal session error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}



