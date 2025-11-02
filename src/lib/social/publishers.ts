/**
 * Platform Publishers
 *
 * This module contains platform-specific publishers that handle posting
 * to each social media platform. Each platform has unique requirements:
 *
 * - Instagram: API limited, requires App Review
 * - Facebook: Graph API, supports pages and groups
 * - X/Twitter: API v2, character limits, threading
 * - LinkedIn: Requires OAuth, professional formatting
 * - TikTok: Video-first, trending sounds, effects
 * - YouTube: Video-only, thumbnails, descriptions
 * - Others: Threads, Pinterest, Bluesky, Mastodon, Google Business
 *
 * Each publisher handles:
 * - Platform-specific API calls
 * - Media upload and formatting
 * - Rate limiting
 * - Error handling
 * - Status tracking
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface PublishResult {
  platform: string
  success: boolean
  postId?: string
  url?: string
  message: string
  error?: string
  timestamp: Date
  mediaIds?: string[]
}

export interface PublisherConfig {
  accessToken: string
  accountHandle?: string
  accountId?: string
  refreshToken?: string
}

export interface MediaItem {
  url: string
  type: 'image' | 'video' | 'carousel'
  altText?: string
  duration?: number
}

// ============================================================================
// Abstract Base Publisher
// ============================================================================

/**
 * Base class for all platform publishers
 *
 * Defines the interface that all platform publishers must implement.
 * Each platform extends this and provides its own implementation.
 */
export abstract class Publisher {
  protected config: PublisherConfig
  protected platformName: string

  constructor(config: PublisherConfig, platformName: string) {
    this.config = config
    this.platformName = platformName
  }

  /**
   * Publish a post to the platform
   *
   * @param content - Post text/caption
   * @param media - Array of media items (images, videos)
   * @returns PublishResult with success/failure info
   */
  abstract publish(
    content: string,
    media?: MediaItem[]
  ): Promise<PublishResult>

  /**
   * Check if we can reach the platform (health check)
   *
   * @returns true if API is accessible
   */
  abstract checkConnection(): Promise<boolean>

  /**
   * Get account information (profile name, followers, etc)
   *
   * @returns Account details
   */
  abstract getAccountInfo(): Promise<{
    handle: string
    displayName: string
    followers?: number
    verified?: boolean
  }>

  /**
   * Format content for the platform
   *
   * Each platform has different character limits, emoji support, etc.
   * This method handles platform-specific formatting.
   *
   * @param content - Original content
   * @returns Formatted content
   */
  protected formatContent(content: string): string {
    return content
  }

  /**
   * Validate media for the platform
   *
   * Check file sizes, formats, dimensions, etc.
   *
   * @param media - Media items to validate
   * @throws Error if validation fails
   */
  protected abstract validateMedia(media?: MediaItem[]): Promise<void>

  /**
   * Handle generic errors and return user-friendly messages
   *
   * @param error - The error object
   * @returns Formatted error message
   */
  protected handleError(error: any): string {
    if (error instanceof Error) {
      return error.message
    }
    return String(error)
  }
}

// ============================================================================
// Instagram Publisher
// ============================================================================

/**
 * Instagram Publisher
 *
 * Publishes to Instagram Feed and Stories via Meta Graph API.
 * Requires App Review and proper permissions.
 *
 * Note: Direct story posting is limited. Feed posting requires
 * proper media upload and formatting.
 */
export class InstagramPublisher extends Publisher {
  async publish(
    content: string,
    media?: MediaItem[]
  ): Promise<PublishResult> {
    try {
      await this.validateMedia(media)

      const formattedContent = this.formatContent(content)

      // Instagram Feed requires media_type and media_url
      const mediaIds = media ? await this.uploadMedia(media) : []

      const payload: any = {
        caption: formattedContent,
      }

      if (mediaIds.length > 0) {
        if (mediaIds.length === 1) {
          // Single image or video
          payload.media_type = media![0].type === 'video' ? 'VIDEO' : 'IMAGE'
          payload.media_url = media![0].url
        } else {
          // Carousel
          payload.media_type = 'CAROUSEL'
          payload.children = mediaIds
        }
      }

      // Call Instagram Graph API
      const response = await fetch(
        `https://graph.instagram.com/v18.0/${this.config.accountId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Instagram API error')
      }

      const result = await response.json()

      return {
        platform: 'instagram',
        success: true,
        postId: result.id,
        url: `https://instagram.com/p/${result.id}`,
        message: 'Posted to Instagram',
        timestamp: new Date(),
      }
    } catch (error) {
      return {
        platform: 'instagram',
        success: false,
        message: 'Failed to post to Instagram',
        error: this.handleError(error),
        timestamp: new Date(),
      }
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me?fields=id,username&access_token=${this.config.accessToken}`
      )
      return response.ok
    } catch {
      return false
    }
  }

  async getAccountInfo(): Promise<{
    handle: string
    displayName: string
  }> {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${this.config.accessToken}`
    )
    const data = await response.json()
    return {
      handle: data.username,
      displayName: data.username,
    }
  }

