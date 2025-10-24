-- Migration: Add profession column to profiles table
-- Date: 2025-01-27
-- Description: Add profession field to store user's professional category

-- Add profession column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN profession text;

-- Add comment to describe the column
COMMENT ON COLUMN public.profiles.profession IS 'Professional category of the user (regie, service-transaction, service-location, agent-immobilier, mandataires, independants-franchises, promoteur, fonciere, notaire, avocat, expert-comptable, architecte, decorateur, autre)';

-- Optional: Create an index on profession for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_profession ON public.profiles(profession);

-- No constraints - any text value is allowed for profession
