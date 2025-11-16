-- Add INSERT policy for founding_members
-- Allow authenticated users to insert their own founding_member record during signup

drop policy if exists founding_user_insert on public.founding_members;

create policy founding_user_insert on public.founding_members
  for insert 
  with check (auth.uid() = user_id);

-- Add UPDATE policy for founding_members  
-- Allow users to update their own record (e.g., when payment status changes)
drop policy if exists founding_user_update on public.founding_members;

create policy founding_user_update on public.founding_members
  for update
  using (auth.uid() = user_id);