  protected async validateMedia(media?: MediaItem[]): Promise<void> {
    if (!media || media.length === 0) return

    for (const item of media) {
      // Instagram limits: single image 1080x1350, max 8 in carousel
      if (media.length > 8) {
        throw new Error('Instagram carousel limited to 8 images')
      }
      // Additional validation...
    }
  }

  private async uploadMedia(media: MediaItem[]): Promise<string[]> {
    // Implementation for uploading media to Instagram
    return []
  }

  protected formatContent(content: string): string {
    // Instagram caption can be up to 2200 characters
    if (content.length > 2200) {
      return content.substring(0, 2197) + '...'
    }
    return content
  }
}

// ============================================================================
// Facebook Publisher
// ============================================================================

/**
 * Facebook Publisher
 *
 * Publishes to Facebook Pages via Meta Graph API.
 * Supports posts, photos, videos, and links.
 */
export class FacebookPublisher extends Publisher {
  async publish(
    content: string,
    media?: MediaItem[]
  ): Promise<PublishResult> {
    try {
      await this.validateMedia(media)

      const payload: any = {
        message: this.formatContent(content),
      }

      // Add media if provided
      if (media && media.length > 0) {
        if (media[0].type === 'video') {
          payload.source = media[0].url
          payload.type = 'video'
        } else {
          payload.source = media[0].url
          payload.type = 'photo'
        }
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.config.accountId}/feed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Facebook API error')
      }

      const result = await response.json()

      return {
        platform: 'facebook',
        success: true,
        postId: result.id,
        url: `https://facebook.com/${result.id}`,
        message: 'Posted to Facebook',
        timestamp: new Date(),
      }
    } catch (error) {
      return {
        platform: 'facebook',
        success: false,
        message: 'Failed to post to Facebook',
        error: this.handleError(error),
        timestamp: new Date(),
      }
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name&access_token=${this.config.accessToken}`
      )
      return response.ok
    } catch {
      return false
    }
  }

  async getAccountInfo(): Promise<{
    handle: string
    displayName: string
  }> {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name&access_token=${this.config.accessToken}`
    )
    const data = await response.json()
    return {
      handle: data.id,
      displayName: data.name,
    }
  }

  protected async validateMedia(media?: MediaItem[]): Promise<void> {
    if (!media || media.length === 0) return
    // Facebook allows single image or video
    if (media.length > 1) {
      throw new Error('Facebook posts support only one media item')
    }
  }

  protected formatContent(content: string): string {
    // Facebook supports up to 63206 characters
    return content
  }
}

// ============================================================================
// X/Twitter Publisher
// ============================================================================

/**
 * X/Twitter Publisher
 *
 * Publishes posts/tweets to X (formerly Twitter) via API v2.
 * Supports text, images, videos, and reply threading.
 */
export class XPublisher extends Publisher {
  async publish(
    content: string,
    media?: MediaItem[]
  ): Promise<PublishResult> {
    try {
      await this.validateMedia(media)

      const formattedContent = this.formatContent(content)

      const payload: any = {
        text: formattedContent,
      }

      // Add media if provided
      if (media && media.length > 0) {
        const mediaIds = await this.uploadMedia(media)
        payload.media = {
          media_ids: mediaIds,
        }
      }

      const response = await fetch(
        'https://api.twitter.com/2/tweets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.errors?.[0]?.message || 'X API error')
      }

      const result = await response.json()

      return {
        platform: 'x',
        success: true,
        postId: result.data.id,
        url: `https://x.com/${this.config.accountHandle}/status/${result.data.id}`,
        message: 'Posted to X',
        timestamp: new Date(),
      }
    } catch (error) {
      return {
        platform: 'x',
        success: false,
        message: 'Failed to post to X',
        error: this.handleError(error),
        timestamp: new Date(),
      }
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        'https://api.twitter.com/2/tweets/search/recent?query=from:me&max_results=10',
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
          },
        }
      )
      return response.ok
    } catch {
      return false
    }
  }

  async getAccountInfo(): Promise<{
    handle: string
    displayName: string
  }> {
    const response = await fetch(
      'https://api.twitter.com/2/users/me',
      {
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
        },
      }
    )
    const data = await response.json()
    return {
      handle: data.data.username,
      displayName: data.data.name,
    }
  }

  protected async validateMedia(media?: MediaItem[]): Promise<void> {
    if (!media || media.length === 0) return
    // X supports up to 4 images or 1 video
    if (media.length > 4) {
      throw new Error('X supports maximum 4 images per tweet')
    }
  }

  private async uploadMedia(media: MediaItem[]): Promise<string[]> {
    // Implementation for uploading media to X
    return []
  }

  protected formatContent(content: string): string {
    // X tweet limit is 280 characters (or 280 for most, more for verified)
    if (content.length > 280) {
      // Could implement thread logic here
      return content.substring(0, 277) + '...'
    }
    return content
  }
}

