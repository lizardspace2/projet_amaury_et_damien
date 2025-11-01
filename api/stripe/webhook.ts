import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// Utility to read raw body for signature verification
async function readBuffer(readable: any): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const buf = await readBuffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Helper function to update subscription data
  async function updateSubscriptionData(
    customerId: string,
    subscription?: Stripe.Subscription,
    updateBy: 'customer_id' | 'subscription_id' = 'customer_id'
  ) {
    if (!subscription && updateBy === 'subscription_id') {
      // Fetch subscription if we only have customer ID
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        status: 'all',
      });
      subscription = subscriptions.data[0];
    }

    if (!subscription) return;

    const status = subscription.status;
    const isActive = status === 'active';
    const currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

    const updateData: any = {
      stripe_subscription_status: status,
      stripe_subscription_id: subscription.id,
      subscription_current_period_start: currentPeriodStart,
      subscription_current_period_end: currentPeriodEnd,
      subscription_cancel_at_period_end: subscription.cancel_at_period_end || false,
      max_listings: isActive ? 2000 : 1000,
      max_ancillary_services: isActive ? 20 : 0,
      updated_at: new Date().toISOString(),
    };

    // Only update customer_id if we're updating by customer_id
    if (updateBy === 'customer_id') {
      updateData.stripe_customer_id = customerId;
    }

    const query = updateBy === 'customer_id'
      ? supabase.from('profiles').update(updateData).eq('stripe_customer_id', customerId)
      : supabase.from('profiles').update(updateData).eq('stripe_subscription_id', subscription.id);

    await query;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string | null;
        const subscriptionId = session.subscription as string | null;
        const userId = session.metadata?.userId as string | undefined;

        if (userId && subscriptionId) {
          // Fetch the full subscription to get period dates
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await updateSubscriptionData(customerId!, subscription, 'customer_id');
        } else if (userId && customerId) {
          // Fallback: update basic info
          await supabase
            .from('profiles')
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_status: 'active',
              max_listings: 2000,
              max_ancillary_services: 20,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        await updateSubscriptionData(customerId, subscription, 'customer_id');
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from('profiles')
          .update({
            stripe_subscription_status: 'canceled',
            stripe_subscription_id: subscription.id,
            max_listings: 1000,
            max_ancillary_services: 0,
            subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            subscription_cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      // Gérer les factures - renouvellement mensuel
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string | null;
        const customerId = invoice.customer as string;

        // Si c'est une facture d'abonnement (pas un paiement ponctuel)
        if (subscriptionId && invoice.billing_reason === 'subscription_cycle') {
          // Récupérer l'abonnement pour mettre à jour les dates
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await updateSubscriptionData(customerId, subscription, 'customer_id');
        }
        break;
      }

      // Gérer les échecs de paiement
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string | null;
        const customerId = invoice.customer as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Si l'abonnement passe en past_due ou unpaid
          if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
            await supabase
              .from('profiles')
              .update({
                stripe_subscription_status: subscription.status,
                max_listings: 1000, // Réduire les limites en cas d'échec
                max_ancillary_services: 0, // Bloquer les services annexes en cas d'échec
                updated_at: new Date().toISOString(),
              })
              .eq('stripe_customer_id', customerId);
          }
        }
        break;
      }

      default:
        // ignore other events
        break;
    }

    res.json({ received: true });
  } catch (e) {
    console.error('Webhook processing error', e);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}



