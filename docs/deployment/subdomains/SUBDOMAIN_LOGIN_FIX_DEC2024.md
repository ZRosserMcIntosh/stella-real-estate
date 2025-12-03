# Subdomain Login Session Fix - December 3, 2024

## Problem
When logging in at `https://www.stellareal.com.br/sub/constellation/login`, the authentication succeeded but immediately redirected to `https://constellation.stellareal.com.br/admin/login` instead of the dashboard.

## Root Cause
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

## Solution

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

### How It Works Now

1. User visits `https://www.stellareal.com.br/sub/constellation/login`
2. **Vercel redirect** (from `vercel.json`) redirects to `https://constellation.stellareal.com.br/login`
   - If Vercel redirect fails, the React route uses `<SubdomainRedirect />` as fallback
3. `SubdomainRedirect` component detects the `/sub/constellation/login` path
4. Builds the subdomain URL: `https://constellation.stellareal.com.br/login`
5. Performs `window.location.href = subdomain_url` redirect
6. User is now on the subdomain where login form renders
7. After successful login, session is stored in `constellation.stellareal.com.br` localStorage
8. Redirect to `/admin` works because session exists on the same domain
9. ✅ User successfully accesses the dashboard

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
✅ Users can log in successfully from `/sub/*` paths
✅ Consistent behavior across all constellation routes
✅ Vercel redirects work as expected
✅ Fallback to client-side redirect if Vercel redirect fails

## Important Notes

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
