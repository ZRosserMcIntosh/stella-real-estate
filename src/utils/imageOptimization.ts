/**
 * Image Optimization Utilities
 * 
 * Provides utilities for optimizing images served from Supabase Storage
 * using Supabase's built-in image transformation API.
 * 
 * @see https://supabase.com/docs/guides/storage/serving/image-transformations
 */

export interface ImageTransformOptions {
  /** Target width in pixels */
  width?: number
  /** Target height in pixels */
  height?: number
  /** Image quality (1-100) */
  quality?: number
  /** Output format */
  format?: 'webp' | 'avif' | 'origin'
  /** Resize mode */
  resize?: 'contain' | 'cover' | 'fill'
}

/**
 * Generates an optimized image URL using Supabase's image transformation API.
 * 
 * This reduces bandwidth and cache usage by serving appropriately sized images.
 * 
 * @param url - Original Supabase storage URL
 * @param options - Transformation options
 * @returns Optimized image URL with transformation parameters
 * 
 * @example
 * ```typescript
 * const optimizedUrl = getOptimizedImageUrl(
 *   'https://...supabase.co/storage/v1/object/public/listings/image.jpg',
 *   { width: 800, quality: 80, format: 'webp' }
 * )
 * ```
 */
export function getOptimizedImageUrl(
  url: string,
  options?: ImageTransformOptions
): string {
  if (!url) return url
  
  // Only optimize Supabase storage URLs
  if (!url.includes('supabase.co/storage')) return url
  
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    resize = 'cover'
  } = options || {}
  
  // Build transformation parameters
  const params = new URLSearchParams()
  
  if (width) params.append('width', width.toString())
  if (height) params.append('height', height.toString())
  if (quality && quality !== 100) params.append('quality', quality.toString())
  if (format !== 'origin') params.append('format', format)
  if (resize !== 'cover') params.append('resize', resize)
  
  // Add transformation parameters to URL
  const transformedUrl = `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`
  
  return transformedUrl
}

/**
 * Preset image sizes for common use cases
 */
export const IMAGE_PRESETS = {
  thumbnail: { width: 200, quality: 75 },
  card: { width: 400, quality: 80 },
  preview: { width: 800, quality: 85 },
  hero: { width: 1200, quality: 90 },
  fullscreen: { width: 1920, quality: 90 },
} as const

/**
 * Get responsive image srcset for different viewport sizes
 * 
 * @param url - Original image URL
 * @param sizes - Array of widths to generate
 * @returns srcset string for responsive images
 * 
 * @example
 * ```typescript
 * const srcset = getResponsiveSrcSet(imageUrl, [400, 800, 1200])
 * // Returns: "url?width=400 400w, url?width=800 800w, url?width=1200 1200w"
 * ```
 */
export function getResponsiveSrcSet(
  url: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string {
  if (!url || !url.includes('supabase.co/storage')) return url
  
  return sizes
    .map(width => {
      const optimized = getOptimizedImageUrl(url, { width, quality: 80 })
      return `${optimized} ${width}w`
    })
    .join(', ')
}

/**
 * Generates sizes attribute for responsive images
 * 
 * @param breakpoints - Object with viewport sizes and image widths
 * @returns sizes attribute string
 * 
 * @example
 * ```typescript
 * const sizes = getResponsiveSizes({
 *   sm: '100vw',
 *   md: '50vw',
 *   lg: '33vw',
 * })
 * ```
 */
export function getResponsiveSizes(breakpoints: {
  sm?: string
  md?: string
  lg?: string
  xl?: string
  default?: string
}): string {
  const parts: string[] = []
  
  if (breakpoints.xl) parts.push(`(min-width: 1280px) ${breakpoints.xl}`)
  if (breakpoints.lg) parts.push(`(min-width: 1024px) ${breakpoints.lg}`)
  if (breakpoints.md) parts.push(`(min-width: 768px) ${breakpoints.md}`)
  if (breakpoints.sm) parts.push(`(min-width: 640px) ${breakpoints.sm}`)
  
  parts.push(breakpoints.default || '100vw')
  
  return parts.join(', ')
}

/**
 * Optimize listing media URLs
 * 
 * @param media - Array of media objects from listings
 * @param preset - Image preset to use
 * @returns Optimized media array
 */
export function optimizeListingMedia(
  media: Array<{ kind: string; url: string }>,
  preset: keyof typeof IMAGE_PRESETS = 'card'
): Array<{ kind: string; url: string; optimizedUrl: string }> {
  return media.map(item => ({
    ...item,
    optimizedUrl: item.kind === 'image' 
      ? getOptimizedImageUrl(item.url, IMAGE_PRESETS[preset])
      : item.url
  }))
}
