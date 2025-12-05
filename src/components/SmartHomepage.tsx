import { getSubdomain } from '../utils/subdomain'
import App from '../App'
import ConstellationPortal from '../pages/ConstellationPortal'
import StellaReal from '../pages/StellaReal'

/**
 * Smart homepage component that renders the appropriate homepage based on subdomain
 * - constellation.stellareal.com.br → ConstellationPortal
 * - stellamary/stellareal subdomain → StellaReal
 * - Main domain → App (Stella Real Estate homepage)
 */
export default function SmartHomepage() {
  const subdomain = getSubdomain()
  
  if (subdomain === 'constellation') {
    return <ConstellationPortal />
  }
  
  if (subdomain === 'stellamary' || subdomain === 'stellareal') {
    return <StellaReal />
  }
  
  return <App />
}
