import { getSubdomain } from '../utils/subdomain'
import Layout from './Layout'
import { Outlet } from 'react-router-dom'
import ConstellationPortal from '../pages/ConstellationPortal'
import StellaReal from '../pages/StellaReal'

/**
 * Wrapper that conditionally applies Layout based on subdomain
 * - On main domain: wraps children with Layout (Stella header/footer)
 * - On constellation subdomain: renders ConstellationPortal directly (no Layout)
 * - On stellamary/stellareal subdomain: renders StellaReal directly (no Layout)
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
  
  // On main domain, use Layout which renders Outlet internally
  return <Layout />
}
