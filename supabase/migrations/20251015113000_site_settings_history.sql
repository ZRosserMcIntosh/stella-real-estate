-- Create a simple history table for site settings changes
create table if not exists public.site_settings_history (
  id bigserial primary key,
  key text not null,
  value text not null,
  used_at timestamptz not null default now()
);

-- RLS: enabled and restrict by role when applicable
alter table public.site_settings_history enable row level security;

-- Policies: allow admin-style roles to read/write; adjust to your auth roles mapping
create policy "site_settings_history_read"
  on public.site_settings_history
  for select
  to authenticated
  using (
    -- Replace with your role check. Example: function that returns true for admins
    coalesce((auth.jwt() ->> 'role') in ('admin','owner','super_admin'), false)
  );

create policy "site_settings_history_write"
  on public.site_settings_history
  for insert
  to authenticated
  with check (
    coalesce((auth.jwt() ->> 'role') in ('admin','owner','super_admin'), false)
  );

-- Optional index for faster queries by key/date
create index if not exists site_settings_history_key_used_at_idx on public.site_settings_history(key, used_at desc);
