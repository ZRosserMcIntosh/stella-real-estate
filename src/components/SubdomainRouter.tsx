import { useEffect, useState, ReactNode } from 'react'
import { getSubdomainRoute, getSubdomainConfig } from '../utils/subdomain'

interface SubdomainRouterProps {
  children: ReactNode
}

/**
 * SubdomainRouter component that handles subdomain detection (non-blocking)
 * This wrapper sits OUTSIDE the Router and only handles initial subdomain detection
 * It does NOT use useLocation() to avoid Router context issues
 */
export function SubdomainRouter({ children }: SubdomainRouterProps) {
  useEffect(() => {
    console.log('[SubdomainRouter] Initializing...')
    console.log('[SubdomainRouter] Current hostname:', window.location.hostname)
    console.log('[SubdomainRouter] Current pathname:', window.location.pathname)
    
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
  }, [])

  console.log('[SubdomainRouter] Rendering children')
  // Always render children - no blocking, no navigation
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
