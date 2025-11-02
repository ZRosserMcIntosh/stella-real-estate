begin;

-- Store encrypted OAuth tokens for social media platforms
create table if not exists public.social_account_tokens (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.social_connections(id) on delete cascade,
  access_token text not null,
  refresh_token text,
  token_expires_at timestamptz,
  account_handle text not null,
  display_name text,
  profile_image_url text,
  platform_account_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists social_account_tokens_connection_id_idx on public.social_account_tokens (connection_id);

alter table public.social_account_tokens enable row level security;

drop policy if exists social_account_tokens_read on public.social_account_tokens;
create policy social_account_tokens_read on public.social_account_tokens
  for select using (public.is_staff() or public.is_marketing());

drop policy if exists social_account_tokens_manage on public.social_account_tokens;
create policy social_account_tokens_manage on public.social_account_tokens
  for all using (public.is_marketing())
  with check (public.is_marketing());

commit;
