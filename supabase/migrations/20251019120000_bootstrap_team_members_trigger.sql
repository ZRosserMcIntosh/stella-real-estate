-- Bootstrap team_members on auth.users insert and grant initial admins
begin;

-- Create or replace a trigger function that upserts into public.team_members
create or replace function public.on_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  admin_count int;
  default_full_name text;
  assigned_role text;
begin
  -- Count existing admin-like members
  select count(*) into admin_count from public.team_members where role in ('owner','admin','exec');

  -- Derive a display name from metadata or email prefix
  default_full_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  -- First two become 'owner', rest are 'viewer' by default
  assigned_role := case when admin_count < 2 then 'owner' else 'viewer' end;

  insert into public.team_members (user_id, full_name, email, role, status)
  values (new.id, default_full_name, new.email, assigned_role, 'active')
  on conflict (email) do update set user_id = excluded.user_id;

  return new;
end;
$$;

-- Attach the trigger to auth.users
drop trigger if exists public_on_user_created on auth.users;
create trigger public_on_user_created
after insert on auth.users
for each row execute function public.on_auth_user_created();

commit;

