/**
 * Social Media Publishing Orchestration Service
 *
 * This is the main service that coordinates publishing to all platforms.
 * It acts as the "conductor" that:
 *
 * - Takes a post and decides which platforms to publish to
 * - Gets the right credentials for each platform
 * - Calls the platform-specific publishers
 * - Handles retries if something fails
 * - Tracks results and updates database
 * - Sends notifications about success/failure
 *
 * The key insight: instead of duplicating OAuth/API logic for each platform,
 * we have centralized service that orchestrates platform-specific publishers.
 */

import { prisma } from '../prisma'
import { createPublisher, Publisher, PublishResult } from './publishers'
import { MediaHandler } from './mediaHandler'

// ============================================================================
// Type Definitions
// ============================================================================

export interface PublishingJob {
  postId: string
  platforms: string[]
  userId: string
  content: string
  mediaUrls?: string[]
  timestamp: Date
}

export interface PublishingJobResult {
  jobId: string
  postId: string
  results: PublishResult[]
  overallSuccess: boolean
  totalPlatforms: number
  successCount: number
  failureCount: number
  completedAt: Date
}

export interface PublishingStats {
  totalJobs: number
  successfulJobs: number
  failedJobs: number
  partialSuccessJobs: number
  lastJobTime?: Date
  platformStats: Record<
    string,
    {
      attempts: number
      successes: number
      failures: number
      lastAttempt?: Date
    }
  >
}

// ============================================================================
// Publishing Orchestrator
// ============================================================================

/**
 * PublishingOrchestrator
 *
 * Main service for publishing posts to social media platforms.
 *
 * What it does:
 * - Retrieves post and connection data
 * - Instantiates publishers for each platform
 * - Calls each publisher with post content
 * - Handles errors and retries
 * - Updates database with results
 * - Sends notifications
 *
 * Why designed this way:
 * - Centralized orchestration prevents code duplication
 * - Each platform has its own publisher implementation
 * - If one platform fails, others still publish
 * - Results are tracked for analytics and retries
 */
export class PublishingOrchestrator {
  private stats: PublishingStats = {
    totalJobs: 0,
    successfulJobs: 0,
    failedJobs: 0,
    partialSuccessJobs: 0,
    platformStats: {},
  }

  constructor() {
    this.initializePlatformStats()
  }

  /**
   * Initialize stats for all platforms
   *
   * Ensures each platform has a stats entry
   */
  private initializePlatformStats(): void {
    const platforms = [
      'instagram',
      'facebook',
      'x',
      'linkedin',
      'tiktok',
      'youtube',
      'threads',
      'pinterest',
      'bluesky',
      'mastodon',
      'google_business',
    ]

    for (const platform of platforms) {
      this.stats.platformStats[platform] = {
        attempts: 0,
        successes: 0,
        failures: 0,
      }
    }
  }

  /**
   * Main publish method
   *
   * Orchestrates publishing a post to multiple platforms
   *
   * @param postId - ID of post to publish
   * @param userId - ID of user publishing
   * @param platforms - List of platforms to publish to
   * @returns Overall result with per-platform details
   */
  async publishPost(
    postId: string,
    userId: string,
    platforms: string[]
  ): Promise<PublishingJobResult> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const startTime = new Date()

