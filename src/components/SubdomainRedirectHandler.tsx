import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getSubdomainRoute, getSubdomainUrl } from '../utils/subdomain'

/**
 * Component that handles subdomain-based redirects
 * Must be used INSIDE a Router context
 */
export function SubdomainRedirectHandler() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const pathname = location.pathname
    const hostname = window.location.hostname
    
    // If we're on a subdomain but visiting /sub/[subdomain]/* path, clean it up
    if (pathname.startsWith('/sub/')) {
      const pathParts = pathname.split('/')
      const pathSubdomain = pathParts[2]
      const remainingPath = '/' + pathParts.slice(3).join('/')
      
      // If already on the correct subdomain, just navigate to the clean path
      if (hostname.startsWith(pathSubdomain + '.')) {
        console.log(`[SubdomainRedirect] Already on ${pathSubdomain} subdomain, cleaning URL to: ${remainingPath || '/'}`)
        navigate(remainingPath || '/', { replace: true })
        return
      }
      
      // If on wrong domain, redirect to correct subdomain
      if (pathSubdomain && !hostname.startsWith(pathSubdomain + '.')) {
        const subdomainUrl = getSubdomainUrl(pathSubdomain, remainingPath || '/')
        console.log(`[SubdomainRedirect] Redirecting to: ${subdomainUrl}`)
        window.location.href = subdomainUrl
        return
      }
    }

    // Don't auto-navigate if we're on a subdomain - let the routes handle it
    // This prevents forcing navigation to /sub/constellation
  }, [location, navigate])

  return null
}
