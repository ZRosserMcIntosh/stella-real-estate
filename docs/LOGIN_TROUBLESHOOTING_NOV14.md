# Login Troubleshooting - November 14, 2025

## Issue
User `rosserembrasil@gmail.com` getting "Invalid login credentials" error on live site.

## What We Know
- ✅ Demo mode works (DEMO + stella) - proves auth system is functional
- ✅ Supabase connection is working
- ✅ Login page is correct (`/login`)
- ❌ User credentials not working

## Most Likely Causes

### 1. Account Doesn't Exist Yet ⭐ MOST LIKELY
The account may never have been created in Supabase auth.users table.

**Solution:** Use the signup flow to create the account:
1. Go to https://stella-real-estate.vercel.app/login
2. Click "Create Account" (toggle button at top)
3. Enter: `rosserembrasil@gmail.com` + password
4. If email confirmation is enabled, check your email
5. Confirm email, then sign in

### 2. Email Not Confirmed
Account exists but email was never confirmed (if email confirmation is enabled).

**Solution A - Disable Email Confirmation (Fastest):**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/fxvxdvwiqgpypcqmljja/auth/providers
2. Click "Email" provider
3. Toggle OFF "Confirm email"
4. Save
5. Try logging in again

**Solution B - Manually Confirm User:**
1. Go to: https://supabase.com/dashboard/project/fxvxdvwiqgpypcqmljja/auth/users
2. Find user `rosserembrasil@gmail.com`
3. Click the user
4. Click "Confirm User" button
5. Try logging in again

**Solution C - Resend Confirmation:**
1. Use the signup flow to resend confirmation email
2. Check spam folder
3. Click confirmation link

### 3. Wrong Password
You're entering the wrong password.

**Solution:** Use forgot password flow:
1. Go to https://stella-real-estate.vercel.app/forgot-password
2. Enter: `rosserembrasil@gmail.com`
3. Check email for reset link
4. Set new password
5. Sign in with new password

### 4. Account Created Without Password
Account may have been created through an invite or other flow without setting a password.

**Solution:** Use forgot password flow (same as #3)

## Diagnostic Steps

### Step 1: Check if Account Exists
Run this SQL in Supabase Dashboard SQL Editor:
```sql
-- Check if user exists
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'rosserembrasil@gmail.com';
```

**Interpreting Results:**
- **No rows returned:** Account doesn't exist → Use signup flow
- **email_confirmed_at is NULL:** Email not confirmed → Confirm email or disable confirmation
- **email_confirmed_at has date:** Account confirmed → Wrong password, use forgot password

### Step 2: Check Auth Settings
1. Go to: https://supabase.com/dashboard/project/fxvxdvwiqgpypcqmljja/auth/providers
2. Check "Email" provider settings:
   - Is "Enable Email provider" ON?
   - Is "Confirm email" ON or OFF?

### Step 3: Try Different Approaches
1. **Try signup first** (even if you think you have an account)
   - If account exists, it will tell you
   - If it doesn't exist, it will create it

2. **Try forgot password**
   - This works whether password is wrong or never set

3. **Check browser console**
   - Open Dev Tools (F12)
   - Go to Console tab
   - Try logging in
   - Look for error messages

## Quick Fix Recommendations

### Recommended Order:
1. **First, try signup:** Go to `/login`, click "Create Account", try to create account with your email
   - If it says "User already exists" → Account exists, wrong password
   - If it succeeds → Account created, might need to confirm email

2. **If signup says user exists, use forgot password:** Go to `/forgot-password`
   - This will let you set a new password

3. **If still not working, check Supabase dashboard:**
   - Disable email confirmation OR manually confirm your user

## Files Created for Diagnostics
- `check_rosser_auth.sql` - SQL to check user account status
- `test_auth.mjs` - Script to test Supabase connection

## Next Actions
1. Try the signup flow first
2. If that doesn't work, try forgot password
3. If still stuck, check Supabase dashboard and confirm your email is verified
4. Report back what you see in the dashboard
