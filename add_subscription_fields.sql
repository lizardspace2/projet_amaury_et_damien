-- Migration: Add subscription fields and quota to profiles
-- Date: 2025-10-29

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS max_listings integer DEFAULT 50;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id text;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_subscription_status text;

CREATE INDEX IF NOT EXISTS idx_profiles_max_listings ON public.profiles(max_listings);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);



