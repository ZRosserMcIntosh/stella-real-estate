# Subdomain Redirect Setup Guide

## Overview

This implementation automatically redirects paths like `https://www.stellareal.com.br/sub/constellation` to `https://constellation.stellareal.com.br`.

## How It Works

### 1. Vercel-Level Redirects (Server-Side)

In `vercel.json`, we've configured HTTP redirects that happen before the page loads:

```json
"redirects": [
  {
    "source": "/sub/constellation/:path*",
    "destination": "https://constellation.stellareal.com.br/:path*",
    "permanent": false
  },
  {
    "source": "/sub/stellareal/:path*",
    "destination": "https://stellareal.stellareal.com.br/:path*",
    "permanent": false
  },
  {
    "source": "/sub/:subdomain/:path*",
    "destination": "https://:subdomain.stellareal.com.br/:path*",
    "permanent": false
  }
]
```

**How it works:**
- User visits `stellareal.com.br/sub/constellation/login`
- Vercel intercepts the request
- Redirects browser to `constellation.stellareal.com.br/login`
- Browser shows the subdomain URL in the address bar

### 2. Client-Side Fallback (React Router)

The `SubdomainRouter` component provides a fallback for development and edge cases:

```typescript
// In src/components/SubdomainRouter.tsx
if (pathname.startsWith('/sub/')) {
  const subdomain = pathParts[2]
  const remainingPath = '/' + pathParts.slice(3).join('/')
  
  if (!window.location.hostname.startsWith(subdomain + '.')) {
    const subdomainUrl = getSubdomainUrl(subdomain, remainingPath)
    window.location.href = subdomainUrl
  }
}
```

### 3. Subdomain Detection

Updated `src/utils/subdomain.ts` to properly detect subdomains on `.com.br` domains:

```typescript
if (hostname.includes('.stellareal.com.br')) {
  // Custom domain format: subdomain.stellareal.com.br
  if (parts.length > 3) {
    return parts[0] // Returns 'constellation', 'stellareal', etc.
  }
}
```

## DNS & Vercel Configuration

### 1. DNS Setup (Required)

In your DNS provider (e.g., GoDaddy, Cloudflare), add CNAME records:

```
constellation  CNAME  cname.vercel-dns.com.
stellareal     CNAME  cname.vercel-dns.com.
```

Or A records pointing to Vercel's IP:
```
constellation  A  76.76.21.21
stellareal     A  76.76.21.21
```

### 2. Vercel Domain Configuration

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Domains**
3. Add these domains:
   - `constellation.stellareal.com.br`
   - `stellareal.stellareal.com.br`
   - (Add any other subdomains you need)

4. Vercel will provide DNS records to configure
5. Wait for DNS propagation (can take 24-48 hours)

## Adding New Subdomains

### Step 1: Update Subdomain Config

Edit `src/utils/subdomain.ts`:

```typescript
export const SUBDOMAIN_ROUTES: SubdomainConfig[] = [
  {
    subdomain: 'constellation',
    route: '/sub/constellation',
    title: 'Constellation - Admin Portal',
    description: 'Realtor admin portal and site builder'
  },
  {
    subdomain: 'stellareal',
    route: '/sub/stellareal',
    title: 'Stella Real - Retail Platform',
    description: 'Browse all published real estate listings'
  },
  // Add new subdomain here:
  {
    subdomain: 'invest',
    route: '/investidores',
    title: 'Stella Investors',
    description: 'Investor relations portal'
  },
]
```

### Step 2: Add Vercel Redirect (Optional)

If you want a specific redirect rule in `vercel.json`:

```json
{
  "source": "/sub/invest/:path*",
  "destination": "https://invest.stellareal.com.br/:path*",
  "permanent": false
}
```

**Note:** The catch-all rule `/sub/:subdomain/:path*` already handles this.

### Step 3: Add DNS Record

Add a CNAME record for the new subdomain:
```
invest  CNAME  cname.vercel-dns.com.
```

### Step 4: Add Domain in Vercel

Add `invest.stellareal.com.br` to your Vercel project domains.

## Testing

### Local Development

