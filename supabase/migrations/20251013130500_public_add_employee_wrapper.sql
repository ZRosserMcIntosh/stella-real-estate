-- Expose a PostgREST-friendly wrapper so the app can call rpc('add_employee', ...)
create schema if not exists public;

create or replace function public.add_employee(
  p_email text,
  p_full_name text,
  p_position_title text default null,
  p_department text default null,
  p_city text default null,
  p_employment_type text default 'CLT',
  p_status text default 'active'
)
returns stella.employees
language sql
security definer
set search_path = public, auth, stella
as $$
  select * from stella.add_employee(p_email, p_full_name, p_position_title, p_department, p_city, p_employment_type, p_status);
$$;

comment on function public.add_employee(text, text, text, text, text, text, text)
  is 'Upsert an employee row linked to auth.users by email. Requires caller to be admin (enforced inside stella.add_employee via RLS bypass with security definer).';
