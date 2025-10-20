-- Fix recursive RLS by using SECURITY DEFINER helpers and simplifying policies
begin;

-- Helper function: is_admin (bypasses RLS via SECURITY DEFINER)
create or replace function public.is_admin(u uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.team_members
    where user_id = u
      and role in ('owner','admin','exec')
  );
$$;

-- Helper function: is_staff (admin/exec/manager/agent)
create or replace function public.is_staff(u uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.team_members
    where user_id = u
      and role in ('owner','admin','exec','manager','agent')
  );
$$;

-- Recreate policies on public.team_members to avoid self-referencing SELECTs
drop policy if exists team_admin_all on public.team_members;
create policy team_admin_all on public.team_members
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- public.clients: admin full; owners can read their clients
drop policy if exists clients_owner_read on public.clients;
create policy clients_owner_read on public.clients
for select using (
  public.is_admin()
  or exists (
    select 1 from public.team_members me
    where me.user_id = auth.uid()
      and me.id = owner_id
  )
);

drop policy if exists clients_admin_all on public.clients;
create policy clients_admin_all on public.clients
for all using (public.is_admin())
with check (public.is_admin());

-- public.projects: admins and managers can manage
drop policy if exists projects_admin_all on public.projects;
create policy projects_admin_all on public.projects
for all using (
  public.is_admin() or public.is_staff()
) with check (
  public.is_admin() or public.is_staff()
);

-- public.listings: staff (agent/manager/admin/exec/owner) can manage
drop policy if exists listings_admin_all on public.listings;
create policy listings_admin_all on public.listings
for all using (public.is_staff())
with check (public.is_staff());

commit;
