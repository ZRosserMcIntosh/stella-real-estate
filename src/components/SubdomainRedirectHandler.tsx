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
    
    // Handle /sub/* paths - redirect to actual subdomains
    if (pathname.startsWith('/sub/')) {
      const pathParts = pathname.split('/')
      const subdomain = pathParts[2]
      const remainingPath = '/' + pathParts.slice(3).join('/')
      
      if (subdomain && !window.location.hostname.startsWith(subdomain + '.')) {
        const subdomainUrl = getSubdomainUrl(subdomain, remainingPath || '/')
        console.log(`[SubdomainRedirect] Redirecting to: ${subdomainUrl}`)
        window.location.href = subdomainUrl
        return
      }
    }

    // If on a subdomain at root, navigate to subdomain route
    if (pathname === '/') {
      const subdomainRoute = getSubdomainRoute()
      if (subdomainRoute) {
        console.log(`[SubdomainRedirect] Navigating to subdomain route: ${subdomainRoute}`)
        navigate(subdomainRoute, { replace: true })
      }
    }
  }, [location, navigate])

  return null
}