When developing locally, `/sub/*` paths won't redirect automatically. Test with:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Test subdomain detection
curl -H "Host: constellation.localhost:5173" http://localhost:5173
```

### Production Testing

1. **Test main domain redirect:**
   ```
   https://stellareal.com.br/sub/constellation
   → Should redirect to https://constellation.stellareal.com.br
   ```

2. **Test subdomain direct access:**
   ```
   https://constellation.stellareal.com.br
   → Should load constellation content
   ```

3. **Test with paths:**
   ```
   https://stellareal.com.br/sub/constellation/login
   → Should redirect to https://constellation.stellareal.com.br/login
   ```

## URL Examples

| Original URL | Redirects To |
|--------------|--------------|
| `stellareal.com.br/sub/constellation` | `constellation.stellareal.com.br/` |
| `stellareal.com.br/sub/constellation/login` | `constellation.stellareal.com.br/login` |
| `stellareal.com.br/sub/constellation/dashboard` | `constellation.stellareal.com.br/dashboard` |
| `stellareal.com.br/sub/stellareal` | `stellareal.stellareal.com.br/` |
| `stellareal.com.br/sub/stellareal/projetos` | `stellareal.stellareal.com.br/projetos` |

## Troubleshooting

### Redirects Not Working

1. **Check DNS propagation:**
   ```bash
   dig constellation.stellareal.com.br
   nslookup constellation.stellareal.com.br
   ```

2. **Verify Vercel domain is added:**
   - Go to Vercel Dashboard → Settings → Domains
   - Ensure subdomain is listed and verified

3. **Check vercel.json syntax:**
   - Ensure no trailing commas
   - Valid JSON format
   - Redirects array is properly configured

4. **Clear browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or use incognito mode

### Infinite Redirect Loop

If you get stuck in a redirect loop:

1. Check that subdomain detection is working:
   ```typescript
   // In browser console on constellation.stellareal.com.br
   console.log(window.location.hostname.startsWith('constellation.'))
   // Should return true
   ```

2. Ensure the condition prevents redirecting when already on subdomain:
   ```typescript
   if (!window.location.hostname.startsWith(subdomain + '.')) {
     // Only redirect if NOT already on subdomain
   }
   ```

### Subdomain Not Detected

1. **Check hostname parsing:**
   ```typescript
   // In browser console
   console.log(window.location.hostname)
   console.log(window.location.hostname.split('.'))
   ```

2. **Verify subdomain.ts logic:**
   - Check that `.stellareal.com.br` detection is working
   - Ensure `parts.length > 3` condition is correct

## Performance Considerations

### Server-Side Redirects (Vercel)
- ✅ Fastest - happens at edge network
- ✅ SEO-friendly - proper HTTP 302 redirect
- ✅ No JavaScript required
- ✅ Works for all users

### Client-Side Redirects (React)
- ⚠️ Slower - page loads first
- ⚠️ Requires JavaScript
- ✅ Good for development
- ✅ Fallback for edge cases

**Recommendation:** Always use Vercel redirects in production. Client-side is just a fallback.

## SEO Implications

### 302 Temporary Redirects
- Used for `/sub/*` redirects
- Tells search engines this is temporary
- Original URL won't be penalized
- Good for maintaining flexibility

### 301 Permanent Redirects
- Use when you want search engines to forget the old URL
- To enable, change `"permanent": false` to `"permanent": true`
- Only do this when you're sure the redirect is permanent

## Security

### HTTPS
- All redirects maintain HTTPS protocol
- Vercel provides SSL certificates for all subdomains automatically
- No mixed content warnings

### Cross-Origin
- Each subdomain is a different origin
- Use CORS headers if you need subdomain communication
- Cookies won't be shared between subdomains by default

## Migration Path

If you have existing links to `/sub/*` paths:

1. **Phase 1:** Deploy with redirects (current setup)
   - Old `/sub/*` links work via redirects
   - New links can use subdomain directly

2. **Phase 2:** Update all links in codebase
   - Replace `/sub/constellation` with subdomain URLs
   - Use `getSubdomainUrl('constellation', '/')` helper

3. **Phase 3:** Monitor and clean up
   - Check analytics for `/sub/*` traffic
   - When traffic drops, you can remove routes if desired

## Related Files

- `/vercel.json` - Server-side redirect configuration
- `/src/utils/subdomain.ts` - Subdomain detection utilities
- `/src/components/SubdomainRouter.tsx` - Client-side routing logic
- `/src/main.tsx` - App entry point with SubdomainRouter
- `/docs/SUBDOMAIN_IMPLEMENTATION.md` - Original subdomain docs

## Quick Reference

### Check if on subdomain (in React component):
```typescript
import { useSubdomain } from '../utils/subdomain'

const config = useSubdomain()
if (config?.subdomain === 'constellation') {
  // Do something specific for constellation
}
```

### Generate subdomain URL:
```typescript
import { getSubdomainUrl } from '../utils/subdomain'

const url = getSubdomainUrl('constellation', '/login')
// Returns: https://constellation.stellareal.com.br/login
```

### Get current subdomain:
```typescript
import { getSubdomain } from '../utils/subdomain'

const subdomain = getSubdomain()
// Returns: 'constellation' or null
```
