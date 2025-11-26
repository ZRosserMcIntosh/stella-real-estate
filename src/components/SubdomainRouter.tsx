import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getSubdomainRoute, getSubdomainConfig, getSubdomainUrl } from '../utils/subdomain'

interface SubdomainRouterProps {
  children: React.ReactNode
}

/**
 * SubdomainRouter component that handles subdomain-based routing and redirects
 * 
 * Features:
 * 1. Redirects /sub/* paths to actual subdomains (e.g., /sub/constellation -> constellation.stellareal.com.br)
 * 2. When on a subdomain, automatically shows the correct content
 * 3. Updates page title and meta description based on subdomain
 * 
 * Usage: Wrap your app or specific sections with this component
 */
export function SubdomainRouter({ children }: SubdomainRouterProps) {
  const location = useLocation()

  useEffect(() => {
    console.log('[SubdomainRouter] Current pathname:', location.pathname)
    console.log('[SubdomainRouter] Current hostname:', window.location.hostname)
    
    // Check if we're on a /sub/* path and redirect to subdomain
    const pathname = location.pathname
    
    if (pathname.startsWith('/sub/')) {
      // Extract the subdomain and remaining path
      const pathParts = pathname.split('/')
      const subdomain = pathParts[2] // /sub/constellation -> constellation
      const remainingPath = '/' + pathParts.slice(3).join('/') // /sub/constellation/login -> /login
      
      if (subdomain) {
        // Only redirect if we're not already on the subdomain
        if (!window.location.hostname.startsWith(subdomain + '.')) {
          const subdomainUrl = getSubdomainUrl(subdomain, remainingPath || '/')
          console.log(`[SubdomainRouter] Redirecting from ${pathname} to ${subdomainUrl}`)
          window.location.href = subdomainUrl
          return
        }
      }
    }

    // Check subdomain and update meta info (non-blocking)
    const config = getSubdomainConfig()
    console.log('[SubdomainRouter] Subdomain config:', config)
    
    if (config) {
      // Update document title if configured
      if (config.title) {
        document.title = config.title
      }
      
      // Update meta description if configured
      if (config.description) {
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', config.description)
        }
      }
    }
  }, [location])

  // Check if we're on a subdomain at the root path
  const subdomainRoute = getSubdomainRoute()
  console.log('[SubdomainRouter] Subdomain route:', subdomainRoute)
  console.log('[SubdomainRouter] Current path:', window.location.pathname)
  
  if (subdomainRoute && window.location.pathname === '/') {
    console.log('[SubdomainRouter] Navigating to subdomain route:', subdomainRoute)
    return <Navigate to={subdomainRoute} replace />
  }

  console.log('[SubdomainRouter] Rendering children normally')
  // Always render children - don't block
  return <>{children}</>
}

/**
 * Hook to access current subdomain information
 */
export function useSubdomain() {
  const [config, setConfig] = useState<ReturnType<typeof getSubdomainConfig>>(null)

  useEffect(() => {
    setConfig(getSubdomainConfig())
  }, [])

  return config
}
