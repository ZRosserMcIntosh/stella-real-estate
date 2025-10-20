-- Add postal_code (CEP) to listings

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'listings' and column_name = 'postal_code'
  ) then
    alter table public.listings add column postal_code text;
  end if;
end$$;

-- Optional: quick index for filtering by city/state and postal_code
create index if not exists idx_listings_city on public.listings (city);
create index if not exists idx_listings_state on public.listings (state_code);
create index if not exists idx_listings_postal_code on public.listings (postal_code);
