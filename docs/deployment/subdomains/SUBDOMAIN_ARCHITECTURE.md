# Subdomain Architecture Diagram

## URL Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER ACCESSES WEBSITE                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │  Which URL did they use?                │
         └────────────────────────────────────────┘
                              │
                 ┌────────────┴───────────┐
                 │                        │
                 ▼                        ▼
    ┌─────────────────────┐   ┌─────────────────────────┐
    │ /sub/* Path         │   │ Direct Subdomain        │
    │ Example:            │   │ Example:                │
    │ /sub/constellation  │   │ constellation.          │
    │                     │   │ stellareal.com.br       │
    └─────────────────────┘   └─────────────────────────┘
                 │                        │
                 │                        │
                 ▼                        ▼
    ┌─────────────────────┐   ┌─────────────────────────┐
    │ VERCEL REDIRECT     │   │ VERCEL ROUTING          │
    │ (Server-Side)       │   │ (DNS Resolution)        │
    │                     │   │                         │
    │ HTTP 302 Redirect   │   │ Load React App          │
    └─────────────────────┘   └─────────────────────────┘
                 │                        │
                 └────────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ SUBDOMAIN URL        │
                   │ constellation.       │
                   │ stellareal.com.br    │
                   └──────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ SubdomainRouter      │
                   │ (React Component)    │
                   └──────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ Detect Subdomain     │
                   │ "constellation"      │
                   └──────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ Load Correct Content │
                   │ ConstellationPortal  │
                   └──────────────────────┘
```

## DNS & Domain Setup

```
┌────────────────────────────────────────────────────────────┐
│                     DNS PROVIDER                           │
│                  (GoDaddy, Cloudflare, etc.)               │
└────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼                    ▼
        ┌──────────────────┐   ┌──────────────────┐
        │ constellation    │   │ stellareal       │
        │ CNAME →          │   │ CNAME →          │
        │ vercel-dns.com   │   │ vercel-dns.com   │
        └──────────────────┘   └──────────────────┘
                    │                    │
                    └─────────┬──────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ VERCEL EDGE NETWORK  │
                   │ (Global CDN)         │
                   └──────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ SSL Certificate      │
                   │ (Auto-provisioned)   │
                   └──────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ Your React App       │
                   │ (stella-real-estate) │
                   └──────────────────────┘
```

## Subdomain Detection Logic

```
window.location.hostname
         │
         ▼
"constellation.stellareal.com.br"
         │
         ▼
Split by "."
         │
         ▼
["constellation", "stellareal", "com", "br"]
         │
         ▼
Check if .stellareal.com.br
         │
         ▼
Extract parts[0]
         │
         ▼
subdomain = "constellation"
         │
         ▼
Look up in SUBDOMAIN_ROUTES[]
         │
         ▼
{
  subdomain: 'constellation',
  route: '/sub/constellation',
  title: 'Constellation',
  description: '...'
}
         │
         ▼
Load ConstellationPortal component
```

## Redirect Flow (Detailed)

```
User clicks link: /sub/constellation/login
                              │
                              ▼
              ┌───────────────────────────┐
              │ Browser sends HTTP GET    │
              │ to stellareal.com.br      │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ Request hits Vercel Edge  │
              │ (nearest data center)     │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ Check vercel.json         │
              │ for matching redirect     │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ Match found:              │
              │ /sub/constellation/:path* │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ Extract :path = "login"   │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ Build destination URL:    │
              │ constellation.            │
              │ stellareal.com.br/login   │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ Send HTTP 302 Response    │
              │ Location: [new URL]       │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ Browser automatically     │
              │ follows redirect          │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ New request to subdomain  │
              │ constellation.            │
              │ stellareal.com.br/login   │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ DNS resolves to Vercel    │
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ Load React app            │
              │ SubdomainRouter detects   │
              │ subdomain = "constellation"│
              └───────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │ Render ConstellationLogin │
              └───────────────────────────┘
```

## Component Hierarchy

```
main.tsx
  │
  ├─ HelmetProvider
  │   │
  │   ├─ AuthProvider
  │   │   │
  │   │   ├─ OnboardingProvider
  │   │   │   │
  │   │   │   ├─ CurrencyProvider
  │   │   │   │   │
  │   │   │   │   ├─ SubdomainRouter ⭐ (NEW LOGIC)
  │   │   │   │   │   │
  │   │   │   │   │   ├─ Detect /sub/* path
  │   │   │   │   │   │   └─ Redirect to subdomain
  │   │   │   │   │   │
  │   │   │   │   │   ├─ Detect subdomain
  │   │   │   │   │   │   └─ Update title/meta
  │   │   │   │   │   │
  │   │   │   │   │   └─ RouterProvider
  │   │   │   │   │       │
  │   │   │   │   │       ├─ /sub/constellation → ConstellationPortal
  │   │   │   │   │       ├─ /sub/stellareal → StellaReal
  │   │   │   │   │       └─ All other routes...
```

## File Structure

```
stella-real-estate/
│
├── vercel.json ⭐ (MODIFIED)
│   └── Added redirects[] array
│
├── src/
│   ├── utils/
│   │   └── subdomain.ts ⭐ (MODIFIED)
│   │       ├── getSubdomain() - Detect .com.br subdomains
│   │       ├── getSubdomainUrl() - Build subdomain URLs
│   │       └── SUBDOMAIN_ROUTES[] - Config registry
│   │
│   ├── components/
│   │   ├── SubdomainRouter.tsx ⭐ (MODIFIED)
│   │   │   └── Added /sub/* redirect logic
│   │   │
│   │   └── SubdomainRedirect.tsx ⭐ (NEW)
│   │       └── Standalone redirect component
│   │
│   └── main.tsx
│       └── Wraps app with SubdomainRouter
│
└── docs/
    ├── SUBDOMAIN_REDIRECT_SETUP.md ⭐ (NEW)
    ├── SUBDOMAIN_DEPLOYMENT_CHECKLIST.md ⭐ (NEW)
    └── SUBDOMAIN_REDIRECT_SUMMARY.md ⭐ (NEW)
```

## Current Subdomain Configuration

```typescript
SUBDOMAIN_ROUTES = [
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
  }
]
```

## URL Examples

```
┌──────────────────────────────────────────────────────────────────┐
│ FROM (what user types)                                           │
│ TO (where they end up)                                           │
└──────────────────────────────────────────────────────────────────┘

stellareal.com.br/sub/constellation
    ↓ (HTTP 302 Redirect)
constellation.stellareal.com.br/

stellareal.com.br/sub/constellation/login
    ↓ (HTTP 302 Redirect)
constellation.stellareal.com.br/login

stellareal.com.br/sub/constellation/dashboard
    ↓ (HTTP 302 Redirect)
constellation.stellareal.com.br/dashboard

stellareal.com.br/sub/stellareal
    ↓ (HTTP 302 Redirect)
stellareal.stellareal.com.br/

constellation.stellareal.com.br/
    ↓ (No redirect - direct access)
constellation.stellareal.com.br/
```

## Deployment Flow

```
┌─────────────────┐
│ 1. Update DNS   │ Add CNAME records
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Add Domains  │ In Vercel dashboard
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Deploy Code  │ vercel --prod
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Wait DNS     │ 24-48 hours
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. Test         │ Visit subdomain URLs
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. Verify SSL   │ Auto-provisioned
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ✅ Live!        │
└─────────────────┘
```
