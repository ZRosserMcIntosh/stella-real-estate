-- Check if user exists in auth.users
SELECT 
  id, 
  email, 
  created_at, 
  email_confirmed_at,
  confirmed_at,
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'rosserembrasil@gmail.com';

-- Check if there's a user with similar email (typo check)
SELECT 
  id, 
  email
FROM auth.users 
WHERE email ILIKE '%rosser%' OR email ILIKE '%brasil%';

-- Check all users (to see if account exists at all)
SELECT 
  id, 
  email,
  email_confirmed_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;
