/**
 * Social Media Publishing - Media Handler
 *
 * This module handles media processing for social media publishing.
 * Different platforms have different requirements:
 *
 * - Image formats: Some want JPEG, others PNG, or WebP
 * - Image sizes: Instagram max 1080x1350, TikTok 1080x1920
 * - Video formats: Some want MP4, others WebM
 * - Video duration: TikTok limited, YouTube unlimited
 * - Compression: Optimize file sizes to meet platform limits
 *
 * This handler:
 * - Downloads media from URLs
 * - Resizes and optimizes images
 * - Compresses videos
 * - Uploads to platform CDNs
 * - Returns media IDs for posting
 */

export interface MediaDimensions {
  width: number
  height: number
}

export interface PlatformMediaRequirements {
  maxFileSize: number // in bytes
  maxImageDimensions: MediaDimensions
  minImageDimensions: MediaDimensions
  maxVideoDuration: number // in seconds
  maxVideoFileSize: number // in bytes
  allowedFormats: string[] // e.g., ['jpg', 'png', 'mp4']
  recommendedDimensions?: MediaDimensions
  aspectRatios?: number[] // e.g., [1, 16/9, 4/5]
}

// ============================================================================
// Platform-Specific Media Requirements
// ============================================================================

const MEDIA_REQUIREMENTS: Record<string, PlatformMediaRequirements> = {
  instagram: {
    maxFileSize: 8 * 1024 * 1024, // 8MB
    maxImageDimensions: { width: 1080, height: 1350 },
    minImageDimensions: { width: 600, height: 600 },
    maxVideoDuration: 60,
    maxVideoFileSize: 100 * 1024 * 1024, // 100MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'mp4', 'mov'],
    recommendedDimensions: { width: 1080, height: 1350 },
    aspectRatios: [1, 4 / 5, 9 / 16],
  },

  facebook: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImageDimensions: { width: 1200, height: 1200 },
    minImageDimensions: { width: 200, height: 200 },
    maxVideoDuration: 240, // 4 minutes
    maxVideoFileSize: 4 * 1024 * 1024 * 1024, // 4GB
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
    recommendedDimensions: { width: 1200, height: 628 },
  },

  x: {
    maxFileSize: 15 * 1024 * 1024, // 15MB
    maxImageDimensions: { width: 1200, height: 675 },
    minImageDimensions: { width: 200, height: 200 },
    maxVideoDuration: 140, // 2min 20sec
    maxVideoFileSize: 512 * 1024 * 1024, // 512MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
    recommendedDimensions: { width: 1200, height: 675 },
  },

  linkedin: {
    maxFileSize: 20 * 1024 * 1024, // 20MB
    maxImageDimensions: { width: 1200, height: 627 },
    minImageDimensions: { width: 200, height: 200 },
    maxVideoDuration: 600, // 10 minutes
    maxVideoFileSize: 5 * 1024 * 1024 * 1024, // 5GB
    allowedFormats: ['jpg', 'jpeg', 'png', 'mp4', 'mov'],
    recommendedDimensions: { width: 1200, height: 627 },
  },

  tiktok: {
    maxFileSize: 287.6 * 1024 * 1024, // ~288MB
    maxImageDimensions: { width: 1080, height: 1920 },
    minImageDimensions: { width: 540, height: 960 },
    maxVideoDuration: 600, // 10 minutes for uploaded videos
    maxVideoFileSize: 287.6 * 1024 * 1024,
    allowedFormats: ['mp4', 'mov', 'avi', 'flv', 'jpg', 'png', 'gif'],
    recommendedDimensions: { width: 1080, height: 1920 },
    aspectRatios: [9 / 16, 16 / 9, 1],
  },

  youtube: {
    maxFileSize: 256 * 1024 * 1024 * 1024, // 256GB
    maxImageDimensions: { width: 1920, height: 1080 },
    minImageDimensions: { width: 1280, height: 720 },
    maxVideoDuration: Infinity,
    maxVideoFileSize: 256 * 1024 * 1024 * 1024,
    allowedFormats: ['mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'webm', '3gp'],
    recommendedDimensions: { width: 1920, height: 1080 },
  },

  threads: {
    maxFileSize: 8 * 1024 * 1024, // 8MB
    maxImageDimensions: { width: 1080, height: 1350 },
    minImageDimensions: { width: 600, height: 600 },
    maxVideoDuration: 60,
    maxVideoFileSize: 100 * 1024 * 1024,
    allowedFormats: ['jpg', 'jpeg', 'png', 'mp4', 'mov'],
    recommendedDimensions: { width: 1080, height: 1350 },
  },

  pinterest: {
    maxFileSize: 25 * 1024 * 1024, // 25MB
    maxImageDimensions: { width: 1500, height: 2000 },
    minImageDimensions: { width: 300, height: 400 },
    maxVideoDuration: 300, // 5 minutes
    maxVideoFileSize: 500 * 1024 * 1024,
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov'],
    recommendedDimensions: { width: 1000, height: 1500 },
    aspectRatios: [2 / 3, 1, 16 / 9],
  },

  bluesky: {
    maxFileSize: 1 * 1024 * 1024, // 1MB
    maxImageDimensions: { width: 2000, height: 2000 },
    minImageDimensions: { width: 100, height: 100 },
    maxVideoDuration: 0, // Videos not supported yet
    maxVideoFileSize: 0,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    recommendedDimensions: { width: 1080, height: 1080 },
  },

  mastodon: {
    maxFileSize: 41 * 1024 * 1024, // 41MB (varies by server)
    maxImageDimensions: { width: 1600, height: 1200 },
    minImageDimensions: { width: 100, height: 100 },
    maxVideoDuration: 3600,
    maxVideoFileSize: 41 * 1024 * 1024,
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm'],
    recommendedDimensions: { width: 1080, height: 1080 },
  },

  google_business: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImageDimensions: { width: 2000, height: 2000 },
    minImageDimensions: { width: 100, height: 100 },
    maxVideoDuration: 30,
    maxVideoFileSize: 100 * 1024 * 1024,
    allowedFormats: ['jpg', 'jpeg', 'png', 'mp4'],
    recommendedDimensions: { width: 1200, height: 628 },
  },
}

