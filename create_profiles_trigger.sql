-- Create a trigger to automatically create a profile row when a new auth user is created
-- Safe to run multiple times: uses CREATE OR REPLACE and IF NOT EXISTS guards

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    email, 
    user_type, 
    phone,
    address,
    profession,
    siret,
    instagram,
    twitter,
    facebook,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(((NEW.raw_user_meta_data ->> 'user_type')::text), 'Particulier'),
    (NEW.raw_user_meta_data ->> 'phone')::text,
    (NEW.raw_user_meta_data ->> 'address')::text,
    (NEW.raw_user_meta_data ->> 'profession')::text,
    (NEW.raw_user_meta_data ->> 'siret')::text,
    (NEW.raw_user_meta_data ->> 'instagram')::text,
    (NEW.raw_user_meta_data ->> 'twitter')::text,
    (NEW.raw_user_meta_data ->> 'facebook')::text,
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    user_type = COALESCE(EXCLUDED.user_type, profiles.user_type),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    address = COALESCE(EXCLUDED.address, profiles.address),
    profession = COALESCE(EXCLUDED.profession, profiles.profession),
    siret = COALESCE(EXCLUDED.siret, profiles.siret),
    instagram = COALESCE(EXCLUDED.instagram, profiles.instagram),
    twitter = COALESCE(EXCLUDED.twitter, profiles.twitter),
    facebook = COALESCE(EXCLUDED.facebook, profiles.facebook),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the function owner has rights; in Supabase this is typically fine as SECURITY DEFINER

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();



