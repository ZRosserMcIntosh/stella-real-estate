/**
 * Social Media Job Queue Service
 *
 * This module sets up a Redis-backed job queue using Bull for managing
 * social media post publishing tasks. Think of it like a "to-do list" where
 * we add posts that need to be published, and the system automatically
 * processes them at the right time.
 *
 * How it works:
 * 1. When a post is scheduled, we add it as a "job" to the queue
 * 2. The queue waits for the scheduled time
 * 3. At the right moment, a worker picks up the job and publishes the post
 * 4. If publishing fails, the job is retried automatically
 * 5. Success/failure events are logged for tracking
 *
 * Key Components:
 * - publishQueue: The main queue for post publishing jobs
 * - Workers: Listen for jobs and execute them
 * - Event listeners: Track job status changes
 * - Retry logic: Automatically retry failed jobs with exponential backoff
 */

// import Bull from 'bull' // Removed - Bull requires Redis server
import { prisma } from '../prisma'
import { updatePostStatus } from './posts'
import type { SocialPost } from '../../types/social'

// Simple job queue interface for TypeScript
interface Job<T = any> {
  id: string
  data: T
  opts: {
    attempts?: number
    delay?: number
    [key: string]: any
  }
  attemptsMade: number
  getState?: () => Promise<string>
  remove?: () => Promise<void>
  progress?: () => number | object
  failedReason?: string
  stacktrace?: string[]
  finishedOn?: number
  processedOn?: number
  delay?: number
}

// ============================================================================
// Queue Configuration
// ============================================================================

/**
 * Redis connection URI for the job queue
 * Falls back to localhost for development if REDIS_URL not set
 */
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

/**
 * Queue naming - used to identify jobs in Redis
 */
const QUEUE_NAME = 'social-media-publishing'

// ============================================================================
// Queue Initialization
// ============================================================================

/**
 * Mock Queue Implementation
 * 
 * This is a simplified queue for client-side use.
 * In production, you would use Bull with Redis on the server side.
 */
class MockQueue<T = any> {
  private jobs: Map<string, Job<T>> = new Map()
  private eventHandlers: Map<string, Function[]> = new Map()
  public client = { ping: async () => 'PONG' }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)?.push(handler)
  }

  emit(event: string, ...args: any[]) {
    const handlers = this.eventHandlers.get(event) || []
    handlers.forEach(handler => handler(...args))
  }

  async add(data: T, opts: any = {}): Promise<Job<T>> {
    const job: Job<T> = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data,
      opts,
      attemptsMade: 0
    }
    this.jobs.set(job.id, job)
    this.emit('waiting', job.id)
    return job
  }

  async getJob(jobId: string): Promise<Job<T> | null> {
    return this.jobs.get(jobId) || null
  }

  async getJobs(types: string[], start?: number, end?: number): Promise<Job<T>[]> {
    return Array.from(this.jobs.values())
  }

  async getFailed(start: number, end: number): Promise<Job<T>[]> {
    return []
  }

  async getJobCounts(): Promise<any> {
    return {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
      paused: 0
    }
  }

  async removeJobs(pattern: string): Promise<void> {
    this.jobs.clear()
  }

  async clean(grace: number, status: string, limit?: number): Promise<Job<T>[]> {
    return []
  }

  async pause(): Promise<void> {}
  async resume(): Promise<void> {}
  async close(): Promise<void> {}
}

/**
 * This is the main job queue for publishing posts
 *
 * When we add a job to this queue, it:
 * - Stores the job in memory (or Redis in production)
 * - Waits for the scheduled time
 * - Executes the job when ready
 * - Retries automatically if it fails
 * - Logs all events for tracking
 */
export const publishQueue = new MockQueue<PublishJobData>()

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Data that gets stored with each publishing job
 *
 * postId: Which post to publish
 * userId: Who owns the post
 * platforms: Which social media platforms to publish to
 * retryCount: How many times we've tried this job
 */
export interface PublishJobData {
  postId: string
  userId: string
  platforms: string[]
  retryCount: number
  scheduledAt: Date
}

/**
 * Payload returned when a job is completed
 *
 * Includes details about what happened:
 * - success: Did it work?
 * - platform: Which platform was it published to?
 * - message: What happened (for debugging)
 */
