-- Add plan selection columns to founding_members table
-- Run this in Supabase SQL Editor

ALTER TABLE founding_members 
ADD COLUMN IF NOT EXISTS selected_plan TEXT,
ADD COLUMN IF NOT EXISTS plan_selected_at TIMESTAMPTZ;

-- Add a comment explaining the valid plan values
COMMENT ON COLUMN founding_members.selected_plan IS 'Valid values: PRO, TEAM, BROKERAGE, ENTERPRISE';
