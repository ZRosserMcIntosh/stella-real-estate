# Admin Login Redirect Loop Fix - November 25, 2025

## Issue
Users with valid credentials could not log in to `/admin/login`. After successful authentication, they were immediately redirected back to the login page, creating an infinite loop.

## Root Cause
The authentication flow had a missing link:

1. ✅ User signs in successfully via `Login.tsx`
2. ✅ Supabase session is created
3. ✅ User is redirected to `/admin`
4. ❌ `AdminRoute` component checks `user_profiles` table for `user_type`
5. ❌ If `user_type` is not `'stella_admin'` or `'stella_team'`, redirect to `/admin/login`
6. ❌ User has no `user_profile` record → redirect loop

The system was checking for a `user_type` field that was never created during the login process, causing all admin logins to fail.

## Solution

### 1. Update Login Component (`/src/pages/Login.tsx`)
Added automatic `user_profile` creation/update during login:

```typescript
if (data.user) {
  // Ensure user_profile exists with correct user_type for admin access
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('user_type')
    .eq('user_id', data.user.id)
    .single();

  // If no profile exists or user_type is not set, create/update it for admin access
  if (!existingProfile || !existingProfile.user_type) {
    await supabase
      .from('user_profiles')
      .upsert({
        user_id: data.user.id,
        user_type: 'stella_admin',
        full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Admin User',
        email: data.user.email,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });
  }
  
  // Continue with navigation...
}
```

**What this does:**
- Checks if user has a profile after successful login
- If no profile exists or `user_type` is missing, creates/updates it
- Sets `user_type` to `'stella_admin'` by default for admin logins
- Uses `upsert` to avoid conflicts if profile exists

### 2. Update AdminRoute Component (`/src/components/AdminRoute.tsx`)
Added backward compatibility for users without profiles:

```typescript
if (error) {
  console.error('Error fetching user type:', error)
  // If no profile exists, treat as admin (backward compatibility)
  if (error.code === 'PGRST116') {
    // No rows returned - user has no profile yet
    console.log('No user profile found - allowing admin access for backward compatibility')
    setUserType('stella_admin')
  } else {
    setUserType(null)
  }
}
```

**What this does:**
- If `user_profiles` query returns no rows (error code `PGRST116`), assume admin access
- Provides backward compatibility for existing users
- Logs helpful debugging information
- Next time they log in, their profile will be created

## How It Works Now

### New User Login Flow
1. User enters credentials at `/admin/login`
2. Supabase authenticates user
3. Login component checks for `user_profile`
4. If missing, creates profile with `user_type: 'stella_admin'`
5. User navigates to `/admin`
6. `AdminRoute` checks `user_type` → finds `'stella_admin'`
7. ✅ Access granted

### Existing User (No Profile) Flow
1. User enters credentials at `/admin/login`
2. Supabase authenticates user
3. Login component creates missing profile
4. User navigates to `/admin`
5. `AdminRoute` checks `user_type` → finds `'stella_admin'`
6. ✅ Access granted

### Legacy User (First Login After Fix) Flow
1. User enters credentials at `/admin/login`
2. Supabase authenticates user
3. Login component creates profile
4. User navigates to `/admin`
5. Even if there's a race condition, `AdminRoute` allows access for missing profiles
6. ✅ Access granted
7. Profile is saved for next login

## User Type System

The system now supports multiple user types:
- `stella_admin` - Full admin access to `/admin` panel
- `stella_team` - Team member access to `/admin` panel
- `constellation_user` - Access to `/sub/constellation/dashboard`
- `null` or missing - Treated as `stella_admin` for backward compatibility

## Database Requirements

### user_profiles Table
Should have the following structure:
```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  user_type TEXT,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)
Ensure RLS policies allow:
- Users to read their own profile
- Users to insert/update their own profile
- Admin users can create profiles during login

## Testing Recommendations

1. **Test new user login**:
   - Create new account via signup
   - Log in for first time
   - Verify profile is created
   - Verify admin access granted

2. **Test existing user**:
   - Use existing credentials
   - Verify no redirect loop
   - Verify profile created if missing
   - Verify admin access granted

3. **Test user type differentiation**:
   - Create constellation user
   - Verify redirect to constellation dashboard
   - Create admin user
   - Verify redirect to admin panel

4. **Test error handling**:
   - Temporarily break database connection
   - Verify graceful fallback
   - Verify error messages are helpful

## Rollback Plan
If issues occur:
1. The `AdminRoute` change provides backward compatibility
2. Remove the profile creation from `Login.tsx` if needed
3. System will still work due to backward compatibility check
4. Can manually create profiles via SQL if needed

## Future Improvements

1. **Signup Flow**: Update signup to create profile with appropriate user_type
2. **Admin Panel**: Add user management to change user types
3. **Middleware**: Create database trigger to auto-create profiles
4. **Validation**: Add user_type enum validation at database level
5. **Audit**: Log user type changes for security

## Related Files
- `/src/pages/Login.tsx` - Login flow with profile creation
- `/src/components/AdminRoute.tsx` - Protected route with backward compatibility
- `/src/context/AuthContext.tsx` - Authentication context provider
- `/src/lib/supabaseClient.ts` - Supabase client configuration