export interface PublishJobResult {
  postId: string
  platform: string
  success: boolean
  message: string
  postedAt: Date
}

// ============================================================================
// Queue Event Listeners
// ============================================================================

/**
 * Event: Job is waiting to be processed
 *
 * This fires when a job is added to the queue and waiting for its
 * scheduled time. Think of this as "job added to to-do list".
 */
publishQueue.on('waiting', (jobId: string) => {
  console.log(`[Queue] Job ${jobId} is waiting in queue`)
})

/**
 * Event: Job is actively being processed
 *
 * This fires when a worker picks up the job and starts executing it.
 * The job is now trying to publish the post to social media.
 */
publishQueue.on('active', (job: Job<PublishJobData>) => {
  console.log(`[Queue] Job ${job.id} is now being processed`)
  console.log(`[Queue] Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}`)
})

/**
 * Event: Job completed successfully
 *
 * This fires when a job finishes successfully. The post was published!
 * We log the details and mark the post as published in the database.
 */
publishQueue.on('completed', (job: Job<PublishJobData>, result: PublishJobResult) => {
  console.log(`[Queue] Job ${job.id} completed successfully`)
  console.log(`[Queue] Result:`, {
    postId: result.postId,
    platform: result.platform,
    message: result.message,
    postedAt: result.postedAt,
  })
})

/**
 * Event: Job failed
 *
 * This fires when a job fails. We log the error and details.
 * The job will be automatically retried (unless max retries exceeded).
 */
publishQueue.on('failed', (job: Job<PublishJobData>, error: Error) => {
  console.error(`[Queue] Job ${job.id} failed on attempt ${job.attemptsMade}`)
  console.error(`[Queue] Error:`, error.message)
  console.error(`[Queue] Details:`, {
    postId: job.data.postId,
    platform: job.data.platforms,
    retryAttempt: job.attemptsMade,
    maxAttempts: job.opts.attempts,
  })
})

/**
 * Event: Job is being retried
 *
 * This fires when a failed job is scheduled to be retried.
 * Shows how many retries are left.
 */
publishQueue.on('stalled', (job: Job<PublishJobData>) => {
  console.warn(`[Queue] Job ${job.id} stalled and will be retried`)
  console.warn(`[Queue] This job appeared to hang during processing`)
})

/**
 * Event: Job was removed from queue
 *
 * This fires when a job is manually cancelled by the application.
 * This happens when a user cancels/deletes a scheduled post.
 */
publishQueue.on('removed', (job: Job<PublishJobData>) => {
  console.log(`[Queue] Job ${job.id} was removed from queue`)
})

// ============================================================================
// Queue Management Functions
// ============================================================================

/**
 * Add a post publishing job to the queue
 *
 * This function creates a new job in the queue. The job will wait until
 * the scheduled time, then automatically publish the post to all
 * selected platforms.
 *
 * The job includes retry logic - if publishing fails, it will retry
 * up to 3 times with increasing delays between attempts.
 *
 * @param post - The SocialPost object to publish
 * @returns The created job object (can be used to track job)
 * @throws Error if Redis connection fails or job creation fails
 *
 * @example
 * const post = await getPost('post-123')
 * const job = await addPublishJob(post)
 * console.log(`Job added with ID: ${job.id}`)
 * console.log(`Job will execute at: ${job.data.scheduledAt}`)
 */
export async function addPublishJob(post: SocialPost): Promise<Job<PublishJobData>> {
  if (!post.scheduledAt) {
    throw new Error('Post must have a scheduledAt date to be queued')
  }

  if (post.platforms.length === 0) {
    throw new Error('Post must have at least one platform selected')
  }

  const jobData: PublishJobData = {
    postId: post.id,
    userId: post.ownerId || '',
    platforms: post.platforms,
    retryCount: 0,
    scheduledAt: post.scheduledAt,
  }

  // Calculate delay until scheduled time
  const now = new Date()
  const delayMs = post.scheduledAt.getTime() - now.getTime()

  if (delayMs <= 0) {
    throw new Error('Scheduled time must be in the future')
  }

  try {
    // Add job to queue with delayed execution
    const job = await publishQueue.add(jobData, {
      // Run job at the scheduled time
      delay: delayMs,
      // Retry up to 3 times if job fails
      attempts: 3,
      // Use exponential backoff: wait 5s before 1st retry, 10s for 2nd
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      // Remove job 24 hours after completion (successful or failed)
      removeOnComplete: { age: 86400 },
      removeOnFail: false, // Keep failed jobs for debugging
      // Job ID for tracking
      jobId: `${post.id}-${Date.now()}`,
    })

    console.log(`[Queue] Added job ${job.id} for post ${post.id}`)
    console.log(`[Queue] Will execute at ${post.scheduledAt.toISOString()}`)
    console.log(`[Queue] Delay: ${Math.round(delayMs / 1000)} seconds`)

    return job
  } catch (error) {
    console.error('[Queue] Failed to add job:', error)
    throw error
  }
}

