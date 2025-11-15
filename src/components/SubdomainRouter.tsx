import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getSubdomainRoute, getSubdomainConfig } from '../utils/subdomain'

interface SubdomainRouterProps {
  children: React.ReactNode
}

/**
 * SubdomainRouter component that redirects to the appropriate route
 * based on the current subdomain.
 * 
 * Usage: Wrap your app or specific sections with this component
 */
export function SubdomainRouter({ children }: SubdomainRouterProps) {
  const [subdomainRoute, setSubdomainRoute] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check subdomain on mount and when hostname changes
    const route = getSubdomainRoute()
    const config = getSubdomainConfig()
    
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
    
    setSubdomainRoute(route)
    setIsChecking(false)
  }, [])

  // Show nothing while checking (prevents flash of wrong content)
  if (isChecking) {
    return null
  }

  // If we're on a subdomain and not already on the subdomain route, redirect
  if (subdomainRoute && window.location.pathname === '/') {
    return <Navigate to={subdomainRoute} replace />
  }

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