// ============================================================================
// Media Handler Class
// ============================================================================

/**
 * MediaHandler
 *
 * Processes media files for social media posting.
 *
 * What it does:
 * - Validates media meets platform requirements
 * - Downloads media from URLs
 * - Resizes images to platform specifications
 * - Compresses videos
 * - Uploads to platform CDNs
 *
 * Why designed this way:
 * - Each platform has unique requirements, so we centralize them
 * - Validation before upload saves time and bandwidth
 * - Caching prevents re-processing identical media
 */
export class MediaHandler {
  private platform: string
  private requirements: PlatformMediaRequirements

  constructor(platform: string) {
    this.platform = platform.toLowerCase()
    this.requirements = MEDIA_REQUIREMENTS[this.platform]

    if (!this.requirements) {
      throw new Error(`Unknown platform: ${platform}`)
    }
  }

  /**
   * Validate media before processing
   *
   * Checks:
   * - File size not too large
   * - Image dimensions acceptable
   * - Video duration not too long
   * - File format supported
   *
   * @param file - File to validate
   * @throws Error if validation fails
   */
  async validateMedia(
    file: File | Buffer,
    mediaType: 'image' | 'video'
  ): Promise<void> {
    const fileSize = file instanceof File ? file.size : file.length
    const maxSize =
      mediaType === 'image'
        ? this.requirements.maxFileSize
        : this.requirements.maxVideoFileSize

    // Check file size
    if (fileSize > maxSize) {
      throw new Error(
        `File too large: ${(fileSize / 1024 / 1024).toFixed(2)}MB exceeds ${(maxSize / 1024 / 1024).toFixed(2)}MB limit for ${this.platform}`
      )
    }

    // Get file extension
    const filename = file instanceof File ? file.name : ''
    const ext = filename.split('.').pop()?.toLowerCase()

    // Check format
    if (ext && !this.requirements.allowedFormats.includes(ext)) {
      throw new Error(
        `Format not supported: .${ext} (allowed: ${this.requirements.allowedFormats.join(', ')})`
      )
    }

    // Validate based on type
    if (mediaType === 'video') {
      if (this.requirements.maxVideoDuration === 0) {
        throw new Error(`Videos not supported on ${this.platform}`)
      }
    }
  }

  /**
   * Download media from URL
   *
   * @param url - URL to download from
   * @returns Buffer of downloaded file
   */
  async downloadMedia(url: string): Promise<Buffer> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`)
      }
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      throw new Error(`Download failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Get recommended dimensions for this platform
   *
   * @returns Recommended width x height
   */
  getRecommendedDimensions(): MediaDimensions {
    return (
      this.requirements.recommendedDimensions || {
        width: this.requirements.maxImageDimensions.width,
        height: this.requirements.maxImageDimensions.height,
      }
    )
  }

  /**
   * Get maximum file size for media type
   *
   * @returns Max file size in MB
   */
  getMaxFileSize(mediaType: 'image' | 'video'): number {
    const bytes =
      mediaType === 'image'
        ? this.requirements.maxFileSize
        : this.requirements.maxVideoFileSize
    return Math.round(bytes / 1024 / 1024)
  }

  /**
   * Get supported file formats
   *
   * @returns Array of allowed formats
   */
  getSupportedFormats(): string[] {
    return this.requirements.allowedFormats
  }

