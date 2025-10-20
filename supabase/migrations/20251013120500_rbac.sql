-- RBAC and Employee base schema for Stella Imóveis
-- Note: run in Supabase SQL Editor or CLI. Adjust schemas as needed.

create schema if not exists stella;

-- Employees (PII in this table)
create table if not exists stella.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  social_name text,
  email text not null unique,
  phone_mobile text,
  phone_alt text,
  whatsapp boolean default true,
  preferred_locale text check (preferred_locale in ('pt','en','es')) default 'pt',
  address_line1 text,
  address_line2 text,
  city text,
  state_code text,
  postal_code text,
  country_code text default 'BR',
  position_title text,
  creci_number text,
  creci_state text,
  creci_valid_until date,
  department text,
  teams text[],
  manager_id uuid references stella.employees(id) on delete set null,
  languages text[] default '{pt}',
  bio_pt text,
  bio_en text,
  bio_es text,
  headshot_url text,
  public_page_visible boolean default false,
  cpf text,
  dob date,
  rg text,
  tax_residency_country text default 'BR',
  documents jsonb default '[]'::jsonb,
  pix_key_type text check (pix_key_type in ('cpf','cnpj','email','phone','aleatoria')),
  pix_key_value text,
  bank_name text,
  bank_branch text,
  bank_account text,
  commission_plan_id uuid,
  employment_type text check (employment_type in ('CLT','PJ','Contractor')),
  hire_date date,
  end_date date,
  status text check (status in ('active','suspended','terminated')) default 'active',
  notes_internal text,
  allowed_states text[] default '{}',
  allowed_cities text[] default '{}',
  listing_scope text check (listing_scope in ('own','team','city','global')) default 'own',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

-- Roles & permissions
create table if not exists stella.roles (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  description text,
  system boolean default false
);

create table if not exists stella.permissions (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  description text,
  sensitive boolean default false,
  requires_approval boolean default false,
  scope_aware boolean default false
);

create table if not exists stella.role_permissions (
  role_id uuid references stella.roles(id) on delete cascade,
  permission_id uuid references stella.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists stella.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role_id uuid references stella.roles(id) on delete cascade,
  primary key (user_id, role_id)
);

-- Per-user overrides
create table if not exists stella.user_permissions (
  user_id uuid references auth.users(id) on delete cascade,
  permission_id uuid references stella.permissions(id) on delete cascade,
  allowed boolean not null default true,
  primary key (user_id, permission_id)
);

-- Scope controls per user
create table if not exists stella.user_scopes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  scope_listings text check (scope_listings in ('own','team','city','global')) default 'own',
  scope_leads text check (scope_leads in ('own','team','city','global')) default 'own',
  cities text[] default '{}'
);

-- Seed roles (subset)
insert into stella.roles (key, name, description, system) values
  ('owner','Owner','All access', true),
  ('admin','Admin','Admin access', true),
  ('broker_manager','Broker / Sales Manager','Regional manager', true),
  ('agent_senior','Agent (Senior)','Senior agent', true),
  ('agent_junior','Agent (Junior)','Junior agent', true),
  ('marketing','Marketing','Content & SEO', true),
  ('legal','Legal','Contracts & LGPD', true),
  ('accounting','Accounting','Finance & payouts', true),
  ('operations','Operations','Scheduling & ops', true),
  ('read_only','Read-only','Dashboards only', true),
  ('external','External','Contrib limited', true)
on conflict do nothing;

-- Seed permissions (subset of the spec; add remaining as needed)
insert into stella.permissions (key, description, sensitive, requires_approval, scope_aware) values
  ('listings.create','Create listings', false, false, false),
  ('listings.edit','Edit listings', false, false, true),
  ('listings.publish','Publish listings', false, true, false),
  ('listings.unpublish','Unpublish listings', false, false, false),
  ('listings.delete','Delete listings', false, true, false),
  ('listings.change_price','Change price', false, true, false),
  ('listings.manage_media','Manage listing media', false, false, false),
  ('listings.assign_agent','Assign agent', false, false, false),
  ('listings.export','Export listings', true, false, false),
  ('leads.view','View leads', false, false, true),
  ('leads.view_unmasked_contacts','View unmasked lead contacts', true, false, false),
  ('leads.edit','Edit leads', false, false, true),
  ('leads.assign','Assign leads', false, false, true),
  ('leads.export','Export leads', true, false, false),
  ('clients.view_contact_details_unmasked','View client contact details unmasked', true, false, false),
  ('finance.view_commissions','View commissions', true, false, true),
  ('users.manage','Manage users', true, false, false),
  ('roles.manage','Manage roles', true, false, false),
  ('privacy.lgpd_console','LGPD console', true, false, false),
  ('audit.view_logs','View audit logs', true, false, false)
on conflict do nothing;

-- TODO: Seed role_permissions per the spec bundles.

-- RLS (enable and add policies later as needed)
alter table stella.employees enable row level security;
-- Example policy placeholders
-- create policy "employees_self" on stella.employees for select using (auth.uid() = user_id);
-- create policy "employees_admin" on stella.employees for all using (exists (select 1 from stella.user_roles ur join stella.roles r on r.id=ur.role_id where ur.user_id = auth.uid() and r.key in ('owner','admin')));
