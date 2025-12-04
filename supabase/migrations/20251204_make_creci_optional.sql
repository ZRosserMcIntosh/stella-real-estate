-- Make CRECI fields truly optional in user_profiles
-- This allows users to sign up without providing CRECI information

-- Drop existing constraint if it exists
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_creci_uf_check;

-- Add new constraint that allows NULL values
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_creci_uf_check 
CHECK (creci_uf IS NULL OR creci_uf IN ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'));

-- Also update creci_type constraint to allow NULL
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_creci_type_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_creci_type_check 
CHECK (creci_type IS NULL OR creci_type IN ('individual', 'corporate'));

-- And creci_status constraint to allow NULL
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_creci_status_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_creci_status_check 
CHECK (creci_status IS NULL OR creci_status IN ('pending', 'verified', 'rejected'));

-- Comment explaining the change
COMMENT ON COLUMN public.user_profiles.creci_number IS 'CRECI number - optional for non-realtors';
COMMENT ON COLUMN public.user_profiles.creci_uf IS 'CRECI state - optional, must be valid Brazilian state if provided';
COMMENT ON COLUMN public.user_profiles.creci_type IS 'CRECI type - optional, individual or corporate';
COMMENT ON COLUMN public.user_profiles.creci_status IS 'CRECI verification status - optional';

-- Make CPF optional in founding_members table
ALTER TABLE public.founding_members 
ALTER COLUMN cpf DROP NOT NULL;

-- Make CRECI fields optional in founding_members table
ALTER TABLE public.founding_members 
ALTER COLUMN creci_number DROP NOT NULL;

ALTER TABLE public.founding_members 
ALTER COLUMN creci_uf DROP NOT NULL;

-- Update founding_members CRECI UF constraint to allow NULL
ALTER TABLE public.founding_members 
DROP CONSTRAINT IF EXISTS founding_members_creci_uf_check;

ALTER TABLE public.founding_members 
ADD CONSTRAINT founding_members_creci_uf_check 
CHECK (creci_uf IS NULL OR creci_uf IN ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'));

COMMENT ON COLUMN public.founding_members.cpf IS 'CPF - optional';
COMMENT ON COLUMN public.founding_members.creci_number IS 'CRECI number - optional for non-realtors';
COMMENT ON COLUMN public.founding_members.creci_uf IS 'CRECI state - optional, must be valid Brazilian state if provided';
