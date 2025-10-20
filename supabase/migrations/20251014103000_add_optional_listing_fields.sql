-- Optional listing fields: unit floor, land area, condominium fee

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings' and column_name='unit_floor'
  ) then
    alter table public.listings add column unit_floor int;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings' and column_name='land_area_m2'
  ) then
    alter table public.listings add column land_area_m2 numeric;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings' and column_name='condo_fee'
  ) then
    alter table public.listings add column condo_fee numeric(14,2);
  end if;
end$$;
