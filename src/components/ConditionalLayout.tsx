import { getSubdomain } from '../utils/subdomain'
import Layout from './Layout'
import { Outlet } from 'react-router-dom'
import ConstellationPortal from '../pages/ConstellationPortal'
import StellaReal from '../pages/StellaReal'
import { SubdomainToPathRedirect } from './SubdomainToPathRedirect'

/**
 * Wrapper that conditionally applies Layout based on subdomain
 * - On main domain: wraps children with Layout (Stella header/footer)
 * - On constellation subdomain: redirects to path-based URL (stellareal.com.br/constellation/*)
 * - On stellamary/stellareal subdomain: renders StellaReal directly (no Layout)
 */
export default function ConditionalLayout() {
  const subdomain = getSubdomain()
  
  // On constellation subdomain, redirect to path-based URLs
  if (subdomain === 'constellation') {
    return <SubdomainToPathRedirect />
  }
  
  // On stellamary/stellareal subdomain, render StellaReal for root
  if (subdomain === 'stellamary' || subdomain === 'stellareal') {
    return <Outlet />
  }
  
  // On main domain, use Layout which renders Outlet internally
  return <Layout />
}
