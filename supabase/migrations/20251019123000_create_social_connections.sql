begin;

create table if not exists public.social_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  provider text not null check (provider in ('instagram','facebook','linkedin','x','tiktok','youtube','threads','pinterest','bluesky','mastodon','google_business')),
  status text not null default 'connected' check (status in ('connected','pending','error')),
  connected_at timestamptz default now(),
  auth_metadata jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

create unique index if not exists social_connections_user_provider_idx on public.social_connections (user_id, provider);

alter table public.social_connections enable row level security;

drop policy if exists social_connections_self on public.social_connections;
create policy social_connections_self on public.social_connections
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

commit;

