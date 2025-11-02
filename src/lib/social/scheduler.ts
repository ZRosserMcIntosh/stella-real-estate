/**
 * Social Media Post Scheduler Service
 *
 * This module handles the timing and triggering of post publishing.
 * It's like an alarm clock that wakes up at the right time and says
 * "time to publish this post!"
 *
 * How it works:
 * 1. When a post is scheduled, we store the scheduled time in the database
 * 2. A background process periodically checks for posts that should publish
 * 3. When it finds a post whose time has arrived, it moves it to the queue
 * 4. The job queue then publishes the post
 *
 * Key Features:
 * - Timezone awareness: Schedules respect the user's timezone
 * - Batching: Processes multiple posts at once for efficiency
 * - Retry logic: Handles failures gracefully
 * - Logging: Tracks all scheduling activity
 */

import { prisma } from '../prisma'
import { publishQueue, addPublishJob } from './queue'
import { updatePostStatus } from './posts'
import type { SocialPost } from '../../types/social'

// ============================================================================
// Scheduling Service
// ============================================================================

/**
 * Configuration for the scheduler
 */
const SCHEDULER_CONFIG = {
  // How often to check for posts ready to publish (in milliseconds)
  CHECK_INTERVAL: 60000, // Every 60 seconds
  // How many posts to process in each batch
  BATCH_SIZE: 50,
  // Buffer time before scheduled time (in seconds)
  // This prevents publishing posts that are almost due but not quite
  TIME_BUFFER: 5,
}

/**
 * Global reference to the scheduler interval
 * Used to start/stop the scheduler
 */
let schedulerInterval: NodeJS.Timeout | null = null

// ============================================================================
// Time Utility Functions
// ============================================================================

/**
 * Convert a date from UTC to a specific timezone
 *
 * Example: If a user in New York scheduled a post for "2:00 PM EST",
 * we convert UTC time to their timezone to know when to actually publish.
 *
 * @param utcDate - The date in UTC
 * @param timezone - IANA timezone string (e.g., 'America/New_York')
 * @returns The date as it appears in that timezone
 *
 * @example
 * const utc = new Date('2025-11-02T18:00:00Z')
 * const ny = convertToTimezone(utc, 'America/New_York')
 * // Returns the same moment in time, but adjusted for NY timezone
 */
export function convertToTimezone(utcDate: Date, timezone: string): Date {
  try {
    // Use JavaScript's built-in timezone conversion
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const parts = formatter.formatToParts(utcDate)
    const result: any = {}

    parts.forEach((part) => {
      result[part.type] = part.value
    })

    return new Date(
      `${result.year}-${result.month}-${result.day}T${result.hour}:${result.minute}:${result.second}`
    )
  } catch (error) {
    console.error(`Failed to convert to timezone ${timezone}:`, error)
    return utcDate
  }
}

/**
 * Check if it's time to publish a post based on its scheduled time
 *
 * This compares the current time (in the post's timezone) with the
 * scheduled time. If they match (within a few seconds), it's time to publish.
 *
 * The time buffer prevents us from missing posts or publishing too early.
 *
 * @param scheduledAt - When the post should be published
 * @param timezone - User's timezone
 * @returns true if it's time to publish
 *
 * @example
 * const scheduled = new Date('2025-11-02T14:00:00')
 * const isTime = isTimeToPublish(scheduled, 'America/Los_Angeles')
 * if (isTime) {
 *   console.log('Time to publish!')
 * }
 */
export function isTimeToPublish(
  scheduledAt: Date,
  timezone: string = 'UTC'
): boolean {
  const now = new Date()
  const nowInTimezone = convertToTimezone(now, timezone)

  // Calculate difference in seconds
  const differenceSeconds = Math.abs(
    (scheduledAt.getTime() - nowInTimezone.getTime()) / 1000
  )

  // Publish if within buffer time (default 5 seconds before scheduled time)
  return differenceSeconds <= SCHEDULER_CONFIG.TIME_BUFFER
}

/**
 * Get the time difference until a post should be published
 *
 * Calculates how long until the post's scheduled time arrives.
 * Returns negative number if post is overdue.
 *
 * @param scheduledAt - When the post should be published
 * @param timezone - User's timezone
 * @returns Seconds until publish time (negative if overdue)
 *
 * @example
 * const scheduled = new Date()
 * scheduled.setHours(scheduled.getHours() + 2)
 * const secondsUntil = getTimeUntilPublish(scheduled, 'America/New_York')
 * console.log(`Post will publish in ${secondsUntil} seconds`)
 */