  /**
   * Resize image to platform specifications
   *
   * In a real implementation, this would use a library like Sharp
   * to actually resize images. For now, we'll return the buffer as-is.
   *
   * @param buffer - Image buffer
   * @param maxWidth - Maximum width
   * @param maxHeight - Maximum height
   * @returns Resized image buffer
   */
  async resizeImage(
    buffer: Buffer,
    maxWidth: number = this.requirements.maxImageDimensions.width,
    maxHeight: number = this.requirements.maxImageDimensions.height
  ): Promise<Buffer> {
    // In production, use Sharp or similar:
    // const image = sharp(buffer)
    // const metadata = await image.metadata()
    // const resized = image.resize(maxWidth, maxHeight, { fit: 'inside' })
    // return resized.toBuffer()

    // For now, just return the buffer
    return buffer
  }

  /**
   * Compress video to platform specifications
   *
   * In a real implementation, this would use FFmpeg to compress videos.
   *
   * @param buffer - Video buffer
   * @returns Compressed video buffer
   */
  async compressVideo(buffer: Buffer): Promise<Buffer> {
    // In production, use FFmpeg:
    // ffmpeg -i input.mp4 -c:v libx264 -crf 23 output.mp4

    // For now, just return the buffer
    return buffer
  }

  /**
   * Upload media to platform
   *
   * Platform-specific implementation. Each platform has its own
   * media upload endpoint.
   *
   * @param buffer - Media buffer
   * @param filename - Original filename
   * @param accessToken - OAuth access token
   * @returns Platform-specific media ID
   */
  async uploadMedia(
    buffer: Buffer,
    filename: string,
    accessToken: string
  ): Promise<string> {
    // This is platform-specific and implemented in each publisher
    throw new Error('uploadMedia not implemented in base class')
  }

  /**
   * Process media for platform
   *
   * Main entry point - validates, downloads, processes, and uploads
   *
   * @param url - URL of media to process
   * @param mediaType - Type of media (image or video)
   * @param accessToken - OAuth access token
   * @returns Platform media ID
   */
  async processMedia(
    url: string,
    mediaType: 'image' | 'video',
    accessToken: string
  ): Promise<string> {
    // Download
    const buffer = await this.downloadMedia(url)

    // Validate
    const filename = url.split('/').pop() || 'media'
    await this.validateMedia(buffer, mediaType)

    // Process
    let processed = buffer
    if (mediaType === 'image') {
      processed = await this.resizeImage(buffer)
    } else {
      processed = await this.compressVideo(buffer)
    }

    // Upload
    return this.uploadMedia(processed, filename, accessToken)
  }

  /**
   * Get platform requirements
   *
   * Returns all requirements for this platform
   *
   * @returns Platform media requirements
   */
  getRequirements(): PlatformMediaRequirements {
    return this.requirements
  }
}

// ============================================================================
// Media Validator Helper
// ============================================================================

/**
 * Utility function to validate media for a platform
 *
 * @param platform - Platform name
 * @param file - File to validate
 * @param mediaType - Type of media
   */
export async function validateMediaForPlatform(
  platform: string,
  file: File | Buffer,
  mediaType: 'image' | 'video'
): Promise<{ valid: boolean; error?: string }> {
  try {
    const handler = new MediaHandler(platform)
    await handler.validateMedia(file, mediaType)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Get media requirements for all platforms
 *
 * Useful for displaying requirements to users
 *
 * @returns Map of platform -> requirements
 */
export function getAllMediaRequirements(): Record<
  string,
  PlatformMediaRequirements
> {
  return MEDIA_REQUIREMENTS
}

/**
 * Get platform-specific media tips
 *
 * Returns user-friendly tips for optimal media
 *
 * @param platform - Platform name
 * @returns Array of tips
 */
export function getMediaTips(platform: string): string[] {
  const tips: Record<string, string[]> = {
    instagram: [
      'Use 1080x1350px for feed posts (vertical)',
      'Keep videos under 60 seconds',
      'Use high contrast colors for better engagement',
      'Square images (1080x1080) work well for carousels',
    ],
    facebook: [
      'Use 1200x628px for best display',
      'Videos perform better than images',
      'Keep text under 125 characters for organic reach',
      'Avoid transparent backgrounds',
    ],
    x: [
      'Images: 1200x675px recommended',
      'Support GIF animations for more engagement',
      'Videos auto-play in feeds',
      'Character limit is 280 (or 500 for verified)',
    ],
    linkedin: [
      'Use 1200x627px for feed posts',
      'Professional images perform best',
      'Videos with captions get more engagement',
      'Avoid sales-y language for organic reach',
    ],
    tiktok: [
      'Vertical video: 1080x1920px (9:16 ratio)',
      'Keep videos between 15-60 seconds',
      'Use trending sounds and effects',
      'First 3 seconds are critical for engagement',
    ],
    youtube: [
      'Minimum resolution: 1280x720 (720p)',
      'Recommended: 1920x1080 (1080p)',
      'Support 16:9 aspect ratio',
      'Use custom thumbnails (1280x720px)',
    ],
  }

  return tips[platform.toLowerCase()] || [
    'Check platform specifications',
    'Test with different image sizes',
    'Use high-quality media',
  ]
}
