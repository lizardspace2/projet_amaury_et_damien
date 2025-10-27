-- Migration: Create ancillary_services table
-- Date: 2025-01-27
-- Description: Create table for ancillary services (déménagement, travaux, diagnostics, etc.)

CREATE TABLE IF NOT EXISTS public.ancillary_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Type de service (catégorie principale)
  service_type text NOT NULL CHECK (
    service_type IN (
      'demenagement', 
      'travaux',
      'diagnostic',
      'nettoyage',
      'assurance',
      'amenagement',
      'autre'
    )
  ),

  -- Description libre
  description text,

  -- Détails spécifiques selon le type
  estimated_cost numeric(12,2),
  provider_name text,
  provider_contact jsonb, -- { "phone": "...", "email": "...", "website": "..." }

  -- Statut et gestion
  status text DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'completed', 'cancelled')
  ),
  requested_at timestamptz DEFAULT now(),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  completed_at timestamptz,

  -- Données additionnelles dynamiques selon le type
  metadata jsonb, -- exemple: {"surface_m2": 75, "type_travaux": "peinture", "nombre_pieces": 3}

  -- Tracking utilisateur
  requested_by uuid REFERENCES public.profiles(user_id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ancillary_services_service_type ON public.ancillary_services(service_type);
CREATE INDEX IF NOT EXISTS idx_ancillary_services_status ON public.ancillary_services(status);
CREATE INDEX IF NOT EXISTS idx_ancillary_services_requested_by ON public.ancillary_services(requested_by);
CREATE INDEX IF NOT EXISTS idx_ancillary_services_created_at ON public.ancillary_services(created_at);

-- Enable Row Level Security
ALTER TABLE public.ancillary_services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.ancillary_services;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.ancillary_services;
DROP POLICY IF EXISTS "Allow users to update own services" ON public.ancillary_services;
DROP POLICY IF EXISTS "Allow users to delete own services" ON public.ancillary_services;

-- Policy: Users can view all ancillary services
CREATE POLICY "Allow public read access" ON public.ancillary_services
  FOR SELECT USING (true);

-- Policy: Users can insert their own services
CREATE POLICY "Allow authenticated users to insert" ON public.ancillary_services
  FOR INSERT WITH CHECK (auth.uid() = requested_by);

-- Policy: Users can update their own services
CREATE POLICY "Allow users to update own services" ON public.ancillary_services
  FOR UPDATE USING (auth.uid() = requested_by);

-- Policy: Users can delete their own services
CREATE POLICY "Allow users to delete own services" ON public.ancillary_services
  FOR DELETE USING (auth.uid() = requested_by);

