-- Add neighborhood to listings for Brazilian addresses

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings' and column_name='neighborhood'
  ) then
    alter table public.listings add column neighborhood text;
  end if;
end$$;

create index if not exists idx_listings_neighborhood on public.listings (neighborhood);
