-- Allow 'new_project' as a valid listing_type
begin;

-- Replace restrictive check constraint to include new_project
alter table public.listings drop constraint if exists listings_listing_type_check;
alter table public.listings add constraint listings_listing_type_check
  check (listing_type in ('new_project','for_sale','for_rent'));

commit;
