-- Move to public schema and remove stella schema
-- 1) Create core tables in public (idempotent)

-- TEAM MEMBERS
create table if not exists public.team_members (
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
  manager_id uuid references public.team_members(id) on delete set null,
  vendor_name text,
  tags text[] default '{}',
  data_scope text check (data_scope in ('own','team','office','city','all')) default 'own',
  permissions jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

alter table public.team_members enable row level security;

drop policy if exists team_self_select on public.team_members;
create policy team_self_select on public.team_members for select using (auth.uid() = user_id);

drop policy if exists team_admin_all on public.team_members;
create policy team_admin_all on public.team_members for all using (
  exists (
    select 1 from public.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec')
  )
) with check (
  exists (
    select 1 from public.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec')
  )
);

-- CLIENTS
create table if not exists public.clients (
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
  owner_id uuid references public.team_members(id) on delete set null,
  tags text[] default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.clients enable row level security;

drop policy if exists clients_owner_read on public.clients;
create policy clients_owner_read on public.clients for select using (
  exists (select 1 from public.team_members me where me.user_id = auth.uid() and (me.role in ('owner','admin','exec') or me.id = owner_id))
);

drop policy if exists clients_admin_all on public.clients;
create policy clients_admin_all on public.clients for all using (
  exists (select 1 from public.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec'))
) with check (
  exists (select 1 from public.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec'))
);

-- PROJECTS
create table if not exists public.projects (
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
  manager_id uuid references public.team_members(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.projects enable row level security;

drop policy if exists projects_public_read on public.projects;
create policy projects_public_read on public.projects for select using (true);

drop policy if exists projects_admin_all on public.projects;
create policy projects_admin_all on public.projects for all using (
  exists (select 1 from public.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec','manager'))
) with check (
  exists (select 1 from public.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec','manager'))
);

-- LISTINGS
create table if not exists public.listings (
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
  agent_id uuid references public.team_members(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  owner_client_id uuid references public.clients(id) on delete set null,
  media jsonb default '[]'::jsonb,
  features jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.listings enable row level security;

drop policy if exists listings_public_read_active on public.listings;
create policy listings_public_read_active on public.listings for select using (status in ('active'));

drop policy if exists listings_admin_all on public.listings;
create policy listings_admin_all on public.listings for all using (
  exists (select 1 from public.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec','manager','agent'))
) with check (
  exists (select 1 from public.team_members me where me.user_id = auth.uid() and me.role in ('owner','admin','exec','manager','agent'))
);

-- Convenience views
create or replace view public.listings_for_sale as select * from public.listings where kind = 'sale';
create or replace view public.listings_for_rent as select * from public.listings where kind = 'rent';

-- Helper RPC in public
create or replace function public.add_team_member(
  p_email text,
  p_full_name text,
  p_role text default 'viewer',
  p_department text default null,
  p_city text default null,
  p_status text default 'active'
) returns public.team_members
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_rec public.team_members;
begin
  select id into v_user_id from auth.users where email ilike p_email limit 1;
  insert into public.team_members (user_id, full_name, email, role, department, city, status)
  values (v_user_id, p_full_name, p_email, p_role, p_department, p_city, p_status)
  on conflict (email) do update set
    user_id = excluded.user_id,
    full_name = excluded.full_name,
    role = excluded.role,
    department = coalesce(excluded.department, public.team_members.department),
    city = coalesce(excluded.city, public.team_members.city),
    status = excluded.status,
    updated_at = now()
  returning * into v_rec;
  return v_rec;
end;
$$;

-- Clean-up: remove previous RPC if present
drop function if exists public.add_employee(text, text, text, text, text, text, text);

-- 2) Drop stella schema safely if it exists
-- Drop triggers that reference functions in stella
drop trigger if exists stella_on_user_created on auth.users;
-- Attempt to drop the guard trigger (if the table still exists, the cascade below will handle anyway)
do $$ begin
  if exists (select 1 from information_schema.triggers where event_object_table = 'user_roles' and trigger_schema = 'stella' and trigger_name = 'stella_user_roles_super_admin_guard') then
    execute 'drop trigger stella_user_roles_super_admin_guard on stella.user_roles';
  end if;
end $$;

-- Finally drop the schema
drop schema if exists stella cascade;
