-- Migration: Increase default monthly listings quota to 50 and align free accounts
-- Date: 2025-10-30

-- Set new default to 50 for future rows
ALTER TABLE public.profiles
ALTER COLUMN max_listings SET DEFAULT 50;

-- Bump existing free/canceled accounts below 50 up to 50
UPDATE public.profiles
SET max_listings = 50,
    updated_at = NOW()
WHERE COALESCE(stripe_subscription_status, 'canceled') <> 'active'
  AND (max_listings IS NULL OR max_listings < 50);


