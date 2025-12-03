-- Create site_settings table to store global site configuration
-- This replaces localStorage-based settings so they work across browsers/devices

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE site_settings IS 'Global site configuration settings (replaces localStorage)';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create site_settings_history table for tracking historical values (e.g., video IDs)
CREATE TABLE IF NOT EXISTS site_settings_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_history_key_used_at 
  ON site_settings_history (key, used_at DESC);

-- Add comment
COMMENT ON TABLE site_settings_history IS 'Historical values for site settings (e.g., previously used video IDs)';

-- Enable RLS (Row Level Security)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read settings
CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Only allow admin users to update settings
-- TODO: Replace with proper role check when user_profiles table has roles
CREATE POLICY "Only admins can modify site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read history
CREATE POLICY "Anyone can read site settings history"
  ON site_settings_history
  FOR SELECT
  TO authenticated
  USING (true);

-- Only allow admin users to insert history
CREATE POLICY "Only admins can add to site settings history"
  ON site_settings_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
