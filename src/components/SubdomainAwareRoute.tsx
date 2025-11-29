import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { getSubdomain } from '../utils/subdomain'

interface SubdomainAwareRouteProps {
  /** The subdomain this route belongs to (e.g., 'constellation') */
  subdomain: string
  /** The component to render when on the correct subdomain */
  component: ReactElement
  /** Path within the /sub/[subdomain]/ hierarchy for fallback */
  fallbackPath?: string
}

/**
 * Route component that shows content when on the matching subdomain
 * and redirects to /sub/[subdomain] when not on subdomain
 */
export function SubdomainAwareRoute({ 
  subdomain, 
  component,
  fallbackPath 
}: SubdomainAwareRouteProps) {
  const currentSubdomain = getSubdomain()
  
  // If we're on the matching subdomain, render the component
  if (currentSubdomain === subdomain) {
    return component
  }
  
  // If we have a fallback path and we're NOT on the subdomain, redirect to /sub/ path
  if (fallbackPath && currentSubdomain !== subdomain) {
    return <Navigate to={fallbackPath} replace />
  }
  
  // Default: render nothing or show 404
  return <Navigate to="/404" replace />
}
