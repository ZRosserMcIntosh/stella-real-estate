import { getSubdomain } from '../utils/subdomain'
import PricingPage from '../pages/Pricing'
import PrecosRedirect from '../pages/PrecosRedirect'

/**
 * Smart component for /precos route
 * - On constellation subdomain → renders PricingPage
 * - On main domain → redirects to constellation.stellareal.com.br/precos
 */
export default function SmartPrecos() {
  const subdomain = getSubdomain()
  
  if (subdomain === 'constellation') {
    return <PricingPage />
  }
  
  return <PrecosRedirect />
}
