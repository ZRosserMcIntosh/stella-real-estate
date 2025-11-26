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
  const [subdomainRoute, setSubdomainRoute] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const location = useLocation()

  useEffect(() => {
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
          console.log(`Redirecting from ${pathname} to ${subdomainUrl}`)
          // Use a flag instead of immediate redirect to avoid blocking render
          setTimeout(() => {
            window.location.href = subdomainUrl
          }, 100)
          setShouldRedirect(true)
          setIsChecking(false)
          return
        }
      }
    }

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
  }, [location])

  // Don't block render - show a loading state briefly instead of null
  if (isChecking) {
    return <div className="min-h-screen bg-white dark:bg-slate-900" />
  }

  // Show redirecting message if we're about to redirect
  if (shouldRedirect) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Redirecting...</div>
      </div>
    )
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
