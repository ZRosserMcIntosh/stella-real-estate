-- Check if user exists in auth.users
select id, email, email_confirmed_at, created_at, last_sign_in_at
from auth.users
where email = 'zrossermcintosh@gmail.com'
order by created_at desc;

-- Also check team_members
select id, full_name, email, role
from public.team_members
where email = 'zrossermcintosh@gmail.com';
