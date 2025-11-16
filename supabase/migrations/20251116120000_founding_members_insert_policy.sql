-- Add INSERT policy for founding_members to allow user creation during signup
-- Users need to be able to insert their own record even when not authenticated yet

drop policy if exists founding_user_insert on public.founding_members;

-- Allow authenticated users to insert their own founding_member record
create policy founding_user_insert on public.founding_members
  for insert 
  with check (auth.uid() = user_id);

-- Also add policy to allow service role (used by webhooks) to update payment status
drop policy if exists founding_service_update on public.founding_members;

create policy founding_service_update on public.founding_members
  for update
  using (true);  -- Service role bypasses RLS anyway, but explicit policy is cleaner