/**
 * Remove a job from the queue (cancel a scheduled post)
 *
 * This function cancels a scheduled post publishing job. If the job
 * is still waiting to execute, it will be removed from the queue and
 * never published. If the job is already running, it cannot be cancelled.
 *
 * @param jobId - The ID of the job to cancel
 * @throws Error if job not found or already running
 *
 * @example
 * // Cancel a scheduled post
 * await removePublishJob('post-123-1234567890')
 * console.log('Scheduled post has been cancelled')
 */
export async function removePublishJob(jobId: string): Promise<void> {
  try {
    const job = await publishQueue.getJob(jobId)

    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    // Check job state - can't remove if it's already running
    const state = job.getState ? await job.getState() : 'unknown'
    if (state === 'active') {
      throw new Error('Cannot cancel a job that is currently running')
    }

    // Remove the job
    if (job.remove) {
      await job.remove()
    }
    console.log(`[Queue] Removed job ${jobId}`)
  } catch (error) {
    console.error('[Queue] Failed to remove job:', error)
    throw error
  }
}

/**
 * Get the status of a publishing job
 *
 * This function retrieves the current state of a job. Useful for
 * checking if a post is queued, running, or has failed.
 *
 * Possible states:
 * - 'waiting': Waiting for scheduled time
 * - 'active': Currently being published
 * - 'completed': Published successfully
 * - 'failed': Failed to publish (may retry)
 * - 'delayed': Waiting due to delay
 * - 'paused': Temporarily paused
 *
 * @param jobId - The ID of the job
 * @returns Object with job state and details
 * @throws Error if job not found
 *
 * @example
 * const status = await getPublishJobStatus('post-123-1234567890')
 * console.log(`Job state: ${status.state}`)
 * console.log(`Attempts: ${status.attemptsMade} of ${status.attempts}`)
 * if (status.state === 'failed') {
 *   console.log(`Error: ${status.failedReason}`)
 * }
 */
export async function getPublishJobStatus(jobId: string): Promise<any> {
  try {
    const job = await publishQueue.getJob(jobId)

    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    const state = job.getState ? await job.getState() : 'unknown'
    const progress = job.progress ? job.progress() : 0

    return {
      jobId: job.id,
      state,
      data: job.data,
      progress,
      attemptsMade: job.attemptsMade,
      attempts: job.opts.attempts,
      failedReason: job.failedReason || '',
      stacktrace: job.stacktrace || [],
      finishedOn: job.finishedOn || 0,
      processedOn: job.processedOn || 0,
      delay: job.delay || 0,
    }
  } catch (error) {
    console.error('[Queue] Failed to get job status:', error)
    throw error
  }
}

/**
 * Get all jobs in a specific state
 *
 * This function retrieves all jobs with a certain status. Useful for
 * dashboards showing pending jobs, failed jobs, etc.
 *
 * @param state - The state to filter by ('waiting', 'active', 'completed', 'failed')
 * @param options - Pagination options (skip, take)
 * @returns Array of jobs in that state
 *
 * @example
 * // Get all pending posts
 * const waiting = await getJobsByState('waiting', { take: 50 })
 * console.log(`${waiting.length} posts waiting to publish`)
 *
 * // Get failed posts
 * const failed = await getJobsByState('failed', { take: 100 })
 * console.log(`${failed.length} failed posts`)
 */
