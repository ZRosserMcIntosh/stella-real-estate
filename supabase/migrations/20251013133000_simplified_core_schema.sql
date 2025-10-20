-- Simplified core schema for Stella: team, clients, projects, listings
create schema if not exists stella;

-- TEAM MEMBERS
create table if not exists stella.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  email text not null unique,
  phones text[] default '{}',
  role text check (role in ('owner','admin','exec','manager','agent','ops','marketing','legal','accounting','contractor','viewer')) not null default 'viewer',
  department text,
  city text,
  state_code text,
  country_code text default 'BR',
  status text check (status in ('active','inactive','onboarding','offboarding')) not null default 'active',
  employment_type text check (employment_type in ('CLT','PJ','Contractor','Intern')),
  manager_id uuid references stella.team_members(id) on delete set null,
  vendor_name text,
  tags text[] default '{}',
  data_scope text check (data_scope in ('own','team','office','city','all')) default 'own',
  permissions jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

alter table stella.team_members enable row level security;

-- Policies: self read; admins (owner/admin/exec) manage all
drop policy if exists team_self_select on stella.team_members;
create policy team_self_select on stella.team_members for select using (auth.uid() = user_id);

drop policy if exists team_admin_all on stella.team_members;
create policy team_admin_all on stella.team_members for all using (
  exists (
    select 1
    from stella.team_members me
    where me.user_id = auth.uid()
      and me.role in ('owner','admin','exec')
  )
) with check (
  exists (
    select 1
    from stella.team_members me
    where me.user_id = auth.uid()
      and me.role in ('owner','admin','exec')
  )
);

-- CLIENTS
create table if not exists stella.clients (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('person','company')) not null default 'person',
  full_name text,
  company_name text,
  email text,
  phones text[] default '{}',
  city text,
  state_code text,
  country_code text default 'BR',
  status text check (status in ('active','inactive','prospect','archived')) default 'active',
  owner_id uuid references stella.team_members(id) on delete set null,
  tags text[] default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table stella.clients enable row level security;
drop policy if exists clients_owner_read on stella.clients;
create policy clients_owner_read on stella.clients for select using (
  exists (select 1 from stella.team_members me where me.user_id = auth.uid() and (me.role in ('owner','admin','exec') or me.id = owner_id))
);
drop policy if exists clients_admin_all on stella.clients;
create policy clients_admin_all on stella.clients for all using (
  exists (select 1 from stella.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec'))
) with check (
  exists (select 1 from stella.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec'))
);

-- PROJECTS (new developments)
create table if not exists stella.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  state_code text,
  country_code text default 'BR',
  developer text,
  description text,
  status text check (status in ('planning','active','sold_out','on_hold','archived')) default 'active',
  launch_date date,
  delivery_date date,
  manager_id uuid references stella.team_members(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table stella.projects enable row level security;
drop policy if exists projects_public_read on stella.projects;
create policy projects_public_read on stella.projects for select using (true);
drop policy if exists projects_admin_all on stella.projects;
create policy projects_admin_all on stella.projects for all using (
  exists (select 1 from stella.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec','manager'))
) with check (
  exists (select 1 from stella.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec','manager'))
);

-- LISTINGS (sale or rent)
create table if not exists stella.listings (
  id uuid primary key default gen_random_uuid(),
  kind text check (kind in ('sale','rent')) not null,
  title text not null,
  description text,
  city text,
  state_code text,
  country_code text default 'BR',
  address_line1 text,
  price numeric(14,2),
  currency text default 'BRL',
  bedrooms int,
  bathrooms numeric,
  area_m2 numeric,
  status text check (status in ('draft','active','pending','sold','rented','archived')) default 'draft',
  agent_id uuid references stella.team_members(id) on delete set null,
  project_id uuid references stella.projects(id) on delete set null,
  owner_client_id uuid references stella.clients(id) on delete set null,
  media jsonb default '[]'::jsonb,
  features jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table stella.listings enable row level security;
drop policy if exists listings_public_read_active on stella.listings;
create policy listings_public_read_active on stella.listings for select using (status in ('active'));
drop policy if exists listings_admin_all on stella.listings;
create policy listings_admin_all on stella.listings for all using (
  exists (select 1 from stella.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec','manager','agent'))
) with check (
  exists (select 1 from stella.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec','manager','agent'))
);

-- Filtered views for convenience
create or replace view stella.listings_for_sale as
  select * from stella.listings where kind = 'sale';

create or replace view stella.listings_for_rent as
  select * from stella.listings where kind = 'rent';

-- Upsert helper for team members by email (simplified)
create or replace function stella.add_team_member(
  p_email text,
  p_full_name text,
  p_role text default 'viewer',
  p_department text default null,
  p_city text default null,
  p_status text default 'active'
) returns stella.team_members
language plpgsql
security definer
set search_path = public, auth, stella
as $$
declare
  v_user_id uuid;
  v_rec stella.team_members;
begin
  select id into v_user_id from auth.users where email ilike p_email limit 1;
  insert into stella.team_members (user_id, full_name, email, role, department, city, status)
  values (v_user_id, p_full_name, p_email, p_role, p_department, p_city, p_status)
  on conflict (email) do update set
    user_id = excluded.user_id,
    full_name = excluded.full_name,
    role = excluded.role,
    department = coalesce(excluded.department, stella.team_members.department),
    city = coalesce(excluded.city, stella.team_members.city),
    status = excluded.status,
    updated_at = now()
  returning * into v_rec;
  return v_rec;
end;
$$;

-- NOTE: Legacy tables (roles/permissions) are kept for now; migrate or drop later.
