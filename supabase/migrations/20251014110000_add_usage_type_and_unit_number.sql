-- Add unit number and usage/type classification to listings

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings' and column_name='unit_number'
  ) then
    alter table public.listings add column unit_number text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings' and column_name='property_usage'
  ) then
    alter table public.listings add column property_usage text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings' and column_name='property_type'
  ) then
    alter table public.listings add column property_type text;
  end if;
end$$;

-- Constraints: usage limited to residential/commercial
alter table public.listings drop constraint if exists listings_property_usage_check;
alter table public.listings add constraint listings_property_usage_check
  check (property_usage in ('residential','commercial'));

-- Constraints: property_type limited to supported set
alter table public.listings drop constraint if exists listings_property_type_check;
alter table public.listings add constraint listings_property_type_check
  check (property_type is null or property_type in (
    -- residential
    'apartment','penthouse','studio','kitnet','house','loft','land_lot','farm_ranch',
    -- commercial
    'office','retail','casa_comercial','hotel','motel','entire_floor','entire_building','garage','land_commercial','storage_facility','factory','warehouse','shopping_mall'
  ));

-- Defaults: usage defaults to residential
alter table public.listings alter column property_usage set default 'residential';