export function getTimeUntilPublish(
  scheduledAt: Date,
  timezone: string = 'UTC'
): number {
  const now = new Date()
  const nowInTimezone = convertToTimezone(now, timezone)

  return Math.round((scheduledAt.getTime() - nowInTimezone.getTime()) / 1000)
}

// ============================================================================
// Scheduler Core Functions
// ============================================================================

/**
 * Check for posts ready to publish and add them to the job queue
 *
 * This is the main function that runs periodically. It:
 * 1. Finds all scheduled posts whose time has arrived
 * 2. Adds them to the job queue for publishing
 * 3. Updates their status to 'queued'
 * 4. Logs any errors
 *
 * This function is called automatically by the scheduler every 60 seconds.
 *
 * @returns Object with statistics about posts processed
 *
 * @example
 * const result = await checkAndQueueScheduledPosts()
 * console.log(`Queued ${result.queued} posts`)
 * console.log(`${result.errors} errors`)
 */
export async function checkAndQueueScheduledPosts(): Promise<{
  queued: number
  failed: number
  errors: string[]
}> {
  try {
    console.log('[Scheduler] Checking for scheduled posts...')

    // Find all scheduled posts
    const scheduledPosts = await prisma.socialPost.findMany({
      where: {
        status: 'scheduled',
        scheduledAt: { not: null },
        postedAt: null,
      },
      orderBy: { scheduledAt: 'asc' },
      take: SCHEDULER_CONFIG.BATCH_SIZE,
    })

    console.log(`[Scheduler] Found ${scheduledPosts.length} scheduled posts`)

    const result = {
      queued: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each post
    for (const post of scheduledPosts) {
      try {
        // Check if it's time to publish
        if (isTimeToPublish(post.scheduledAt!, post.timezone || 'UTC')) {
          // Add to job queue
          const job = await addPublishJob(post as SocialPost)

          // Update post status to queued
          await updatePostStatus(post.id, 'queued')

          console.log(`[Scheduler] Queued post ${post.id} (job: ${job.id})`)
          result.queued++
        } else {
          // Not time yet
          const secondsUntil = getTimeUntilPublish(
            post.scheduledAt!,
            post.timezone || 'UTC'
          )
          console.log(
            `[Scheduler] Post ${post.id} scheduled in ${secondsUntil} seconds`
          )
        }
      } catch (error) {
        result.failed++
        const errorMsg = `Failed to queue post ${post.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`[Scheduler] ${errorMsg}`)
        result.errors.push(errorMsg)

        // Mark post as failed
        try {
          await updatePostStatus(
            post.id,
            'failed',
            `Scheduler error: ${error instanceof Error ? error.message : 'Unknown error'}`
          )
        } catch (updateError) {
          console.error(`[Scheduler] Failed to update post status:`, updateError)
        }
      }
    }

    console.log(`[Scheduler] Processing complete:`, result)
    return result
  } catch (error) {
    console.error('[Scheduler] Error in checkAndQueueScheduledPosts:', error)
    return {
      queued: 0,
      failed: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Start the scheduler
 *
 * This begins the periodic checking process. Every 60 seconds, it looks
 * for posts that should be published and queues them.
 *
 * Should be called once when the application starts.
 *
 * @example
 * startScheduler()
 * console.log('Scheduler started')
 *
 * @example
 * // On application startup
 * if (process.env.NODE_ENV === 'production') {
 *   startScheduler()
 * }
 */
export function startScheduler(): void {
  if (schedulerInterval) {
    console.log('[Scheduler] Scheduler already running')
    return
  }

  console.log('[Scheduler] Starting scheduler...')

  // Run immediately on start
  checkAndQueueScheduledPosts().catch((error) => {
    console.error('[Scheduler] Initial check failed:', error)
  })

  // Then run periodically
  schedulerInterval = setInterval(() => {
    checkAndQueueScheduledPosts().catch((error) => {
      console.error('[Scheduler] Periodic check failed:', error)
    })
  }, SCHEDULER_CONFIG.CHECK_INTERVAL)

  console.log(
    `[Scheduler] Scheduler started (checking every ${SCHEDULER_CONFIG.CHECK_INTERVAL / 1000} seconds)`
  )
}

/**
 * Stop the scheduler
 *
 * This stops the periodic checking process. No more posts will be
 * queued for publishing. Use this during maintenance or shutdown.
 *
 * @example
 * stopScheduler()
 * console.log('Scheduler stopped')
 */
export function stopScheduler(): void {
  if (!schedulerInterval) {
    console.log('[Scheduler] Scheduler not running')
    return
  }

  clearInterval(schedulerInterval)
  schedulerInterval = null
  console.log('[Scheduler] Scheduler stopped')
}

/**
 * Check if the scheduler is currently running
 *
 * @returns true if scheduler is active, false otherwise
 *
 * @example
 * if (isSchedulerRunning()) {
 *   console.log('Scheduler is active')
 * }
 */
export function isSchedulerRunning(): boolean {
  return schedulerInterval !== null
}

/**
 * Manually trigger scheduler check
 *
 * This forces an immediate check without waiting for the next interval.
 * Useful for testing or forcing an immediate publish check.
 *
 * @returns Statistics about posts processed
 *
 * @example
 * const result = await triggerSchedulerCheck()
 * console.log(`Manually queued ${result.queued} posts`)
 */
export async function triggerSchedulerCheck(): Promise<{
  queued: number
  failed: number
  errors: string[]
}> {
  console.log('[Scheduler] Manual trigger: Running immediate check...')
  return await checkAndQueueScheduledPosts()
}

/**
 * Update the check interval
 *
 * Changes how frequently the scheduler looks for posts to publish.
 * For example, change from 60 seconds to 30 seconds for faster updates.
 *
 * Must be a positive number of milliseconds.
 *
 * @param intervalMs - New interval in milliseconds
 * @throws Error if interval is invalid
 *
 * @example
 * // Check every 30 seconds instead of 60
 * updateSchedulerInterval(30000)
 *
 * // Check more frequently in production
 * updateSchedulerInterval(10000)
 */
export function updateSchedulerInterval(intervalMs: number): void {
  if (intervalMs <= 0) {
    throw new Error('Interval must be positive')
  }

  if (schedulerInterval) {
    stopScheduler()
  }

  // Update config
  ;(SCHEDULER_CONFIG as any).CHECK_INTERVAL = intervalMs

  // Restart scheduler with new interval
  startScheduler()

  console.log(
    `[Scheduler] Interval updated to ${intervalMs / 1000} seconds`
  )
}

/**
 * Get scheduler statistics
 *
 * Returns information about the scheduler's current state and recent activity.
 * Useful for monitoring and debugging.
 *
 * @returns Object with scheduler stats
 *
 * @example
 * const stats = await getSchedulerStats()
 * console.log(`Scheduler running: ${stats.isRunning}`)
 * console.log(`Scheduled posts: ${stats.scheduledPostsCount}`)
 * console.log(`Queued posts: ${stats.queuedPostsCount}`)
 */
export async function getSchedulerStats(): Promise<{
  isRunning: boolean
  checkIntervalMs: number
  scheduledPostsCount: number
  queuedPostsCount: number
  failedPostsCount: number
  publishedPostsCount: number
}> {
  const [scheduled, queued, failed, published] = await Promise.all([
    prisma.socialPost.count({ where: { status: 'scheduled' } }),
    prisma.socialPost.count({ where: { status: 'queued' } }),
    prisma.socialPost.count({ where: { status: 'failed' } }),
    prisma.socialPost.count({ where: { status: 'published' } }),
  ])

  return {
    isRunning: isSchedulerRunning(),
    checkIntervalMs: SCHEDULER_CONFIG.CHECK_INTERVAL,
    scheduledPostsCount: scheduled,
    queuedPostsCount: queued,
    failedPostsCount: failed,
    publishedPostsCount: published,
  }
}

/**
 * Retry a failed post
 *
 * If a post failed to publish (status = 'failed'), this function
 * gives it another chance. It updates the post status back to 'scheduled'
 * so it will be picked up by the scheduler again.
 *
 * @param postId - The ID of the failed post
 * @throws Error if post not found or not in failed state
 *
 * @example
 * try {
 *   await retryFailedPost('post-123')
 *   console.log('Post scheduled for retry')
 * } catch (error) {
 *   console.error('Retry failed:', error)
 * }
 */
export async function retryFailedPost(postId: string): Promise<void> {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error(`Post ${postId} not found`)
  }

  if (post.status !== 'failed') {
    throw new Error(`Post is not in failed state (current: ${post.status})`)
  }

  await prisma.socialPost.update({
    where: { id: postId },
    data: {
      status: 'scheduled',
      failureReason: null,
      updatedAt: new Date(),
    },
  })

  console.log(`[Scheduler] Retrying post ${postId}`)
}
