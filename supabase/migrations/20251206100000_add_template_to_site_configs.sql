-- Add template_id to site_configs table for template selection
-- Templates: 'stella' (default), 'luxe', 'minimal', 'bold'

BEGIN;

-- 1) Add template_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_configs' AND column_name = 'template_id'
  ) THEN
    ALTER TABLE public.site_configs ADD COLUMN template_id TEXT DEFAULT 'stella';
  END IF;
END$$;

-- 2) Add template_config JSONB for template-specific settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_configs' AND column_name = 'template_config'
  ) THEN
    ALTER TABLE public.site_configs ADD COLUMN template_config JSONB DEFAULT '{}'::jsonb;
  END IF;
END$$;

-- 3) Add additional branding columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_configs' AND column_name = 'brand_name'
  ) THEN
    ALTER TABLE public.site_configs ADD COLUMN brand_name TEXT;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_configs' AND column_name = 'creci_number'
  ) THEN
    ALTER TABLE public.site_configs ADD COLUMN creci_number TEXT;
  END IF;
END$$;

-- 4) Add dark mode preference
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_configs' AND column_name = 'dark_mode'
  ) THEN
    ALTER TABLE public.site_configs ADD COLUMN dark_mode BOOLEAN DEFAULT false;
  END IF;
END$$;

-- 5) Add Google Analytics ID
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_configs' AND column_name = 'google_analytics_id'
  ) THEN
    ALTER TABLE public.site_configs ADD COLUMN google_analytics_id TEXT;
  END IF;
END$$;

-- 6) Add Facebook Pixel ID
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_configs' AND column_name = 'facebook_pixel_id'
  ) THEN
    ALTER TABLE public.site_configs ADD COLUMN facebook_pixel_id TEXT;
  END IF;
END$$;

-- Comments
COMMENT ON COLUMN public.site_configs.template_id IS 'Template identifier: stella (default), luxe (luxury), minimal (clean), bold (striking)';
COMMENT ON COLUMN public.site_configs.template_config IS 'JSON config specific to the selected template';
COMMENT ON COLUMN public.site_configs.brand_name IS 'Business/brand name (can differ from site_name)';
COMMENT ON COLUMN public.site_configs.creci_number IS 'CRECI license number to display';
COMMENT ON COLUMN public.site_configs.dark_mode IS 'Whether site defaults to dark mode';
COMMENT ON COLUMN public.site_configs.google_analytics_id IS 'Google Analytics tracking ID (GA4)';
COMMENT ON COLUMN public.site_configs.facebook_pixel_id IS 'Facebook Pixel ID for ads tracking';

COMMIT;
