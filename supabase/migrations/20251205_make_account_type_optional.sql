-- Make account_type optional in founding_members table with a default value
-- This allows for faster signup without requiring account type selection

ALTER TABLE public.founding_members 
ALTER COLUMN account_type SET DEFAULT 'individual';

-- Ensure existing records without account_type are set to 'individual'
UPDATE public.founding_members 
SET account_type = 'individual' 
WHERE account_type IS NULL;

COMMENT ON COLUMN public.founding_members.account_type IS 'Account type - defaults to individual if not specified';
