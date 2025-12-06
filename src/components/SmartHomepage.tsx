import { getSubdomain } from '../utils/subdomain'
import App from '../App'
import ConstellationPortal from '../pages/ConstellationPortal'
import StellaReal from '../pages/StellaReal'
import UserSite from '../pages/UserSite'

// Reserved subdomains that have special handling
const RESERVED_SUBDOMAINS = ['constellation', 'stellamary', 'stellareal', 'www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'shop', 'store', 'ballet']

/**
 * Smart homepage component that renders the appropriate homepage based on subdomain
 * - constellation.stellareal.com.br → ConstellationPortal
 * - stellamary/stellareal subdomain → StellaReal
 * - Any other subdomain → UserSite (dynamic user sites)
 * - Main domain → App (Stella Real Estate homepage)
 */
export default function SmartHomepage() {
  const subdomain = getSubdomain()
  
  // Reserved subdomains with special handling
  if (subdomain === 'constellation') {
    return <ConstellationPortal />
  }
  
  if (subdomain === 'stellamary' || subdomain === 'stellareal') {
    return <StellaReal />
  }
  
  // If there's a subdomain and it's not reserved, it's a user site
  if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
    return <UserSite />
  }
  
  // Main domain or www - show the main app
  return <App />
}