// ============================================================================
// LinkedIn Publisher
// ============================================================================

/**
 * LinkedIn Publisher
 *
 * Publishes posts to LinkedIn profiles or pages via LinkedIn API.
 * Supports professional formatting and media.
 */
export class LinkedInPublisher extends Publisher {
  async publish(
    content: string,
    media?: MediaItem[]
  ): Promise<PublishResult> {
    try {
      await this.validateMedia(media)

      const payload: any = {
        commentary: this.formatContent(content),
        visibility: {
          'com.linkedin.ugc.visibility.MemberNetworkVisibility': 'PUBLIC',
        },
      }

      // Add media if provided
      if (media && media.length > 0) {
        const assetId = await this.uploadMedia(media[0])
        payload.content = {
          media: {
            id: assetId,
          },
        }
      }

      const response = await fetch(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'LinkedIn API error')
      }

      const result = await response.json()

      return {
        platform: 'linkedin',
        success: true,
        postId: result.id,
        url: `https://linkedin.com/feed/update/${result.id}`,
        message: 'Posted to LinkedIn',
        timestamp: new Date(),
      }
    } catch (error) {
      return {
        platform: 'linkedin',
        success: false,
        message: 'Failed to post to LinkedIn',
        error: this.handleError(error),
        timestamp: new Date(),
      }
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        'https://api.linkedin.com/v2/me',
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
          },
        }
      )
      return response.ok
    } catch {
      return false
    }
  }

  async getAccountInfo(): Promise<{
    handle: string
    displayName: string
  }> {
    const response = await fetch(
      'https://api.linkedin.com/v2/me',
      {
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
        },
      }
    )
    const data = await response.json()
    return {
      handle: data.id,
      displayName: `${data.localizedFirstName} ${data.localizedLastName}`,
    }
  }

  protected async validateMedia(media?: MediaItem[]): Promise<void> {
    if (!media || media.length === 0) return
    if (media.length > 1) {
      throw new Error('LinkedIn posts support only one media item')
    }
  }

  private async uploadMedia(media: MediaItem): Promise<string> {
    // Implementation for uploading media to LinkedIn
    return ''
  }

  protected formatContent(content: string): string {
    // LinkedIn is professional, supports long-form content
    return content
  }
}

// ============================================================================
// Other Platform Stubs
// ============================================================================

/**
 * TikTok Publisher - Stub (requires additional setup)
 */
export class TikTokPublisher extends Publisher {
  async publish(): Promise<PublishResult> {
    return {
      platform: 'tiktok',
      success: false,
      message: 'TikTok publishing not yet implemented',
      error: 'Requires server-side implementation',
      timestamp: new Date(),
    }
  }

  async checkConnection(): Promise<boolean> {
    return false
  }

  async getAccountInfo(): Promise<{ handle: string; displayName: string }> {
    return { handle: '', displayName: '' }
  }

  protected async validateMedia(): Promise<void> {}

  protected formatContent(content: string): string {
    return content
  }
}

/**
 * YouTube Publisher - Stub
 */
export class YouTubePublisher extends Publisher {
  async publish(): Promise<PublishResult> {
    return {
      platform: 'youtube',
      success: false,
      message: 'YouTube publishing not yet implemented',
      error: 'Requires video upload API',
      timestamp: new Date(),
    }
  }

  async checkConnection(): Promise<boolean> {
    return false
  }

  async getAccountInfo(): Promise<{ handle: string; displayName: string }> {
    return { handle: '', displayName: '' }
  }

  protected async validateMedia(): Promise<void> {}

