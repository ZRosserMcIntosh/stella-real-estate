import { getSubdomain } from '../utils/subdomain'
import ConstellationSignup from '../pages/constellation/ConstellationSignup'
import SignUp from '../pages/SignUp'

/**
 * Smart component for /signup route
 * - On constellation subdomain → renders ConstellationSignup
 * - On main domain → renders SignUp (Stella admin)
 */
export default function SmartSignup() {
  const subdomain = getSubdomain()
  
  if (subdomain === 'constellation') {
    return <ConstellationSignup />
  }
  
  return <SignUp />
}
