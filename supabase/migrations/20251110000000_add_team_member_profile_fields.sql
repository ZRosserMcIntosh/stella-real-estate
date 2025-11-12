-- Add additional profile fields to team_members table for the Account page
-- These fields enhance the user profile management capabilities

-- Add profile fields
alter table public.team_members
  add column if not exists social_name text,
  add column if not exists whatsapp boolean default true,
  add column if not exists preferred_locale text check (preferred_locale in ('pt','en','es')) default 'pt',
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists postal_code text,
  add column if not exists bio_pt text,
  add column if not exists bio_en text,
  add column if not exists bio_es text,
  add column if not exists headshot_url text;

-- Add comments for documentation
comment on column public.team_members.social_name is 'Preferred name for social/informal use';
comment on column public.team_members.whatsapp is 'Whether WhatsApp is enabled on the primary mobile number';
comment on column public.team_members.preferred_locale is 'Preferred language for UI and communications';
comment on column public.team_members.address_line1 is 'Primary address line';
comment on column public.team_members.address_line2 is 'Secondary address line (apt, suite, etc)';
comment on column public.team_members.postal_code is 'Postal/ZIP code';
comment on column public.team_members.bio_pt is 'Biography in Portuguese';
comment on column public.team_members.bio_en is 'Biography in English';
comment on column public.team_members.bio_es is 'Biography in Spanish';
comment on column public.team_members.headshot_url is 'URL to profile picture/headshot';
