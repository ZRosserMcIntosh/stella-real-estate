-- Subscriptions and Founding Members Migration
-- Add subscription management and founding member tracking

-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null check (plan_id in ('FREE', 'SOLO', 'TEAM', 'BROKERAGE', 'ENTERPRISE', 'FOUNDING_100')),
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')) default 'active',
  stripe_subscription_id text unique,
  stripe_customer_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  canceled_at timestamptz,
  trial_end timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create founding members table
create table if not exists public.founding_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  member_number int unique check (member_number between 1 and 100),
  email text not null,
  phone text,
  full_name text not null,
  cpf text not null,
  account_type text not null check (account_type in ('individual', 'company')) default 'individual',
  company_name text,
  cnpj text,
  number_of_partners int,
  creci_number text not null,
  creci_uf text not null check (creci_uf in ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')),
  payment_amount numeric(10,2) not null default 2970.00,
  payment_status text not null check (payment_status in ('pending', 'paid', 'refunded')) default 'pending',
  stripe_payment_intent_id text unique,
  stripe_customer_id text,
  discount_percentage int not null default 75,
  benefits_active boolean default false,
  benefits jsonb default '{"team_plan_months": 24, "founding_badge": true, "early_access": true, "priority_support": true}'::jsonb,
  claimed_at timestamptz default now(),
  payment_completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Add unique constraint for CRECI
  constraint unique_creci unique (creci_number, creci_uf)
);

-- Add CRECI and professional info to user profiles
-- Check if we need to extend existing tables or create a new one
create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  user_type text check (user_type in ('realtor', 'company', 'individual')) default 'individual',
  creci_number text,
  creci_uf text check (creci_uf in ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')),
  creci_type text check (creci_type in ('individual', 'corporate')) default 'individual',
  creci_status text check (creci_status in ('pending', 'verified', 'rejected')) default 'pending',
  creci_verified_at timestamptz,
  phone text,
  city text,
  state_code text,
  onboarding_completed boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.subscriptions enable row level security;
alter table public.founding_members enable row level security;
alter table public.user_profiles enable row level security;

-- RLS Policies for subscriptions
drop policy if exists subscriptions_user_read on public.subscriptions;
create policy subscriptions_user_read on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists subscriptions_user_update on public.subscriptions;
create policy subscriptions_user_update on public.subscriptions
  for update using (auth.uid() = user_id);

-- RLS Policies for founding_members
drop policy if exists founding_user_read on public.founding_members;
create policy founding_user_read on public.founding_members
  for select using (auth.uid() = user_id);

-- RLS Policies for user_profiles
drop policy if exists profiles_user_all on public.user_profiles;
create policy profiles_user_all on public.user_profiles
  for all using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_founding_user_id on public.founding_members(user_id);
create index if not exists idx_founding_member_number on public.founding_members(member_number);
create index if not exists idx_user_profiles_user_id on public.user_profiles(user_id);
create index if not exists idx_user_profiles_creci on public.user_profiles(creci_number, creci_uf);

-- Trigger to update updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.update_updated_at_column();

drop trigger if exists founding_members_updated_at on public.founding_members;
create trigger founding_members_updated_at
  before update on public.founding_members
  for each row execute function public.update_updated_at_column();

drop trigger if exists user_profiles_updated_at on public.user_profiles;
create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.update_updated_at_column();

-- Helper function to get available founding slots
create or replace function public.get_founding_slots_remaining()
returns int
language sql
security definer
as $$
  select 100 - count(*)::int from public.founding_members where payment_status = 'completed';
$$;

-- Helper function to reserve next founding slot
create or replace function public.reserve_founding_slot(p_user_id uuid)
returns int
language plpgsql
security definer
as $$
declare
  v_next_number int;
  v_remaining int;
begin
  -- Check slots remaining
  select public.get_founding_slots_remaining() into v_remaining;
  if v_remaining <= 0 then
    raise exception 'No founding slots remaining';
  end if;

  -- Check if user already has a slot
  if exists (select 1 from public.founding_members where user_id = p_user_id) then
    raise exception 'User already has a founding slot';
  end if;

  -- Get next available number
  select coalesce(max(member_number), 0) + 1
  into v_next_number
  from public.founding_members;

  -- Insert new founding member
  insert into public.founding_members (user_id, member_number, payment_status)
  values (p_user_id, v_next_number, 'pending');

  return v_next_number;
end;
$$;
