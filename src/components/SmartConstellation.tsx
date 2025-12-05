import { getSubdomain } from '../utils/subdomain'
import ConstellationPage from '../pages/Constellation'
import ConstellationRedirect from '../pages/ConstellationRedirect'

/**
 * Smart component for /constellation route
 * - On constellation subdomain → renders ConstellationPage
 * - On main domain → redirects to constellation.stellareal.com.br
 */
export default function SmartConstellation() {
  const subdomain = getSubdomain()
  
  if (subdomain === 'constellation') {
    return <ConstellationPage />
  }
  
  return <ConstellationRedirect />
}
