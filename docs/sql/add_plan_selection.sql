-- Add plan selection and subdomain columns to founding_members table
-- Run this in Supabase SQL Editor

ALTER TABLE founding_members 
ADD COLUMN IF NOT EXISTS selected_plan TEXT,
ADD COLUMN IF NOT EXISTS plan_selected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subdomain TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subdomain_set_at TIMESTAMPTZ;

-- Add comments explaining the valid values
COMMENT ON COLUMN founding_members.selected_plan IS 'Valid values: PRO, TEAM, BROKERAGE, ENTERPRISE';
COMMENT ON COLUMN founding_members.subdomain IS 'Unique subdomain for user site, e.g., "mariasilva" for mariasilva.stellareal.com.br';

-- Create index for faster subdomain lookups
CREATE INDEX IF NOT EXISTS idx_founding_members_subdomain ON founding_members(subdomain);