  protected formatContent(content: string): string {
    return content
  }
}

/**
 * Threads Publisher - Stub
 */
export class ThreadsPublisher extends Publisher {
  async publish(): Promise<PublishResult> {
    return {
      platform: 'threads',
      success: false,
      message: 'Threads publishing not yet implemented',
      error: 'Requires Threads API',
      timestamp: new Date(),
    }
  }

  async checkConnection(): Promise<boolean> {
    return false
  }

  async getAccountInfo(): Promise<{ handle: string; displayName: string }> {
    return { handle: '', displayName: '' }
  }

  protected async validateMedia(): Promise<void> {}

  protected formatContent(content: string): string {
    return content
  }
}

/**
 * Pinterest Publisher - Stub
 */
export class PinterestPublisher extends Publisher {
  async publish(): Promise<PublishResult> {
    return {
      platform: 'pinterest',
      success: false,
      message: 'Pinterest publishing not yet implemented',
      error: 'Requires Pinterest API',
      timestamp: new Date(),
    }
  }

  async checkConnection(): Promise<boolean> {
    return false
  }

  async getAccountInfo(): Promise<{ handle: string; displayName: string }> {
    return { handle: '', displayName: '' }
  }

  protected async validateMedia(): Promise<void> {}

  protected formatContent(content: string): string {
    return content
  }
}

/**
 * Bluesky Publisher - Stub
 */
export class BlueskyPublisher extends Publisher {
  async publish(): Promise<PublishResult> {
    return {
      platform: 'bluesky',
      success: false,
      message: 'Bluesky publishing not yet implemented',
      error: 'Requires Bluesky API',
      timestamp: new Date(),
    }
  }

  async checkConnection(): Promise<boolean> {
    return false
  }

  async getAccountInfo(): Promise<{ handle: string; displayName: string }> {
    return { handle: '', displayName: '' }
  }

  protected async validateMedia(): Promise<void> {}

  protected formatContent(content: string): string {
    return content
  }
}

/**
 * Mastodon Publisher - Stub
 */
export class MastodonPublisher extends Publisher {
  async publish(): Promise<PublishResult> {
    return {
      platform: 'mastodon',
      success: false,
      message: 'Mastodon publishing not yet implemented',
      error: 'Requires Mastodon API',
      timestamp: new Date(),
    }
  }

  async checkConnection(): Promise<boolean> {
    return false
  }

  async getAccountInfo(): Promise<{ handle: string; displayName: string }> {
    return { handle: '', displayName: '' }
  }

  protected async validateMedia(): Promise<void> {}

  protected formatContent(content: string): string {
    return content
  }
}

/**
 * Google Business Publisher - Stub
 */
export class GoogleBusinessPublisher extends Publisher {
  async publish(): Promise<PublishResult> {
    return {
      platform: 'google_business',
      success: false,
      message: 'Google Business publishing not yet implemented',
      error: 'Requires Google My Business API',
      timestamp: new Date(),
    }
  }

  async checkConnection(): Promise<boolean> {
    return false
  }

  async getAccountInfo(): Promise<{ handle: string; displayName: string }> {
    return { handle: '', displayName: '' }
  }

  protected async validateMedia(): Promise<void> {}

  protected formatContent(content: string): string {
    return content
  }
}

// ============================================================================
// Publisher Factory
// ============================================================================

/**
 * Create a publisher for a specific platform
 *
 * @param platform - Platform name (instagram, facebook, x, etc)
 * @param config - OAuth token and account info
 * @returns Platform-specific publisher instance
 * @throws Error if platform not supported
 */
export function createPublisher(
  platform: string,
  config: PublisherConfig
): Publisher {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return new InstagramPublisher(config, 'instagram')
    case 'facebook':
      return new FacebookPublisher(config, 'facebook')
    case 'x':
    case 'twitter':
      return new XPublisher(config, 'x')
    case 'linkedin':
      return new LinkedInPublisher(config, 'linkedin')
    case 'tiktok':
      return new TikTokPublisher(config, 'tiktok')
    case 'youtube':
      return new YouTubePublisher(config, 'youtube')
    case 'threads':
      return new ThreadsPublisher(config, 'threads')
    case 'pinterest':
      return new PinterestPublisher(config, 'pinterest')
    case 'bluesky':
      return new BlueskyPublisher(config, 'bluesky')
    case 'mastodon':
      return new MastodonPublisher(config, 'mastodon')
    case 'google_business':
      return new GoogleBusinessPublisher(config, 'google_business')
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}
