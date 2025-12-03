import { Navigate } from 'react-router-dom'
import { getSubdomain } from '../utils/subdomain'
import ConstellationLogin from '../pages/constellation/ConstellationLogin'

/**
 * Conditionally renders login based on subdomain
 * - On constellation subdomain: Render ConstellationLogin
 * - On main domain: Redirect to /admin/login
 */
export default function ConditionalLoginRedirect() {
  const subdomain = getSubdomain()
  
  // If on constellation subdomain, show ConstellationLogin
  if (subdomain === 'constellation') {
    return <ConstellationLogin />
  }
  
  // Otherwise, redirect to admin login
  return <Navigate to="/admin/login" replace />
}
