-- Unify listings under a single table with a listing_type column and drop sale/rent views
-- Safe to run multiple times (guards included)

begin;

-- 1) Drop old convenience views (no longer needed)
drop view if exists public.listings_for_sale cascade;
drop view if exists public.listings_for_rent cascade;

-- 2) Add new listing_type column if missing
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'listings' and column_name = 'listing_type'
  ) then
    alter table public.listings add column listing_type text;
  end if;
end$$;

-- 3) Backfill listing_type from old kind values where possible
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'listings' and column_name = 'kind'
  ) then
    update public.listings
    set listing_type = case
      when kind = 'sale' then 'for_sale'
      when kind = 'rent' then 'for_rent'
      else 'for_sale'
    end
    where listing_type is null;
  else
    -- If kind column is already gone, just ensure listing_type has some default for existing nulls
    update public.listings
    set listing_type = coalesce(listing_type, 'for_sale')
    where listing_type is null;
  end if;
end$$;

-- 4) Ensure a check constraint exists for allowed values
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'listings_listing_type_check'
  ) then
    alter table public.listings
    add constraint listings_listing_type_check
    check (listing_type in ('new_project','for_sale','for_rent'));
  end if;
end$$;

-- 5) Set a default and not null
alter table public.listings alter column listing_type set default 'for_sale';
update public.listings set listing_type = 'for_sale' where listing_type is null;
alter table public.listings alter column listing_type set not null;

-- 6) Drop the old kind column if present
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'listings' and column_name = 'kind'
  ) then
    alter table public.listings drop column kind;
  end if;
end$$;

commit;
