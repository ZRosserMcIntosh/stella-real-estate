begin;

create table if not exists public.social_analytics (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.social_posts(id) on delete cascade,
  platform text not null check (platform in ('instagram','facebook','linkedin','x','tiktok','youtube','threads','pinterest','bluesky','mastodon','google_business')),
  platform_post_id text,
  impressions int not null default 0,
  engagement int not null default 0,
  shares int not null default 0,
  comments int not null default 0,
  likes int not null default 0,
  fetched_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists social_analytics_post_id_idx on public.social_analytics (post_id);
create index if not exists social_analytics_platform_idx on public.social_analytics (platform);

alter table public.social_analytics enable row level security;

drop policy if exists social_analytics_read on public.social_analytics;
create policy social_analytics_read on public.social_analytics
  for select using (public.is_staff() or public.is_marketing());

drop policy if exists social_analytics_manage on public.social_analytics;
create policy social_analytics_manage on public.social_analytics
  for all using (public.is_marketing())
  with check (public.is_marketing());

commit;
