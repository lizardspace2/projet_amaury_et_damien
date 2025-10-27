-- Migration: Add user_type column to profiles table
-- Date: 2025-01-27
-- Description: Add user_type field to distinguish between "Particulier", "Professionnelle", and "Partenaire"

-- Add user_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type text;

-- Add check constraint for valid user types
ALTER TABLE public.profiles
ADD CONSTRAINT check_user_type 
CHECK (user_type IN ('Particulier', 'Professionnelle', 'Partenaire'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);

-- Add comment to describe the column
COMMENT ON COLUMN public.profiles.user_type IS 'Type of user: Particulier (individual), Professionnelle (professional), Partenaire (partner)';

