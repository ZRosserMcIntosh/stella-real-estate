-- Allow super_admin/owner/admin to manage stella.employees and add a helper to upsert rows by email
create schema if not exists stella;

-- RLS policies for employees
alter table stella.employees enable row level security;

-- Select own record
drop policy if exists employees_self_select on stella.employees;
create policy employees_self_select on stella.employees
  for select using (auth.uid() = user_id);

-- Admins full access (owner/admin/super_admin)
drop policy if exists employees_admin_all on stella.employees;
create policy employees_admin_all on stella.employees
  for all
  using (
    exists (
      select 1
      from stella.user_roles ur
      join stella.roles r on r.id = ur.role_id
      where ur.user_id = auth.uid()
        and r.key in ('super_admin','owner','admin')
    )
  )
  with check (
    exists (
      select 1
      from stella.user_roles ur
      join stella.roles r on r.id = ur.role_id
      where ur.user_id = auth.uid()
        and r.key in ('super_admin','owner','admin')
    )
  );

-- Helper: upsert employee by email
create or replace function stella.add_employee(
  p_email text,
  p_full_name text,
  p_position_title text default null,
  p_department text default null,
  p_city text default null,
  p_employment_type text default 'CLT',
  p_status text default 'active'
)
returns stella.employees
language plpgsql
security definer
set search_path = public, auth, stella
as $$
declare
  v_user_id uuid;
  v_emp stella.employees;
begin
  select id into v_user_id from auth.users where email ilike p_email limit 1;
  if v_user_id is null then
    raise exception 'No auth.users row found for email: %', p_email;
  end if;

  insert into stella.employees (
    user_id, full_name, email, position_title, department, city, employment_type, status
  ) values (
    v_user_id, p_full_name, p_email, p_position_title, p_department, p_city, p_employment_type, p_status
  )
  on conflict (email) do update set
    user_id = excluded.user_id,
    full_name = excluded.full_name,
    position_title = coalesce(excluded.position_title, stella.employees.position_title),
    department = coalesce(excluded.department, stella.employees.department),
    city = coalesce(excluded.city, stella.employees.city),
    employment_type = excluded.employment_type,
    status = excluded.status,
    updated_at = now()
  returning * into v_emp;

  return v_emp;
end;
$$;

-- Convenience: ensure function owner is postgres (bypasses RLS during execution)
-- (Supabase dashboard runs as postgres; migrations also default to postgres.)
