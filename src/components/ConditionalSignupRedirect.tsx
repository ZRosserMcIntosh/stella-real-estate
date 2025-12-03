import { Navigate } from 'react-router-dom'
import { getSubdomain } from '../utils/subdomain'
import ConstellationSignup from '../pages/constellation/ConstellationSignup'

/**
 * Conditionally renders signup based on subdomain
 * - On constellation subdomain: Render ConstellationSignup
 * - On main domain: Redirect to /admin/signup
 */
export default function ConditionalSignupRedirect() {
  const subdomain = getSubdomain()
  
  // If on constellation subdomain, show ConstellationSignup
  if (subdomain === 'constellation') {
    return <ConstellationSignup />
  }
  
  // Otherwise, redirect to admin signup
  return <Navigate to="/admin/signup" replace />
}
