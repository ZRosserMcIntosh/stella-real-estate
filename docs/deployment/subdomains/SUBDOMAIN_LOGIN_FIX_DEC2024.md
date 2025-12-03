# Subdomain Login Session Fix - December 3, 2024

## Problem
When logging in at `https://www.stellareal.com.br/sub/constellation/login`, the authentication succeeded but immediately redirected to `https://constellation.stellareal.com.br/admin/login` instead of the dashboard.

## Root Causes

### Issue 1: localStorage Isolation Between Domains
The issue was caused by localStorage isolation between domains:

1. User visits `https://www.stellareal.com.br/sub/constellation/login`
2. Login form renders on the **main domain** (`www.stellareal.com.br`)
3. User enters credentials and authenticates successfully
4. Supabase session is stored in localStorage with key `stella-supabase-auth` on `www.stellareal.com.br`
5. After login, user is redirected to `https://constellation.stellareal.com.br/admin`
6. **Problem:** `constellation.stellareal.com.br` has a **separate localStorage** from `www.stellareal.com.br`
7. AdminLayout component checks for session, finds none (because localStorage is empty on subdomain)
8. User is redirected to `/admin/login` → creates an infinite loop

### Why localStorage Doesn't Share Between Subdomains

LocalStorage is bound to the **origin** (protocol + domain + port). Different subdomains have different origins:
- `www.stellareal.com.br` → One localStorage
- `constellation.stellareal.com.br` → Separate localStorage
- `stellareal.com.br` → Yet another localStorage

This is a browser security feature and cannot be bypassed.

### Issue 2: Duplicate `/login` Route Conflict

The application had **two** `/login` routes defined:

1. Line 176: `{ path: '/login', element: <ConstellationLogin /> }` - For constellation subdomain  
2. Line 204: `{ path: '/login', element: <Navigate to="/admin/login" replace /> }` - For main domain

The second route was **overriding** the first one! When users visited `constellation.stellareal.com.br/login`, React Router was matching the route at line 204, which immediately redirected to `/admin/login`.

This meant that even after fixing the subdomain redirect, the constellation login page was still inaccessible because the route was redirecting to admin login.

## Solution

### Part 1: Redirect `/sub/*` Paths to Subdomain

Changed all `/sub/constellation/*` routes to immediately redirect to the actual subdomain instead of rendering the page on the main domain.

### Files Modified

**`/src/main.tsx`** - Updated constellation routes:

```tsx
// BEFORE: Rendered components on main domain
{ path: '/sub/constellation', element: <ConstellationPortal /> },
{ path: '/sub/constellation/login', element: <ConstellationLogin /> },
{ path: '/sub/constellation/signup', element: <ConstellationSignup /> },
{ path: '/sub/constellation/reset', element: <ConstellationReset /> },
{ path: '/sub/constellation/admin', element: <ConstellationDashboard /> },
{ path: '/sub/constellation/dashboard', element: <Navigate to="/sub/constellation/admin" replace /> },
{ path: '/sub/constellation/visuals', element: <ConstellationVisuals /> },
{ path: '/sub/constellation/site-builder', element: <ConstellationSiteBuilder /> },

// AFTER: Redirect to subdomain immediately
{ path: '/sub/constellation', element: <SubdomainRedirect /> },
{ path: '/sub/constellation/login', element: <SubdomainRedirect /> },
{ path: '/sub/constellation/signup', element: <SubdomainRedirect /> },
{ path: '/sub/constellation/reset', element: <SubdomainRedirect /> },
{ path: '/sub/constellation/admin', element: <SubdomainRedirect /> },
{ path: '/sub/constellation/dashboard', element: <SubdomainRedirect /> },
{ path: '/sub/constellation/visuals', element: <SubdomainRedirect /> },
{ path: '/sub/constellation/site-builder', element: <SubdomainRedirect /> },
```

Added import:
```tsx
import { SubdomainRedirect } from './components/SubdomainRedirect'
```

### Part 2: Make Routes Subdomain-Aware

Created conditional redirect components that detect the current subdomain and render the appropriate page:

**`/src/components/ConditionalLoginRedirect.tsx`** - New file:

```tsx
import { Navigate } from 'react-router-dom'
import { getSubdomain } from '../utils/subdomain'
import ConstellationLogin from '../pages/constellation/ConstellationLogin'

export default function ConditionalLoginRedirect() {
  const subdomain = getSubdomain()
  
  // If on constellation subdomain, show ConstellationLogin
  if (subdomain === 'constellation') {
    return <ConstellationLogin />
  }
  
  // Otherwise, redirect to admin login
  return <Navigate to="/admin/login" replace />
}
```

**`/src/components/ConditionalSignupRedirect.tsx`** - New file (same pattern for signup)

**`/src/components/ConditionalResetRedirect.tsx`** - New file (same pattern for password reset)

**Updated `/src/main.tsx`** routes:

```tsx
// BEFORE: Had duplicate conflicting routes
{ path: '/login', element: <ConstellationLogin /> },  // Line 176
// ... many routes later ...
{ path: '/login', element: <Navigate to="/admin/login" replace /> }, // Line 204 - CONFLICT!

// AFTER: Single subdomain-aware route
{ path: '/login', element: <ConditionalLoginRedirect /> },
{ path: '/signup', element: <ConditionalSignupRedirect /> },
{ path: '/reset', element: <ConditionalResetRedirect /> },
// Removed the duplicate redirect at line 204
```

