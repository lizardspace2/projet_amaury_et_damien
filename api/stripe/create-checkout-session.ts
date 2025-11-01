import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const productOrPriceId = process.env.STRIPE_PRICE_ID_PRO_PLUS as string; // Can be a Price ID or Product ID

// Validate environment variables
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

if (!productOrPriceId) {
  throw new Error('STRIPE_PRICE_ID_PRO_PLUS environment variable is not set');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

// Function to get the price ID from a product ID or price ID
async function getPriceId(productOrPriceId: string): Promise<string> {
  // If it's already a Price ID, return it
  if (productOrPriceId.startsWith('price_')) {
    return productOrPriceId;
  }

  // If it's a Product ID, fetch the first active price
  if (productOrPriceId.startsWith('prod_')) {
    const prices = await stripe.prices.list({
      product: productOrPriceId,
      active: true,
      limit: 1,
    });

    if (prices.data.length === 0) {
      throw new Error(
        `No active prices found for product "${productOrPriceId}". ` +
        `Please create a price for this product in your Stripe dashboard.`
      );
    }

    return prices.data[0].id;
  }

  throw new Error(
    `Invalid STRIPE_PRICE_ID_PRO_PLUS: "${productOrPriceId}". ` +
    `It should be a Price ID (starting with "price_") or a Product ID (starting with "prod_").`
  );
}

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

    // Get the price ID (either directly or from the product)
    const priceId = await getPriceId(productOrPriceId);

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



