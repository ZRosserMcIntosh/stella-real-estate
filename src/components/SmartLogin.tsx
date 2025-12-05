import { getSubdomain } from '../utils/subdomain'
import ConstellationLogin from '../pages/constellation/ConstellationLogin'
import Login from '../pages/Login'

/**
 * Smart component for /login route
 * - On constellation subdomain → renders ConstellationLogin
 * - On main domain → renders Login (Stella admin)
 */
export default function SmartLogin() {
  const subdomain = getSubdomain()
  
  if (subdomain === 'constellation') {
    return <ConstellationLogin />
  }
  
  return <Login />
}
