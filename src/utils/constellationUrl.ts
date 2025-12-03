/**
 * Helper to generate correct Constellation URLs
 * - Always use path-based URLs: /constellation/path
 * - No more subdomain routing
 */

import { getSubdomain } from './subdomain'

export function getConstellationUrl(path: string = '/'): string {
  // Always use path-based URLs under /constellation
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `/constellation/${cleanPath}`
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
