import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const priceId = process.env.STRIPE_PRICE_ID_PRO_PLUS as string; // Recurring price for 29.99€/month
const appBaseUrl = process.env.APP_BASE_URL || process.env.VERCEL_URL || '';

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, userEmail } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const successUrl = `https://${appBaseUrl}/billing/success`;
    const cancelUrl = `https://${appBaseUrl}/billing/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}