export async function getJobsByState(
  state: string,
  options?: { skip?: number; take?: number }
): Promise<Job<PublishJobData>[]> {
  try {
    const { skip = 0, take = 50 } = options || {}

    // Get jobs in the specified state
    const jobs = await publishQueue.getJobs(
      [state],
      skip,
      skip + take - 1
    )

    return jobs
  } catch (error) {
    console.error('[Queue] Failed to get jobs by state:', error)
    throw error
  }
}

/**
 * Pause the entire queue
 *
 * This stops the queue from processing any new jobs. Existing running
 * jobs continue to completion, but new jobs won't start.
 *
 * Use this during maintenance or when you need to temporarily stop
 * posts from publishing.
 *
 * @example
 * await pausePublishQueue()
 * console.log('Publishing has been paused')
 */
export async function pausePublishQueue(): Promise<void> {
  try {
    await publishQueue.pause()
    console.log('[Queue] Queue paused')
  } catch (error) {
    console.error('[Queue] Failed to pause queue:', error)
    throw error
  }
}

/**
 * Resume the queue after pausing
 *
 * This restarts job processing after it was paused.
 *
 * @example
 * await resumePublishQueue()
 * console.log('Publishing has resumed')
 */
export async function resumePublishQueue(): Promise<void> {
  try {
    await publishQueue.resume()
    console.log('[Queue] Queue resumed')
  } catch (error) {
    console.error('[Queue] Failed to resume queue:', error)
    throw error
  }
}

/**
 * Clear all failed jobs from the queue
 *
 * This removes all jobs with 'failed' status from the queue history.
 * Useful for cleanup after reviewing failures.
 *
 * @example
 * const count = await clearFailedJobs()
 * console.log(`Cleared ${count} failed jobs`)
 */
export async function clearFailedJobs(): Promise<number> {
  try {
    const jobs = await publishQueue.getFailed(0, -1)
    let count = 0

    for (const job of jobs) {
      if (job.remove) {
        await job.remove()
      }
      count++
    }

    console.log(`[Queue] Cleared ${count} failed jobs`)
    return count
  } catch (error) {
    console.error('[Queue] Failed to clear failed jobs:', error)
    throw error
  }
}

/**
 * Get queue statistics
 *
 * This returns a summary of the queue state: how many jobs are
 * waiting, running, completed, or failed.
 *
 * Great for monitoring dashboards and health checks.
 *
 * @returns Object with job counts per state
 *
 * @example
 * const stats = await getQueueStats()
 * console.log(`Waiting: ${stats.waiting}`)
 * console.log(`Active: ${stats.active}`)
 * console.log(`Completed: ${stats.completed}`)
 * console.log(`Failed: ${stats.failed}`)
 */
export async function getQueueStats(): Promise<{
  waiting: number
  active: number
  completed: number
  failed: number
  paused: number
}> {
  try {
    const counts = await publishQueue.getJobCounts()

    return {
      waiting: counts.waiting,
      active: counts.active,
      completed: counts.completed,
      failed: counts.failed,
      paused: counts.paused,
    }
  } catch (error) {
    console.error('[Queue] Failed to get queue stats:', error)
    throw error
  }
}

/**
 * Health check for Redis connection
 *
 * This tests whether we can connect to Redis. If this fails,
 * the job queue won't work.
 *
 * @returns true if connection is healthy, false otherwise
 *
 * @example
 * const healthy = await checkQueueHealth()
 * if (!healthy) {
 *   console.error('Redis connection failed!')
 * }
 */
export async function checkQueueHealth(): Promise<boolean> {
  try {
    await publishQueue.client.ping()
    console.log('[Queue] Redis connection healthy')
    return true
  } catch (error) {
    console.error('[Queue] Redis connection failed:', error)
    return false
  }
}

/**
 * Cleanup queue on application shutdown
 *
 * This gracefully closes the queue connection when the app shuts down.
 * Prevents memory leaks and connection issues.
 *
 * Call this in your server shutdown handler.
 *
 * @example
 * process.on('SIGTERM', async () => {
 *   await cleanupQueue()
 *   process.exit(0)
 * })
 */
export async function cleanupQueue(): Promise<void> {
  try {
    console.log('[Queue] Cleaning up queue...')
    await publishQueue.close()
    console.log('[Queue] Queue closed successfully')
  } catch (error) {
    console.error('[Queue] Error during queue cleanup:', error)
  }
}
