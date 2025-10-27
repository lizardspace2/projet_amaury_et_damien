-- Migration: Add missing columns to ancillary_services table
-- Date: 2025-01-27
-- Description: Add all columns that might be missing from the ancillary_services table

-- Add end_date column if it doesn't exist
ALTER TABLE public.ancillary_services 
ADD COLUMN IF NOT EXISTS end_date date;

-- Add start_date column if it doesn't exist
ALTER TABLE public.ancillary_services 
ADD COLUMN IF NOT EXISTS start_date date DEFAULT CURRENT_DATE;

-- Ensure metadata column exists
ALTER TABLE public.ancillary_services 
ADD COLUMN IF NOT EXISTS metadata jsonb;

-- Add is_active column to track if announcement is currently active
ALTER TABLE public.ancillary_services 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create index for better query performance on is_active
CREATE INDEX IF NOT EXISTS idx_ancillary_services_is_active ON public.ancillary_services(is_active);

-- Function to automatically update is_active based on dates
CREATE OR REPLACE FUNCTION update_ancillary_service_active_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If end_date is not set, service is active if start_date is today or in the past
  -- If end_date is set, service is active if current date is between start_date and end_date
  IF NEW.end_date IS NULL THEN
    NEW.is_active := NEW.start_date <= CURRENT_DATE;
  ELSE
    NEW.is_active := NEW.start_date <= CURRENT_DATE AND NEW.end_date >= CURRENT_DATE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update is_active when inserting or updating
DROP TRIGGER IF EXISTS trigger_update_ancillary_service_active ON public.ancillary_services;
CREATE TRIGGER trigger_update_ancillary_service_active
BEFORE INSERT OR UPDATE ON public.ancillary_services
FOR EACH ROW
EXECUTE FUNCTION update_ancillary_service_active_status();

-- Ensure provider_contact is jsonb if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'ancillary_services' 
        AND column_name = 'provider_contact'
        AND data_type != 'jsonb'
    ) THEN
        ALTER TABLE public.ancillary_services 
        ALTER COLUMN provider_contact TYPE jsonb USING provider_contact::jsonb;
    END IF;
END $$;

