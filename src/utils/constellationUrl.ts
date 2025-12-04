/**
 * Helper to generate correct Constellation URLs
 * - Always use path-based URLs: /constellation/path
 * - No more subdomain routing
 * 
 * Updated: December 3, 2025 - Removed subdomain logic
 */

export function getConstellationUrl(path: string = '/'): string {
  // Always use ABSOLUTE URLs to main domain to prevent subdomain issues
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Build absolute URL to ensure we always go to main domain
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:'
  const mainDomain = 'stellareal.com.br'
  
  return `${protocol}//${mainDomain}/constellation/${cleanPath}`
}

/**
 * Quick shortcuts for common constellation paths
 */
export const ConstellationUrls = {
  home: () => getConstellationUrl(''),
  login: () => getConstellationUrl('login'),
  signup: () => getConstellationUrl('signup'),
  reset: () => getConstellationUrl('reset'),
  dashboard: () => getConstellationUrl('dashboard'),
  admin: () => getConstellationUrl('admin'),
  visuals: () => getConstellationUrl('visuals'),
  siteBuilder: () => getConstellationUrl('site-builder'),
}
