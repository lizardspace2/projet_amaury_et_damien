-- Migration: Add profession column to profiles table
-- Date: 2025-01-27
-- Description: Add profession field to store user's professional category

-- Add profession column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN profession text;

-- Add SIRET column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN siret text;

-- Add comment to describe the columns
COMMENT ON COLUMN public.profiles.profession IS 'Professional category of the user (regie, service-transaction, service-location, agent-immobilier, mandataires, independants-franchises, promoteur, fonciere, notaire, avocat, expert-comptable, architecte, decorateur, autre)';
COMMENT ON COLUMN public.profiles.siret IS 'SIRET number of the user (14 digits)';

-- Optional: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_profession ON public.profiles(profession);
CREATE INDEX IF NOT EXISTS idx_profiles_siret ON public.profiles(siret);

-- No constraints - any text value is allowed for profession
