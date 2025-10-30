-- Backfill des user_type manquants et sécurisation d'une valeur par défaut
UPDATE public.profiles
SET user_type = 'Particulier'
WHERE user_type IS NULL;

-- Optionnel: si vous souhaitez normaliser certaines valeurs incohérentes (ex: pluriels/accents)
-- UPDATE public.profiles SET user_type = 'Professionnelle' WHERE user_type IN ('Professionnel', 'Pro');


