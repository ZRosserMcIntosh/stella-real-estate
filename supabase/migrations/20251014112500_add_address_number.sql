-- Add address_number to listings to store street number separately

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings' and column_name='address_number'
  ) then
    alter table public.listings add column address_number text;
  end if;
end$$;
