/**
 * Helper to generate correct Constellation URLs
 * - When on constellation subdomain: use /path
 * - When on main domain: use https://constellation.stellareal.com.br/path
 */

import { getSubdomain } from './subdomain'

export function getConstellationUrl(path: string = '/'): string {
  const subdomain = getSubdomain()
  
  // If already on constellation subdomain, use relative path
  if (subdomain === 'constellation') {
    return path
  }
  
  // Otherwise, use full subdomain URL
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:'
  return `${protocol}//constellation.stellareal.com.br${path}`
}

/**
 * Quick shortcuts for common constellation paths
 */
export const ConstellationUrls = {
  home: () => getConstellationUrl('/'),
  login: () => getConstellationUrl('/login'),
  signup: () => getConstellationUrl('/signup'),
  reset: () => getConstellationUrl('/reset'),
  dashboard: () => getConstellationUrl('/admin'),
  admin: () => getConstellationUrl('/admin'),
  visuals: () => getConstellationUrl('/visuals'),
  siteBuilder: () => getConstellationUrl('/site-builder'),
}