Added imports:
```tsx
import ConditionalLoginRedirect from './components/ConditionalLoginRedirect'
import ConditionalSignupRedirect from './components/ConditionalSignupRedirect'
import ConditionalResetRedirect from './components/ConditionalResetRedirect'
```

### How It Works Now

1. User visits `https://www.stellareal.com.br/sub/constellation/login`
2. **Vercel redirect** (from `vercel.json`) redirects to `https://constellation.stellareal.com.br/login`
   - If Vercel redirect fails, the React route uses `<SubdomainRedirect />` as fallback
3. `SubdomainRedirect` component detects the `/sub/constellation/login` path (if still there)
4. Builds the subdomain URL: `https://constellation.stellareal.com.br/login`
5. Performs `window.location.href = subdomain_url` redirect
6. User arrives at `https://constellation.stellareal.com.br/login`
7. **ConditionalLoginRedirect** component detects subdomain = 'constellation'
8. Renders **ConstellationLogin** component (not redirected to /admin/login!)
9. User enters credentials and logs in
10. Session is stored in `constellation.stellareal.com.br` localStorage
11. Redirect to `/admin` works because session exists on the same domain
12. **ConstellationDashboard** renders (subdomain-specific admin panel)
13. ✅ User successfully accesses the dashboard

### On Main Domain

1. User visits `https://www.stellareal.com.br/login`
2. **ConditionalLoginRedirect** detects no subdomain (or subdomain ≠ 'constellation')
3. Redirects to `/admin/login`
4. Standard Stella admin login page renders
5. ✅ Works as expected for main site

## Benefits

✅ No more session loss on cross-domain redirects  
✅ No more route conflicts between subdomain and main domain  
✅ Users can log in successfully from `/sub/*` paths  
✅ Constellation login works on `constellation.stellareal.com.br/login`  
✅ Main domain login still works on `www.stellareal.com.br/admin/login`  
✅ Single `/login` route that adapts based on subdomain  
✅ Consistent behavior across all constellation routes  
✅ Vercel redirects work as expected  
✅ Fallback to client-side redirect if Vercel redirect fails  

## Files Created

- `/src/components/ConditionalLoginRedirect.tsx` - Subdomain-aware login routing
- `/src/components/ConditionalSignupRedirect.tsx` - Subdomain-aware signup routing  
- `/src/components/ConditionalResetRedirect.tsx` - Subdomain-aware password reset routing

## Files Modified

- `/src/main.tsx` - Updated routing to use conditional redirects, removed duplicate `/login` route

## Testing

### Test Login Flow
1. Visit: `https://www.stellareal.com.br/sub/constellation/login`
2. Should redirect to: `https://constellation.stellareal.com.br/login`
3. Enter credentials and log in
4. Should redirect to: `https://constellation.stellareal.com.br/admin`
5. Should see dashboard (not redirected back to login)

### Test Other Paths
1. Visit: `https://www.stellareal.com.br/sub/constellation/signup`
   - Should redirect to: `https://constellation.stellareal.com.br/signup`

2. Visit: `https://www.stellareal.com.br/sub/constellation`
   - Should redirect to: `https://constellation.stellareal.com.br/`

3. Visit: `https://www.stellareal.com.br/sub/constellation/admin`
   - Should redirect to: `https://constellation.stellareal.com.br/admin`

## Benefits

✅ No more session loss on cross-domain redirects  
✅ No more route conflicts between subdomain and main domain  
✅ Users can log in successfully from `/sub/*` paths  
✅ Constellation login works on `constellation.stellareal.com.br/login`  
✅ Main domain login still works on `www.stellareal.com.br/admin/login`  
✅ Single `/login` route that adapts based on subdomain  
✅ Consistent behavior across all constellation routes  
✅ Vercel redirects work as expected  
✅ Fallback to client-side redirect if Vercel redirect fails  

## Files Created

- `/src/components/ConditionalLoginRedirect.tsx` - Subdomain-aware login routing
- `/src/components/ConditionalSignupRedirect.tsx` - Subdomain-aware signup routing  
- `/src/components/ConditionalResetRedirect.tsx` - Subdomain-aware password reset routing

## Files Modified

- The `/sub/constellation/*` pattern is now only for **routing/redirecting**
- Actual page rendering happens on `constellation.stellareal.com.br`
- This pattern should be applied to any future subdomains (e.g., if you add `/sub/ballet/*`)
- The `ConstellationUrls` helper already generates correct cross-domain URLs
- Supabase session uses `localStorage` which is origin-specific

## Related Files

- `/src/components/SubdomainRedirect.tsx` - Handles client-side subdomain redirects
- `/src/utils/subdomain.ts` - Subdomain detection utilities
- `/src/utils/constellationUrl.ts` - Constellation URL generation helpers
- `/vercel.json` - Server-side Vercel redirects configuration
- `/src/lib/supabaseClient.ts` - Supabase client with localStorage config

## See Also

- [SUBDOMAIN_REDIRECT_SUMMARY.md](./SUBDOMAIN_REDIRECT_SUMMARY.md) - Original subdomain implementation
- [SUBDOMAIN_ARCHITECTURE.md](../../SUBDOMAIN_ARCHITECTURE.md) - Full subdomain architecture
