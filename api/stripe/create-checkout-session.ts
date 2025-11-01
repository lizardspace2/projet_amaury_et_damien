import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const priceId = process.env.STRIPE_PRICE_ID_PRO_PLUS as string; // Recurring price for 29.99€/month

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

function getBaseUrl(req: VercelRequest): string {
  // Try multiple sources for the base URL
  let appBaseUrl = process.env.APP_BASE_URL || process.env.VERCEL_URL || '';
  
  // Fallback to request headers if env vars are not set
  if (!appBaseUrl || appBaseUrl.trim().length === 0) {
    const host = req.headers.host || req.headers['x-forwarded-host'];
    if (host) {
      appBaseUrl = host;
    }
  }
  
  if (!appBaseUrl || appBaseUrl.trim().length === 0) {
    throw new Error('APP_BASE_URL or VERCEL_URL environment variable is not set, and cannot determine host from request');
  }
  
  // Remove any existing protocol if present
  const cleanUrl = appBaseUrl.replace(/^https?:\/\//, '').trim();
  
  // Ensure we have a valid domain
  if (!cleanUrl || cleanUrl.length === 0) {
    throw new Error('Invalid base URL configuration');
  }
  
  return cleanUrl;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, userEmail } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const baseUrl = getBaseUrl(req);
    const successUrl = `https://${baseUrl}/billing/success`;
    const cancelUrl = `https://${baseUrl}/billing/cancel`;

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



