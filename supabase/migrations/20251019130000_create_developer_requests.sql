-- Create developer request tracking tables
create table if not exists developer_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  details text not null,
  category text not null check (category in ('feature', 'bug', 'integration', 'content', 'other')),
  priority text not null check (priority in ('p0', 'p1', 'p2', 'p3')),
  status text not null default 'pending' check (status in ('pending', 'completed', 'rejected')),
  attachments jsonb,
  submitted_by uuid references auth.users(id) on delete set null,
  submitted_name text,
  submitted_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists developer_request_comments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references developer_requests(id) on delete cascade,
  comment text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_name text,
  created_email text,
  created_at timestamptz not null default now()
);

create table if not exists developer_request_reactions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references developer_requests(id) on delete cascade,
  reaction text not null check (reaction in ('like', 'dislike')),
  created_by uuid references auth.users(id) on delete cascade,
  created_name text,
  created_email text,
  created_at timestamptz not null default now(),
  unique (request_id, created_by)
);

-- Trigger to update updated_at column
create or replace function developer_requests_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on developer_requests;
create trigger set_updated_at
before update on developer_requests
for each row execute function developer_requests_set_updated_at();

-- Enable row level security
alter table developer_requests enable row level security;
alter table developer_request_comments enable row level security;
alter table developer_request_reactions enable row level security;

-- Policies
create policy "Authenticated can view developer requests"
  on developer_requests
  for select
  using (auth.role() = 'authenticated');

create policy "Authenticated can insert developer requests"
  on developer_requests
  for insert
  with check (auth.role() = 'authenticated' and (submitted_by is null or submitted_by = auth.uid()));

create policy "Authenticated can update developer requests"
  on developer_requests
  for update
  using (auth.role() = 'authenticated');

create policy "Authenticated can view developer request comments"
  on developer_request_comments
  for select
  using (auth.role() = 'authenticated');

create policy "Authenticated can insert developer request comments"
  on developer_request_comments
  for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated can view developer request reactions"
  on developer_request_reactions
  for select
  using (auth.role() = 'authenticated');

create policy "Authenticated can manage their developer request reactions"
  on developer_request_reactions
  for all
  using (auth.role() = 'authenticated' and created_by = auth.uid())
  with check (auth.role() = 'authenticated' and created_by = auth.uid());