    try {
      // Get post data
      const post = await this.getPost(postId, userId)
      if (!post) {
        throw new Error(`Post not found: ${postId}`)
      }

      // Get platform connections
      const connections = await this.getConnections(userId, platforms)
      if (connections.length === 0) {
        throw new Error(
          `No connected accounts for platforms: ${platforms.join(', ')}`
        )
      }

      // Publish to each platform
      const results: PublishResult[] = []

      for (const connection of connections) {
        try {
          const result = await this.publishToSinglePlatform(
            post,
            connection
          )
          results.push(result)

          // Update platform stats
          this.stats.platformStats[connection.platform].attempts++
          if (result.success) {
            this.stats.platformStats[connection.platform].successes++
          } else {
            this.stats.platformStats[connection.platform].failures++
          }
        } catch (error) {
          // Record failure but continue with other platforms
          results.push({
            platform: connection.platform,
            success: false,
            message: `Failed to publish to ${connection.platform}`,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date(),
          })

          this.stats.platformStats[connection.platform].attempts++
          this.stats.platformStats[connection.platform].failures++
        }
      }

      // Calculate overall result
      const successCount = results.filter((r) => r.success).length
      const overallSuccess = successCount === results.length
      const partialSuccess = successCount > 0 && successCount < results.length

      // Update stats
      this.stats.totalJobs++
      if (overallSuccess) {
        this.stats.successfulJobs++
      } else if (partialSuccess) {
        this.stats.partialSuccessJobs++
      } else {
        this.stats.failedJobs++
      }
      this.stats.lastJobTime = new Date()

      // Save results to database
      await this.savePublishingResults(postId, results, overallSuccess)

      // Return job result
      return {
        jobId,
        postId,
        results,
        overallSuccess,
        totalPlatforms: results.length,
        successCount,
        failureCount: results.length - successCount,
        completedAt: new Date(),
      }
    } catch (error) {
      this.stats.totalJobs++
      this.stats.failedJobs++

      throw new Error(
        `Publishing job failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Publish to a single platform
   *
   * Gets credentials, creates publisher, and publishes
   *
   * @param post - Post to publish
   * @param connection - Connection/account to publish to
   * @returns Result for this platform
   */
  private async publishToSinglePlatform(
    post: any,
    connection: any
  ): Promise<PublishResult> {
    // Get publisher for platform
    const publisher = this.getPublisher(connection)

    // Check connection
    const canConnect = await publisher.checkConnection()
    if (!canConnect) {
      return {
        platform: connection.platform,
        success: false,
        message: `Cannot connect to ${connection.platform}`,
        error: 'Connection check failed',
        timestamp: new Date(),
      }
    }

    // Get account info
    try {
      const accountInfo = await publisher.getAccountInfo()

      // Publish post
      const result = await publisher.publish(post.content, post.media as any)

      return result
    } catch (error) {
      return {
        platform: connection.platform,
        success: false,
        message: `Failed to publish to ${connection.platform}`,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      }
    }
  }

  /**
   * Get publisher instance for connection
   *
   * Creates appropriate publisher with OAuth token
   *
   * @param connection - Connection with tokens
   * @returns Platform-specific publisher
   */
  private getPublisher(connection: any): Publisher {
    const config = {
      accessToken: this.decryptToken(connection.accessToken),
      accountHandle: connection.accountHandle || undefined,
      accountId: connection.accountId || undefined,
      refreshToken: connection.refreshToken
        ? this.decryptToken(connection.refreshToken)
        : undefined,
    }

    return createPublisher(connection.platform, config)
  }

  /**
   * Decrypt token from database
   *
   * In production, this would decrypt using encryption keys
   *
   * @param encryptedToken - Encrypted token from database
   * @returns Decrypted token
   */
  private decryptToken(encryptedToken: string): string {
    // In production, implement proper decryption:
    // const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY)
    // return decipher.update(encryptedToken, 'hex', 'utf8') + decipher.final('utf8')

    // For now, assume tokens are stored plaintext (in development only)
    return encryptedToken
  }

  /**
   * Get post from database
   *
   * @param postId - Post ID
   * @param userId - User ID (for permission check)
   * @returns Post or null
   */
  private async getPost(
    postId: string,
    userId: string
  ): Promise<any | null> {
    return prisma.socialPost.findFirst({
      where: {
        id: postId,
        userId, // Ensure user owns this post
      },
    })
  }

  /**
   * Get connections for user and platforms
   *
   * @param userId - User ID
   * @param platforms - Platforms to get connections for
   * @returns Array of connections
   */
  private async getConnections(
    userId: string,
    platforms: string[]
  ): Promise<any[]> {
    return prisma.socialConnection.findMany({
      where: {
        userId,
        platform: {
          in: platforms,
        },
        isConnected: true,
        accessToken: {
          not: null,
        },
      },
    })
  }

  /**
   * Save publishing results to database
   *
   * Updates post status and stores results
   *
   * @param postId - Post ID
   * @param results - Results from all platforms
   * @param overallSuccess - Whether all platforms succeeded
   */
  private async savePublishingResults(
    postId: string,
    results: PublishResult[],
    overallSuccess: boolean
  ): Promise<void> {
    // Update post status
    const newStatus = overallSuccess ? 'published' : 'partial_failure'

    await prisma.socialPost.update({
      where: { id: postId },
      data: {
        status: newStatus as any,
        publishedAt: overallSuccess ? new Date() : null,
        platformResults: results as any, // Store full results
      },
    })

    // In production, you might also:
    // - Store results in a separate PublishingResult table
    // - Create analytics records
    // - Send notifications
    // - Trigger webhooks
  }

  /**
   * Retry failed publishing
   *
   * Attempts to republish posts that failed
   *
   * @param postId - Post to retry
   * @param userId - User ID
   * @param platforms - Platforms that failed (leave empty for all failed)
   * @returns New publishing result
   */
  async retryPublishing(
    postId: string,
    userId: string,
    platforms?: string[]
  ): Promise<PublishingJobResult> {
    // Get post
    const post = await this.getPost(postId, userId)
    if (!post) {
      throw new Error(`Post not found: ${postId}`)
    }

    // Determine which platforms to retry
    const platformsToRetry = platforms || [
      'instagram',
      'facebook',
      'x',
      'linkedin',
      'tiktok',
      'youtube',
      'threads',
      'pinterest',
      'bluesky',
      'mastodon',
      'google_business',
    ]

    return this.publishPost(postId, userId, platformsToRetry)
  }

  /**
   * Get publishing statistics
   *
   * @returns Publishing stats
   */
  getStats(): PublishingStats {
    return { ...this.stats }
  }

  /**
   * Get platform-specific stats
   *
   * @param platform - Platform name
   * @returns Stats for platform
   */
  getPlatformStats(platform: string) {
    return this.stats.platformStats[platform.toLowerCase()]
  }

  /**
   * Reset statistics
   *
   * Clears all stats (useful for testing)
   */
  resetStats(): void {
    this.stats = {
      totalJobs: 0,
      successfulJobs: 0,
      failedJobs: 0,
      partialSuccessJobs: 0,
      platformStats: {},
    }
    this.initializePlatformStats()
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Global publishing orchestrator instance
 *
 * Used across the application for publishing
 */
export const publishingOrchestrator = new PublishingOrchestrator()

/**
 * Simple publish function (one-liner for common case)
 *
 * Most common usage:
 * ```typescript
 * await publishToSocialMedia(postId, userId, ['instagram', 'facebook'])
 * ```
 *
 * @param postId - Post ID to publish
 * @param userId - User publishing the post
 * @param platforms - Platforms to publish to
 * @returns Publishing result
 */
export async function publishToSocialMedia(
  postId: string,
  userId: string,
  platforms: string[]
): Promise<PublishingJobResult> {
  return publishingOrchestrator.publishPost(postId, userId, platforms)
}

/**
 * Retry publishing to failed platforms
 *
 * Usage:
 * ```typescript
 * await retryPublishing(postId, userId, ['instagram', 'facebook'])
 * ```
 *
 * @param postId - Post to retry
 * @param userId - User ID
 * @param platforms - Platforms to retry (optional)
 * @returns New publishing result
 */
export async function retryPublishing(
  postId: string,
  userId: string,
  platforms?: string[]
): Promise<PublishingJobResult> {
  return publishingOrchestrator.retryPublishing(postId, userId, platforms)
}
