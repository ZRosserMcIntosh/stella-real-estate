-- Create site_configs table for multi-tenant site builder
-- Each user has their own isolated site configuration

-- Drop table if exists (for development only, remove in production)
-- DROP TABLE IF EXISTS public.site_configs CASCADE;

CREATE TABLE IF NOT EXISTS public.site_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subdomain TEXT NOT NULL UNIQUE,
  
  -- Basic Site Info
  site_name TEXT,
  site_tagline TEXT,
  site_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  cover_image_url TEXT,
  
  -- Theme Settings
  primary_color TEXT DEFAULT '#6366f1',
  secondary_color TEXT DEFAULT '#8b5cf6',
  accent_color TEXT DEFAULT '#06b6d4',
  font_heading TEXT DEFAULT 'Inter',
  font_body TEXT DEFAULT 'Inter',
  
  -- Contact Info (can override founding_members data)
  contact_email TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  contact_address TEXT,
  contact_city TEXT,
  contact_state TEXT,
  
  -- Social Links
  social_instagram TEXT,
  social_facebook TEXT,
  social_linkedin TEXT,
  social_youtube TEXT,
  social_tiktok TEXT,
  
  -- Section Configuration (JSON for flexibility)
  sections JSONB DEFAULT '[
    {"id": "hero", "enabled": true, "order": 1, "config": {}},
    {"id": "featured", "enabled": true, "order": 2, "config": {}},
    {"id": "about", "enabled": true, "order": 3, "config": {}},
    {"id": "services", "enabled": true, "order": 4, "config": {}},
    {"id": "testimonials", "enabled": false, "order": 5, "config": {}},
    {"id": "contact", "enabled": true, "order": 6, "config": {}}
  ]'::jsonb,
  
  -- Hero Section
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_background_url TEXT,
  hero_cta_text TEXT DEFAULT 'Ver Imóveis',
  hero_cta_url TEXT DEFAULT '#imoveis',
  
  -- About Section
  about_title TEXT,
  about_description TEXT,
  about_image_url TEXT,
  
  -- Services Section
  services_title TEXT DEFAULT 'Nossos Serviços',
  services_items JSONB DEFAULT '[]'::jsonb,
  
  -- Testimonials Section
  testimonials_title TEXT DEFAULT 'Depoimentos',
  testimonials_items JSONB DEFAULT '[]'::jsonb,
  
  -- Contact Section
  contact_section_title TEXT DEFAULT 'Entre em Contato',
  contact_section_subtitle TEXT,
  show_contact_form BOOLEAN DEFAULT true,
  
  -- Footer
  footer_text TEXT,
  footer_links JSONB DEFAULT '[]'::jsonb,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_image_url TEXT,
  
  -- Custom CSS/JS (advanced users)
  custom_css TEXT,
  custom_head_html TEXT,
  
  -- Status
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for fast subdomain lookups
CREATE INDEX IF NOT EXISTS idx_site_configs_subdomain ON public.site_configs(subdomain);
CREATE INDEX IF NOT EXISTS idx_site_configs_user_id ON public.site_configs(user_id);

-- Enable Row Level Security
ALTER TABLE public.site_configs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/write their own site config
CREATE POLICY "Users can view their own site config"
  ON public.site_configs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own site config"
  ON public.site_configs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own site config"
  ON public.site_configs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own site config"
  ON public.site_configs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Anyone can read published sites (for public viewing)
CREATE POLICY "Anyone can view published sites by subdomain"
  ON public.site_configs
  FOR SELECT
  USING (is_published = true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_configs_updated_at
  BEFORE UPDATE ON public.site_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_site_configs_updated_at();

-- Function to create site config when user sets subdomain
CREATE OR REPLACE FUNCTION create_site_config_for_subdomain()
RETURNS TRIGGER AS $$
BEGIN
  -- When subdomain is set on founding_members, create site_config if not exists
  IF NEW.subdomain IS NOT NULL AND OLD.subdomain IS DISTINCT FROM NEW.subdomain THEN
    INSERT INTO public.site_configs (user_id, subdomain, site_name, contact_email, contact_phone)
    VALUES (
      NEW.user_id,
      NEW.subdomain,
      NEW.full_name,
      NEW.email,
      NEW.phone
    )
    ON CONFLICT (subdomain) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on founding_members to auto-create site_config
CREATE TRIGGER founding_members_create_site_config
  AFTER INSERT OR UPDATE OF subdomain ON public.founding_members
  FOR EACH ROW
  EXECUTE FUNCTION create_site_config_for_subdomain();

-- Grant permissions
GRANT SELECT ON public.site_configs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_configs TO authenticated;

COMMENT ON TABLE public.site_configs IS 'Stores individual site configurations for each user/subdomain. Each user has complete data isolation.';
