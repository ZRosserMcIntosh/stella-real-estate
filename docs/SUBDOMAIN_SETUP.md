# Subdomain Setup Guide

This document explains how to set up and use subdomains with your Stella Real Estate Vercel deployment.

## Overview

The application supports subdomain-based routing, allowing you to create dedicated experiences for different purposes or brands while maintaining a single codebase.

## How It Works

1. **Automatic Detection**: The app automatically detects the subdomain from the URL
2. **Smart Routing**: When visiting a configured subdomain, users are redirected to the appropriate page
3. **SEO Friendly**: Each subdomain can have its own title and meta description
4. **Single Deployment**: All subdomains are served from the same Vercel deployment

## Example Subdomain

The current setup includes:
- **stellareal.stella-real-estate.vercel.app** → Routes to `/stellareal` page

## Adding a New Subdomain

### 1. Configure the Subdomain Route

Edit `src/utils/subdomain.ts` and add your subdomain to the `SUBDOMAIN_ROUTES` array:

```typescript
export const SUBDOMAIN_ROUTES: SubdomainConfig[] = [
  {
    subdomain: 'stellareal',
    route: '/stellareal',
    title: 'Stella Real',
    description: 'Dedicated real estate subdomain'
  },
  {
    subdomain: 'invest',
    route: '/investidores',
    title: 'Stella Investors',
    description: 'Investor relations portal'
  },
  // Add more here...
]
```

### 2. Create a Page Component (if needed)

If you need a new page for your subdomain, create it in `src/pages/`:

```tsx
// src/pages/YourPage.tsx
export default function YourPage() {
  return (
    <div className="min-h-screen">
      <h1>Your Subdomain Page</h1>
      {/* Your content */}
    </div>
  )
}
```

### 3. Add the Route

Update `src/main.tsx` to include your new route:

```tsx
import YourPage from './pages/YourPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // ... existing routes
      { path: 'your-route', element: <YourPage /> },
    ],
  },
  // ... rest of routes
])
```

### 4. Configure Vercel Domain

In the Vercel dashboard:

1. Go to your project settings
2. Navigate to **Domains**
3. Add your subdomain (e.g., `invest.stella-real-estate.vercel.app`)
4. Vercel will automatically handle the DNS

For custom domains:
1. Add the subdomain in Vercel (e.g., `invest.yourdomain.com`)
2. Update your DNS provider with the CNAME record Vercel provides

## Testing Locally

To test subdomain routing locally, you can:

1. **Use localhost with subdomain** (requires hosts file modification):
   ```bash
   # Add to /etc/hosts (macOS/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows)
   127.0.0.1 stellareal.localhost
   ```

2. **Or manually test the route** by visiting:
   ```
   http://localhost:5173/stellareal
   ```

## Utility Functions

The subdomain utilities provide several helper functions:

```tsx
import { 
  getSubdomain, 
  isSubdomain, 
  getSubdomainUrl,
  useSubdomain 
} from './utils/subdomain'

// Get current subdomain
const subdomain = getSubdomain() // Returns 'stellareal' or null

// Check if on specific subdomain
if (isSubdomain('stellareal')) {
  // Do something specific
}

// Generate URL for a subdomain
const url = getSubdomainUrl('invest', '/dashboard')
// Returns: https://invest.stella-real-estate.vercel.app/dashboard

// Use in components with hook
function MyComponent() {
  const config = useSubdomain()
  
  if (config) {
    console.log(`On subdomain: ${config.subdomain}`)
    console.log(`Title: ${config.title}`)
  }
  
  return <div>...</div>
}
```

## Advanced Configuration

### Subdomain-Specific Styling

You can apply different styles based on subdomain:

```tsx
import { useSubdomain } from '../utils/subdomain'

function Header() {
  const config = useSubdomain()
  
  const logoClass = config?.subdomain === 'invest' 
    ? 'text-blue-600' 
    : 'text-brand-600'
    
  return <header className={logoClass}>...</header>
}
```

### Subdomain-Specific Data

You can fetch different data based on subdomain:

```tsx
useEffect(() => {
  const subdomain = getSubdomain()
  
  if (subdomain === 'invest') {
    fetchInvestorData()
  } else {
    fetchPublicData()
  }
}, [])
```

## Deployment

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: Add subdomain support"
   git push
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

3. **Configure domains** in the Vercel dashboard as described above

## Troubleshooting

### Subdomain not working
- Ensure the subdomain is added in Vercel dashboard
- Check that DNS propagation is complete (can take up to 48 hours)
- Verify the subdomain is configured in `src/utils/subdomain.ts`

### Redirect not happening
- Check browser console for errors
- Ensure `SubdomainRouter` is wrapping `RouterProvider` in `main.tsx`
- Clear browser cache and cookies

### Custom domain issues
- Verify CNAME record points to Vercel
- Check SSL certificate status in Vercel dashboard
- Ensure domain is verified

## Examples

### Marketing Subdomain
```typescript
{
  subdomain: 'marketing',
  route: '/luisa-marketing',
  title: 'Stella Marketing Services',
  description: 'Professional marketing for real estate'
}
```

### Investor Portal
```typescript
{
  subdomain: 'invest',
  route: '/investidores',
  title: 'Stella Investor Relations',
  description: 'Investor portal and relations'
}
```

### Regional Office
```typescript
{
  subdomain: 'sp',
  route: '/sao-paulo',
  title: 'Stella São Paulo',
  description: 'Real estate in São Paulo'
}
```

## Security Considerations

- Subdomains share the same authentication
- Session cookies are set at the parent domain level
- API endpoints are accessible from all subdomains
- Consider implementing subdomain-specific middleware if needed

## Performance

- No additional bundle size per subdomain
- Single build serves all subdomains
- Client-side routing is instant
- No server-side rendering needed

## Support

For additional help or questions:
- Check the code in `src/utils/subdomain.ts`
- Review `src/components/SubdomainRouter.tsx`
- Contact the development team
