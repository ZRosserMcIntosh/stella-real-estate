begin;

-- Helper to allow marketing + leadership to manage social queue
create or replace function public.is_marketing(u uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.team_members
    where user_id = u
      and role in ('marketing','owner','admin','exec')
  );
$$;

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  platforms text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','scheduled','queued','published','failed')),
  scheduled_at timestamptz,
  posted_at timestamptz,
  timezone text default 'UTC',
  media_urls text[] not null default '{}',
  campaign text,
  notes text,
  approval_required boolean not null default false,
  approval_status text default 'approved' check (approval_status in ('pending','approved','rejected')),
  failure_reason text,
  created_by uuid references auth.users(id) on delete set null,
  owner_id uuid references public.team_members(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.social_posts
  add constraint social_posts_platforms_allowed
  check (
    platforms <@ ARRAY['instagram','facebook','linkedin','x','tiktok','youtube','threads']::text[]
    and coalesce(array_length(platforms, 1), 0) > 0
  );

create index if not exists social_posts_scheduled_at_idx on public.social_posts (scheduled_at);

alter table public.social_posts enable row level security;

drop policy if exists social_posts_read on public.social_posts;
create policy social_posts_read on public.social_posts
  for select using (public.is_staff() or public.is_marketing());

drop policy if exists social_posts_manage on public.social_posts;
create policy social_posts_manage on public.social_posts
  for all using (public.is_marketing())
  with check (public.is_marketing());

commit;

