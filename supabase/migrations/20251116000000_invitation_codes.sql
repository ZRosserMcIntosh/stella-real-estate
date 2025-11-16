-- Invitation codes for team member registration
-- Format: XXXX-XXXX-XXXX-XXXX (16 digits)

create table if not exists public.invitation_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  email text not null,
  full_name text,
  role text check (role in ('owner','admin','exec','manager','agent','ops','marketing','legal','accounting','contractor','viewer')) default 'viewer',
  department text,
  status text check (status in ('pending','used','expired','cancelled')) not null default 'pending',
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '30 days'),
  used_at timestamptz,
  used_by uuid references auth.users(id),
  constraint valid_code_format check (code ~ '^\d{4}-\d{4}-\d{4}-\d{4}$')
);

alter table public.invitation_codes enable row level security;

-- Only admins can view/manage invitation codes
drop policy if exists invitation_codes_admin_select on public.invitation_codes;
create policy invitation_codes_admin_select on public.invitation_codes
  for select using (
    exists (
      select 1 from public.team_members me
      where me.user_id = auth.uid()
        and me.role in ('owner','admin','exec')
    )
  );

drop policy if exists invitation_codes_admin_insert on public.invitation_codes;
create policy invitation_codes_admin_insert on public.invitation_codes
  for insert with check (
    exists (
      select 1 from public.team_members me
      where me.user_id = auth.uid()
        and me.role in ('owner','admin','exec')
    )
  );

drop policy if exists invitation_codes_admin_update on public.invitation_codes;
create policy invitation_codes_admin_update on public.invitation_codes
  for update using (
    exists (
      select 1 from public.team_members me
      where me.user_id = auth.uid()
        and me.role in ('owner','admin','exec')
    )
  );

-- Function to generate a unique invitation code
create or replace function public.generate_invitation_code()
returns text
language plpgsql
security definer
as $$
declare
  new_code text;
  code_exists boolean;
begin
  loop
    -- Generate 16 random digits in XXXX-XXXX-XXXX-XXXX format
    new_code := 
      lpad(floor(random() * 10000)::text, 4, '0') || '-' ||
      lpad(floor(random() * 10000)::text, 4, '0') || '-' ||
      lpad(floor(random() * 10000)::text, 4, '0') || '-' ||
      lpad(floor(random() * 10000)::text, 4, '0');
    
    -- Check if code already exists
    select exists(select 1 from public.invitation_codes where code = new_code) into code_exists;
    
    -- Exit loop if unique
    exit when not code_exists;
  end loop;
  
  return new_code;
end;
$$;

-- Function to validate and use an invitation code
create or replace function public.validate_invitation_code(
  p_code text,
  p_email text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  invitation record;
  result jsonb;
begin
  -- Find the invitation code
  select * into invitation
  from public.invitation_codes
  where code = p_code
    and status = 'pending'
    and (expires_at is null or expires_at > now())
    and lower(email) = lower(p_email);
  
  if not found then
    return jsonb_build_object(
      'valid', false,
      'error', 'Invalid or expired invitation code'
    );
  end if;
  
  -- Return invitation details
  return jsonb_build_object(
    'valid', true,
    'id', invitation.id,
    'email', invitation.email,
    'full_name', invitation.full_name,
    'role', invitation.role,
    'department', invitation.department
  );
end;
$$;

-- Function to mark invitation as used
create or replace function public.use_invitation_code(
  p_code text,
  p_user_id uuid
)
returns void
language plpgsql
security definer
as $$
begin
  update public.invitation_codes
  set 
    status = 'used',
    used_at = now(),
    used_by = p_user_id
  where code = p_code
    and status = 'pending';
end;
$$;

-- Create index for faster lookups
create index if not exists idx_invitation_codes_code on public.invitation_codes(code);
create index if not exists idx_invitation_codes_email on public.invitation_codes(lower(email));
create index if not exists idx_invitation_codes_status on public.invitation_codes(status);

-- Add comment
comment on table public.invitation_codes is 'Invitation codes for new team member registration';
