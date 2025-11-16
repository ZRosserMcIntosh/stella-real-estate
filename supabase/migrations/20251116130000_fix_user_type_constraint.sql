-- Fix user_type constraint conflict
-- The old constraint only allowed ('realtor', 'company', 'individual')
-- We need to drop it and create a new one for our 4-type system

-- First, drop the old constraint (if it exists)
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_user_type_check;

-- Now add the new constraint with our 4 user types
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_user_type_check 
CHECK (user_type IN ('stella_admin', 'stella_team', 'constellation_user', 'stellareal_client'));

-- Update any existing records with old values to map to new system
-- 'realtor' -> 'constellation_user'
-- 'company' -> 'constellation_user' 
-- 'individual' -> 'constellation_user'
UPDATE public.user_profiles 
SET user_type = 'constellation_user' 
WHERE user_type IN ('realtor', 'company', 'individual');
