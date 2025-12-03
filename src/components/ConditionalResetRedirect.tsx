import { Navigate } from 'react-router-dom'
import { getSubdomain } from '../utils/subdomain'
import ConstellationReset from '../pages/constellation/ConstellationReset'

/**
 * Conditionally renders password reset based on subdomain
 * - On constellation subdomain: Render ConstellationReset
 * - On main domain: Redirect to /forgot-password
 */
export default function ConditionalResetRedirect() {
  const subdomain = getSubdomain()
  
  // If on constellation subdomain, show ConstellationReset
  if (subdomain === 'constellation') {
    return <ConstellationReset />
  }
  
  // Otherwise, redirect to forgot password
  return <Navigate to="/forgot-password" replace />
}
