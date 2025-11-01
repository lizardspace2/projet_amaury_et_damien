-- RLS Policies for Supabase
-- Run this in your Supabase SQL Editor to fix the 403 errors

-- ==========================================
-- 1. Enable RLS on tables (if not already enabled)
-- ==========================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ancillary_services ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. Properties Table Policies
-- ==========================================

-- Allow authenticated users to INSERT their own properties
CREATE POLICY "Users can insert their own properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to SELECT all properties (public listings)
CREATE POLICY "Anyone can view properties"
ON public.properties
FOR SELECT
TO authenticated
USING (true);

-- Allow users to UPDATE their own properties
CREATE POLICY "Users can update their own properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to DELETE their own properties
CREATE POLICY "Users can delete their own properties"
ON public.properties
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ==========================================
-- 3. Profiles Table Policies
-- ==========================================

-- Allow users to INSERT their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to SELECT their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow public to SELECT profiles (for viewing property owners)
CREATE POLICY "Public can view profiles"
ON public.profiles
FOR SELECT
TO public
USING (true);

-- Allow users to UPDATE their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 4. Property Images Table Policies
-- ==========================================

-- Allow authenticated users to INSERT property images
CREATE POLICY "Users can insert property images"
ON public.property_images
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to SELECT property images
CREATE POLICY "Anyone can view property images"
ON public.property_images
FOR SELECT
TO authenticated
USING (true);

-- Allow users to DELETE property images
CREATE POLICY "Users can delete property images"
ON public.property_images
FOR DELETE
TO authenticated
USING (true);

-- ==========================================
-- 5. Ancillary Services Table Policies
-- ==========================================

-- Allow authenticated users to INSERT ancillary services
CREATE POLICY "Users can insert ancillary services"
ON public.ancillary_services
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = requested_by);

-- Allow authenticated users to SELECT ancillary services
CREATE POLICY "Users can view ancillary services"
ON public.ancillary_services
FOR SELECT
TO authenticated
USING (true);

-- Allow users to UPDATE their own ancillary services
CREATE POLICY "Users can update their own ancillary services"
ON public.ancillary_services
FOR UPDATE
TO authenticated
USING (auth.uid() = requested_by)
WITH CHECK (auth.uid() = requested_by);

-- ==========================================
-- 6. Storage Bucket Policies
-- ==========================================

-- First, create the storage bucket if it doesn't exist
-- Note: This might fail if the bucket already exists, which is fine
INSERT INTO storage.buckets (id, name, public)
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to UPLOAD files to their own folder
CREATE POLICY "Users can upload property images to their folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property_images' 
  AND (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Allow authenticated users to UPDATE files in their own folder
CREATE POLICY "Users can update property images in their folder"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property_images' 
  AND (string_to_array(name, '/'))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'property_images' 
  AND (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Allow authenticated users to DELETE files in their own folder
CREATE POLICY "Users can delete property images from their folder"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'property_images' 
  AND (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Allow public to SELECT (view) all property images
CREATE POLICY "Public can view property images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property_images');

-- Allow authenticated users to SELECT (view) all property images
CREATE POLICY "Authenticated users can view property images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'property_images');

