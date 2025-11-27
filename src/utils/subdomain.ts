/**
 * Subdomain detection and routing utilities for Vercel deployments
 */

export interface SubdomainConfig {
  subdomain: string
  route: string
  title?: string
  description?: string
}

/**
 * Extract subdomain from hostname
 * Examples:
 * - constellation.stellareal.com.br -> constellation
 * - stellareal.stella-real-estate.vercel.app -> stellareal
 * - www.stellareal.com.br -> www
 * - stellareal.com.br -> null
 */
export function getSubdomain(): string | null {
  if (typeof window === 'undefined') return null
  
  const hostname = window.location.hostname
  const parts = hostname.split('.')
  
  // Check if we're on a Vercel deployment
  if (hostname.includes('.vercel.app')) {
    // Format: subdomain.project.vercel.app
    if (parts.length >= 4) {
      return parts[0]
    }
  } else if (hostname.includes('.stellareal.com.br')) {
    // Custom domain format: subdomain.stellareal.com.br
    if (parts.length > 3) {
      const sub = parts[0]
      // Ignore www and common non-subdomain prefixes
      if (sub !== 'www' && sub !== 'api') {
        return sub
      }
    }
  } else {
    // Generic custom domain format
    // For domains like subdomain.example.com
    if (parts.length > 2) {
      const sub = parts[0]
      // Ignore www and common non-subdomain prefixes
      if (sub !== 'www' && sub !== 'api') {
        return sub
      }
    }
  }
  
  return null
}

/**
 * Check if current hostname is a specific subdomain
 */
export function isSubdomain(subdomain: string): boolean {
  const current = getSubdomain()
  return current === subdomain
}

/**
 * Get the base domain (without subdomain)
 */
export function getBaseDomain(): string {
  if (typeof window === 'undefined') return ''
  
  const hostname = window.location.hostname
  const parts = hostname.split('.')
  
  if (hostname.includes('.vercel.app')) {
    // Return the project domain
    return parts.slice(1).join('.')
  } else if (hostname.includes('.stellareal.com.br')) {
    // Return stellareal.com.br
    return 'stellareal.com.br'
  } else {
    // Return domain with TLD (last 2 parts)
    return parts.slice(-2).join('.')
  }
}

/**
 * Get full URL for a subdomain
 */
export function getSubdomainUrl(subdomain: string, path: string = '/'): string {
  if (typeof window === 'undefined') return path
  
  const protocol = window.location.protocol
  const hostname = window.location.hostname
  let baseDomain = getBaseDomain()
  
  // If we're on stellareal.com.br or vercel, use the appropriate base
  if (hostname.includes('.stellareal.com.br') || hostname.includes('stellareal')) {
    baseDomain = 'stellareal.com.br'
  }
  
  if (subdomain) {
    return `${protocol}//${subdomain}.${baseDomain}${path}`
  } else {
    return `${protocol}//${baseDomain}${path}`
  }
}

/**
 * Subdomain configuration registry
 */
export const SUBDOMAIN_ROUTES: SubdomainConfig[] = [
  {
    subdomain: 'stellamary',
    route: '/sub/stellareal',
    title: 'Stella Mary - Retail Platform',
    description: 'Browse all published real estate listings'
  },
  {
    subdomain: 'constellation',
    route: '/sub/constellation',
    title: 'Constellation - Admin Portal',
    description: 'Realtor admin portal and site builder'
  },
  // Add more subdomain configurations here
  // {
  //   subdomain: 'invest',
  //   route: '/investidores',
  //   title: 'Stella Investors',
  //   description: 'Investor relations portal'
  // },
]

/**
 * Get route for current subdomain
 */
export function getSubdomainRoute(): string | null {
  const subdomain = getSubdomain()
  if (!subdomain) return null
  
  const config = SUBDOMAIN_ROUTES.find(s => s.subdomain === subdomain)
  return config?.route || null
}

/**
 * Get configuration for current subdomain
 */
export function getSubdomainConfig(): SubdomainConfig | null {
  const subdomain = getSubdomain()
  if (!subdomain) return null
  
  return SUBDOMAIN_ROUTES.find(s => s.subdomain === subdomain) || null
}
