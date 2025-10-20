-- Keep listings (sale/rent) separate from projects: restrict listing_type and restore views

begin;

-- 1) Restrict allowed values on listing_type to only sale/rent
alter table public.listings drop constraint if exists listings_listing_type_check;
alter table public.listings add constraint listings_listing_type_check
  check (listing_type in ('for_sale','for_rent'));

-- 2) Recreate convenience views for sale/rent (now based on listing_type)
create or replace view public.listings_for_sale as
  select * from public.listings where listing_type = 'for_sale';

create or replace view public.listings_for_rent as
  select * from public.listings where listing_type = 'for_rent';

commit;
