-- Add parking_spaces to listings

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings' and column_name='parking_spaces'
  ) then
    alter table public.listings add column parking_spaces int;
  end if;
end$$;
