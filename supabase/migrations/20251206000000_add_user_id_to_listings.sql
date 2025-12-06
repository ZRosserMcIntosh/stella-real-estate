-- Add user_id to listings table for multi-tenancy support
-- This allows Constellation users to have their own listings scoped to their account
-- Listings without user_id are considered Stella Real Estate (main site) listings

BEGIN;

-- 1) Add user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'listings' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.listings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END$$;

-- 2) Create index for efficient user-based queries
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);

-- 3) Create composite index for user + listing_type queries
CREATE INDEX IF NOT EXISTS idx_listings_user_listing_type ON public.listings(user_id, listing_type);

-- 4) Update RLS policies to support user-scoped listings

-- Drop existing policies
DROP POLICY IF EXISTS listings_public_read_active ON public.listings;
DROP POLICY IF EXISTS listings_admin_all ON public.listings;
DROP POLICY IF EXISTS listings_user_own ON public.listings;

-- Policy: Public can read active listings (both main site and user sites)
CREATE POLICY listings_public_read_active ON public.listings 
  FOR SELECT 
  USING (status IN ('active'));

-- Policy: Stella admin/team can manage ALL listings (including main site listings where user_id IS NULL)
CREATE POLICY listings_admin_all ON public.listings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members me 
      WHERE me.user_id = auth.uid() 
      AND me.role IN ('owner','admin','exec','manager','agent')
    )
  ) 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members me 
      WHERE me.user_id = auth.uid() 
      AND me.role IN ('owner','admin','exec','manager','agent')
    )
  );

-- Policy: Constellation users can manage ONLY their own listings (user_id = auth.uid())
CREATE POLICY listings_user_own ON public.listings 
  FOR ALL 
  USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.founding_members fm 
      WHERE fm.user_id = auth.uid() 
      AND fm.payment_status = 'paid'
    )
  ) 
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.founding_members fm 
      WHERE fm.user_id = auth.uid() 
      AND fm.payment_status = 'paid'
    )
  );

COMMIT;
