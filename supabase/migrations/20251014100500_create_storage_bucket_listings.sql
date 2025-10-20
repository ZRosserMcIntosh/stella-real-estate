-- Create storage bucket for listing images (thumbnail + gallery)

-- 1) Ensure bucket exists and is public
insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do update set public = excluded.public;

-- 2) RLS policies for storage.objects (bucket: listings)
-- Enable if not already enabled (Supabase enables by default)
-- alter table storage.objects enable row level security;

-- Public read of images in this bucket
drop policy if exists "Public read for listings bucket" on storage.objects;
create policy "Public read for listings bucket" on storage.objects
  for select using (bucket_id = 'listings');

-- Authenticated users can upload to the listings bucket
drop policy if exists "Authenticated upload to listings bucket" on storage.objects;
create policy "Authenticated upload to listings bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'listings');

-- Optional: allow authenticated to update/delete their own objects (by owner)
-- Requires setting metadata.owner = auth.uid() on upload via signed URLs or a server function.
-- Here we keep it minimal: no update/delete policy to avoid accidental overwrites.
