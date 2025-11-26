import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSubdomainUrl } from '../utils/subdomain'

/**
 * Component to handle client-side redirects from /sub/* paths to actual subdomains
 * This serves as a fallback if Vercel redirects don't work or during development
 */
export function SubdomainRedirect() {
  const location = useLocation()

  useEffect(() => {
    const pathname = location.pathname
    
    // Check if we're on a /sub/* path
    if (pathname.startsWith('/sub/')) {
      // Extract the subdomain and remaining path
      const pathParts = pathname.split('/')
      const subdomain = pathParts[2] // /sub/constellation -> constellation
      const remainingPath = '/' + pathParts.slice(3).join('/') // /sub/constellation/login -> /login
      
      if (subdomain) {
        // Build the subdomain URL
        const subdomainUrl = getSubdomainUrl(subdomain, remainingPath || '/')
        
        // Only redirect if we're not already on the subdomain
        if (!window.location.hostname.startsWith(subdomain + '.')) {
          console.log(`Redirecting from ${pathname} to ${subdomainUrl}`)
          window.location.href = subdomainUrl
        }
      }
    }
  }, [location])

  return null
}
