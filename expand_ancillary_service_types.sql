-- Migration: Expand allowed values for ancillary_services.service_type
-- Date: 2025-10-29

-- This migration replaces the existing CHECK constraint on service_type
-- to include additional categories requested for the UI tabs.

DO $$
DECLARE
  constraint_name text;
BEGIN
  -- Find existing check constraint name on service_type
  SELECT conname INTO constraint_name
  FROM pg_constraint c
  JOIN pg_attribute a ON a.attnum = ANY (c.conkey)
  JOIN pg_class t ON t.oid = c.conrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
  WHERE c.contype = 'c'
    AND t.relname = 'ancillary_services'
    AND n.nspname = 'public'
    AND a.attname = 'service_type'
  LIMIT 1;

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.ancillary_services DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

ALTER TABLE public.ancillary_services
  ADD CONSTRAINT ancillary_services_service_type_check
  CHECK (service_type IN (
    'demenagement',
    'travaux',
    'diagnostic',
    'nettoyage',
    'assurance',
    'amenagement',
    'courtier',
    'notaire',
    'banque',
    'artisan',
    'gestionnaire_patrimoine',
    'geometre',
    'maitre_oeuvre',
    'architecte',
    'amo',
    'promoteur_lotisseur',
    'autre'
  ));


