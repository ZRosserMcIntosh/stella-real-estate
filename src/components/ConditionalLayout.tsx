import { getSubdomain } from '../utils/subdomain'
import Layout from './Layout'
import { Outlet } from 'react-router-dom'
import ConstellationPortal from '../pages/ConstellationPortal'
import StellaReal from '../pages/StellaReal'
import UserSiteLayout from './UserSiteLayout'

// Reserved subdomains that should NOT use UserSiteLayout
const RESERVED_SUBDOMAINS = ['constellation', 'stellamary', 'stellareal', 'www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'shop', 'store', 'ballet']

/**
 * Wrapper that conditionally applies Layout based on subdomain
 * - On main domain: wraps children with Layout (Stella header/footer)
 * - On constellation subdomain: renders ConstellationPortal directly (no Layout)
 * - On stellamary/stellareal subdomain: renders StellaReal directly (no Layout)
 * - On user subdomains (like rosser.stellareal.com.br): renders UserSiteLayout which isolates user content
 */
export default function ConditionalLayout() {
  const subdomain = getSubdomain()
  
  // On constellation subdomain, render ConstellationPortal for root, nothing for sub-routes
  if (subdomain === 'constellation') {
    return <Outlet />
  }
  
  // On stellamary/stellareal subdomain, render StellaReal for root
  if (subdomain === 'stellamary' || subdomain === 'stellareal') {
    return <Outlet />
  }
  
  // On user subdomains (non-reserved), render UserSiteLayout which handles all routes
  if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
    return <UserSiteLayout />
  }
  
  // On main domain (no subdomain), use Layout which renders Outlet internally
  return <Layout />
}
