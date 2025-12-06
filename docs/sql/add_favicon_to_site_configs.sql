-- Add favicon_url and default template fields to site_configs table
-- Run this in Supabase SQL Editor

-- Add the favicon_url column
ALTER TABLE site_configs 
ADD COLUMN IF NOT EXISTS favicon_url TEXT;

-- Add hero section fields
ALTER TABLE site_configs 
ADD COLUMN IF NOT EXISTS hero_title TEXT;

ALTER TABLE site_configs 
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;

ALTER TABLE site_configs 
ADD COLUMN IF NOT EXISTS hero_cta_text TEXT;

ALTER TABLE site_configs 
ADD COLUMN IF NOT EXISTS hero_background_url TEXT;

-- Add about section fields
ALTER TABLE site_configs 
ADD COLUMN IF NOT EXISTS about_title TEXT;

ALTER TABLE site_configs 
ADD COLUMN IF NOT EXISTS about_text TEXT;

ALTER TABLE site_configs 
ADD COLUMN IF NOT EXISTS about_image_url TEXT;

-- Add comments describing the columns
COMMENT ON COLUMN site_configs.favicon_url IS 'URL to the favicon image for the user''s site (displayed in browser tab)';
COMMENT ON COLUMN site_configs.hero_title IS 'Main title for the hero section';
COMMENT ON COLUMN site_configs.hero_subtitle IS 'Subtitle for the hero section';
COMMENT ON COLUMN site_configs.hero_cta_text IS 'Call-to-action button text for the hero section';
COMMENT ON COLUMN site_configs.hero_background_url IS 'Background image URL for the hero section';
COMMENT ON COLUMN site_configs.about_title IS 'Title for the about section';
COMMENT ON COLUMN site_configs.about_text IS 'Description text for the about section';
COMMENT ON COLUMN site_configs.about_image_url IS 'Image URL for the about section';

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'site_configs' 
AND column_name IN ('favicon_url', 'hero_title', 'hero_subtitle', 'hero_cta_text', 'about_title', 'about_text')
ORDER BY column_name;
