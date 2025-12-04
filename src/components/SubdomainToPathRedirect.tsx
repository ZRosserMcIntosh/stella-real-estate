import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSubdomain } from '../utils/subdomain'

/**
 * Redirects from subdomain URLs to path-based URLs
 * Example: constellation.stellareal.com.br/signup → stellareal.com.br/constellation/signup
 */
export function SubdomainToPathRedirect() {
  const location = useLocation()

  useEffect(() => {
    const subdomain = getSubdomain()
    
    // If we're on the constellation subdomain, redirect to path-based URL
    if (subdomain === 'constellation') {
      const pathname = location.pathname
      const search = location.search
      const hash = location.hash
      
      // Build new URL on main domain
      const protocol = window.location.protocol
      const mainDomain = window.location.hostname.replace('constellation.', '')
      const newPath = `/constellation${pathname}`
      const newUrl = `${protocol}//${mainDomain}${newPath}${search}${hash}`
      
      console.log(`[SubdomainToPathRedirect] Redirecting from subdomain to path-based URL: ${newUrl}`)
      window.location.href = newUrl
    }
  }, [location])

  return null
}
