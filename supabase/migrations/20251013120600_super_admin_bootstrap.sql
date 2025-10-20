-- Super Admin bootstrap: first two auth.users become super_admin automatically; enforce max of two.
create schema if not exists stella;

insert into stella.roles (key, name, description, system)
values ('super_admin','Super Admin','Top-level admin with full access', true)
on conflict (key) do nothing;

create or replace function stella.on_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public, auth, stella
as $$
declare
  super_id uuid;
  current_count int;
begin
  select id into super_id from stella.roles where key = 'super_admin';
  if super_id is null then
    insert into stella.roles (key, name, description, system)
    values ('super_admin','Super Admin','Top-level admin with full access', true)
    on conflict (key) do update set system = excluded.system
    returning id into super_id;
  end if;

  select count(*) into current_count from stella.user_roles where role_id = super_id;
  if current_count < 2 then
    insert into stella.user_roles (user_id, role_id)
    values (new.id, super_id)
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists stella_on_user_created on auth.users;
create trigger stella_on_user_created
after insert on auth.users
for each row execute function stella.on_auth_user_created();

create or replace function stella.user_roles_super_admin_guard()
returns trigger
language plpgsql
security definer
set search_path = public, stella
as $$
declare
  super_id uuid;
  current_count int;
begin
  select id into super_id from stella.roles where key = 'super_admin';
  if super_id is null then
    return new;
  end if;
  if (tg_op = 'INSERT' and new.role_id = super_id)
     or (tg_op = 'UPDATE' and new.role_id = super_id and (old.role_id is distinct from new.role_id)) then
    select count(*) into current_count from stella.user_roles where role_id = super_id;
    if current_count >= 2 then
      raise exception 'Super Admin role is limited to the first two users.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists stella_user_roles_super_admin_guard on stella.user_roles;
create trigger stella_user_roles_super_admin_guard
before insert or update on stella.user_roles
for each row execute function stella.user_roles_super_admin_guard();
