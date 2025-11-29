import { getSubdomain } from '../utils/subdomain'
import ConstellationPortal from '../pages/ConstellationPortal'
import StellaReal from '../pages/StellaReal'
import App from '../App'

/**
 * Root component that checks subdomain and renders appropriate content
 * WITHOUT the Layout wrapper for subdomains
 */
export default function RootRedirect() {
  const subdomain = getSubdomain()
  
  // On constellation subdomain, show ConstellationPortal directly (no Layout)
  if (subdomain === 'constellation') {
    return <ConstellationPortal />
  }
  
  // On stellamary/stellareal subdomain, show StellaReal directly (no Layout)
  if (subdomain === 'stellamary' || subdomain === 'stellareal') {
    return <StellaReal />
  }
  
  // On main domain, return null to let the Layout-wrapped route handle it
  return null
}
