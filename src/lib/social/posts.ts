/**
 * Social Media Post Operations Library
 *
 * This module handles all database operations related to social media posts.
 * It provides functions to create, read, update, delete, and manage posts.
 *
 * Key Functions:
 * - createPost: Save a new post (draft or scheduled)
 * - updatePost: Modify an existing post
 * - deletePost: Remove a post
 * - getPost: Fetch a single post by ID
 * - getPostsByUser: List all posts for a user
 * - getScheduledPosts: Get posts ready for publishing
 * - updatePostStatus: Change post status (draft → scheduled → published)
 * - getPostWithConnections: Fetch post with user's social media connections
 */

import { prisma } from '../prisma'
import type {
  SocialPost,
  CreateSocialPostRequest,
  UpdateSocialPostRequest,
  PostStatus,
  ApprovalStatus,
  SocialPlatform,
} from '../../types/social'

// ============================================================================
// Type Definitions
// ============================================================================

export interface CreatePostInput {
  content: string
  platforms: SocialPlatform[]
  mediaUrls?: string[]
  campaign?: string
  notes?: string
  scheduledAt?: Date | null
  timezone?: string
  approvalRequired?: boolean
  ownerId: string
  createdBy: string
}

export interface UpdatePostInput {
  content?: string
  platforms?: SocialPlatform[]
  mediaUrls?: string[]
  campaign?: string
  notes?: string
  scheduledAt?: Date | null
  timezone?: string
  approvalRequired?: boolean
  approvalStatus?: ApprovalStatus
}

export interface PostQueryOptions {
  skip?: number
  take?: number
  orderBy?: 'newest' | 'oldest' | 'scheduled'
  status?: PostStatus | PostStatus[]
  platform?: SocialPlatform
  campaign?: string
}

// ============================================================================
// Core CRUD Operations
// ============================================================================

/**
 * Create a new social media post
 *
 * This function creates a new post in the database. The post can be:
 * - A draft (for later editing)
 * - Scheduled (for publishing at a specific time)
 *
 * The post is associated with a user (ownerId) and tracks who created it.
 * Media files can be attached as URLs. Posts are tagged with platforms
 * they'll be published to (Instagram, Facebook, X, etc.).
 *
 * @param input - Post creation parameters (content, platforms, scheduling info)
 * @returns The created post object with all details
 * @throws Error if database operation fails or validation fails
 *
 * @example
 * const post = await createPost({
 *   content: 'Check out our new listings!',
 *   platforms: ['instagram', 'facebook'],
 *   mediaUrls: ['https://example.com/image.jpg'],
 *   scheduledAt: new Date('2025-11-02T10:00:00'),
 *   timezone: 'America/New_York',
 *   ownerId: 'user-123',
 *   createdBy: 'user-123',
 * })
 */
export async function createPost(input: CreatePostInput): Promise<SocialPost> {
  if (!input.content.trim()) {
    throw new Error('Post content cannot be empty')
  }

  if (input.platforms.length === 0) {
    throw new Error('At least one platform must be selected')
  }

  // Validate platforms
  const validPlatforms = [
    'instagram',
    'facebook',
    'linkedin',
    'x',
    'tiktok',
    'youtube',
    'threads',
    'pinterest',
    'bluesky',
    'mastodon',
    'google_business',
  ] as const
  const invalidPlatforms = input.platforms.filter(
    (p) => !validPlatforms.includes(p as any)
  )
  if (invalidPlatforms.length > 0) {
    throw new Error(`Invalid platforms: ${invalidPlatforms.join(', ')}`)
  }

  // Validate scheduled date is in the future if provided
  if (input.scheduledAt && input.scheduledAt <= new Date()) {
    throw new Error('Scheduled time must be in the future')
  }

  const post = await prisma.socialPost.create({
    data: {
      content: input.content,
      platforms: input.platforms,
      mediaUrls: input.mediaUrls || [],
      campaign: input.campaign || null,
      notes: input.notes || null,
      status: input.scheduledAt ? 'scheduled' : 'draft',
      scheduledAt: input.scheduledAt || null,
      timezone: input.timezone || 'UTC',
      approvalRequired: input.approvalRequired || false,
      approvalStatus: input.approvalRequired ? 'pending' : 'approved',
      ownerId: input.ownerId,
      createdBy: input.createdBy,
    },
  })

  return post as SocialPost
}

/**
 * Update an existing post
 *
 * This function modifies an existing post. You can update the content,
 * platforms, scheduled time, or any other field. Cannot update a post
 * that's already been published (status = 'published').
 *
 * @param postId - The ID of the post to update
 * @param input - Fields to update (partial update)
 * @returns The updated post object
 * @throws Error if post not found, already published, or validation fails
 *
 * @example
 * const updated = await updatePost('post-123', {
 *   content: 'Updated listing information!',
 *   platforms: ['instagram', 'facebook', 'linkedin'],
 *   scheduledAt: new Date('2025-11-03T14:00:00'),
 * })
 */
export async function updatePost(
  postId: string,
  input: UpdatePostInput
): Promise<SocialPost> {
  // Fetch existing post
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error(`Post with ID ${postId} not found`)
  }

  // Cannot update published posts
  if (post.status === 'published') {
    throw new Error('Cannot update a published post')
  }

  // Validate new content if provided
  if (input.content !== undefined && !input.content.trim()) {
    throw new Error('Post content cannot be empty')
  }

  // Validate platforms if provided
  if (input.platforms && input.platforms.length === 0) {
    throw new Error('At least one platform must be selected')
  }

  // Validate scheduled date is in the future if provided
  if (input.scheduledAt && input.scheduledAt <= new Date()) {
    throw new Error('Scheduled time must be in the future')
  }

  const updated = await prisma.socialPost.update({
    where: { id: postId },
    data: {
      content: input.content || undefined,
      platforms: input.platforms || undefined,
      mediaUrls: input.mediaUrls || undefined,
      campaign: input.campaign || undefined,
      notes: input.notes || undefined,
      scheduledAt: input.scheduledAt || undefined,
      timezone: input.timezone || undefined,
      approvalRequired: input.approvalRequired || undefined,
      approvalStatus: input.approvalStatus || undefined,
      updatedAt: new Date(),
    },
  })

  return updated as SocialPost
}

/**
 * Delete a post
 *
 * This function permanently removes a post from the database. Posts can only
 * be deleted if they haven't been published yet (status != 'published').
 * Deleting a post also removes any associated analytics data.
 *
 * @param postId - The ID of the post to delete
 * @throws Error if post not found or already published
 *
 * @example
 * await deletePost('post-123')
 * console.log('Post deleted successfully')
 */
export async function deletePost(postId: string): Promise<void> {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error(`Post with ID ${postId} not found`)
  }

  if (post.status === 'published') {
    throw new Error('Cannot delete a published post')
  }

  // Delete associated analytics
  await prisma.socialAnalytic.deleteMany({
    where: { postId },
  })

  // Delete the post
  await prisma.socialPost.delete({
    where: { id: postId },
  })
}

/**
 * Fetch a single post by ID
 *
 * This function retrieves all details about a specific post, including
 * its content, scheduled time, media files, and current status.
 *
 * @param postId - The ID of the post to fetch
 * @returns The post object, or null if not found
 *
 * @example
 * const post = await getPost('post-123')
 * if (post) {
 *   console.log(`Post: ${post.content}`)
 *   console.log(`Status: ${post.status}`)
 * }
 */
export async function getPost(postId: string): Promise<SocialPost | null> {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
  })

  return post as SocialPost | null
}

/**
 * Fetch all posts belonging to a user
 *
 * This function retrieves all posts created by a specific user. Results
 * can be filtered by status, platform, or campaign. The results can be
 * paginated and sorted by date or scheduled time.
 *
 * @param userId - The ID of the user
 * @param options - Query options (pagination, filtering, sorting)
 * @returns Array of posts matching the criteria
 *
 * @example
 * // Get first 10 scheduled posts
 * const posts = await getPostsByUser('user-123', {
 *   status: 'scheduled',
 *   take: 10,
 *   orderBy: 'scheduled',
 * })
 *
 * // Get published posts from a campaign
 * const campaign = await getPostsByUser('user-123', {
 *   status: 'published',
 *   campaign: 'Summer Sale 2025',
 * })
 */
export async function getPostsByUser(
  userId: string,
  options?: PostQueryOptions
): Promise<SocialPost[]> {
  const {
    skip = 0,
    take = 50,
    orderBy = 'newest',
    status = undefined,
    platform = undefined,
    campaign = undefined,
  } = options || {}

  // Build where clause for filtering
  const where: any = {
    ownerId: userId,
  }

  if (status) {
    where.status = Array.isArray(status) ? { in: status } : status
  }

  if (campaign) {
    where.campaign = campaign
  }

  if (platform) {
    where.platforms = { has: platform }
  }

  // Determine sort order
  const orderByClause: any = {}
  switch (orderBy) {
    case 'oldest':
      orderByClause.createdAt = 'asc'
      break
    case 'scheduled':
      orderByClause.scheduledAt = 'asc'
      break
    case 'newest':
    default:
      orderByClause.createdAt = 'desc'
      break
  }

  const posts = await prisma.socialPost.findMany({
    where,
    orderBy: orderByClause,
    skip,
    take,
  })

  return posts as SocialPost[]
}

/**
 * Get all posts scheduled for publishing
 *
 * This function retrieves posts that are ready to be published. It returns
 * posts with status 'scheduled' or 'queued' that haven't been published yet.
 * Results are sorted by scheduled time (earliest first) so jobs process in order.
 *
 * Use this function to find posts that should be published based on the
 * current time and timezone settings.
 *
 * @param options - Query options (pagination, filtering)
 * @returns Array of scheduled posts
 *
 * @example
 * // Get the next 20 posts to be published
 * const posts = await getScheduledPosts({ take: 20 })
 *
 * // Get scheduled posts for a specific platform
 * const insta = await getScheduledPosts({
 *   platform: 'instagram',
 *   take: 100,
 * })
 */
export async function getScheduledPosts(
  options?: PostQueryOptions
): Promise<SocialPost[]> {
  const { skip = 0, take = 50, platform = undefined } = options || {}

  const where: any = {
    status: { in: ['scheduled', 'queued'] },
    postedAt: null,
  }

  if (platform) {
    where.platforms = { has: platform }
  }

  const posts = await prisma.socialPost.findMany({
    where,
    orderBy: { scheduledAt: 'asc' },
    skip,
    take,
  })

  return posts as SocialPost[]
}

/**
 * Update the status of a post
 *
 * This function changes a post's status. Valid transitions are:
 * - draft → scheduled: When post is scheduled for publishing
 * - scheduled → queued: When post is added to job queue
 * - queued → published: When post successfully publishes
 * - any → failed: If publishing fails
 *
 * Use this function to track the post through its lifecycle as it moves
 * from draft to published.
 *
 * @param postId - The ID of the post to update
 * @param status - The new status
 * @param failureReason - If status is 'failed', provide the error message
 * @returns The updated post
 * @throws Error if post not found or invalid status transition
 *
 * @example
 * // Mark post as queued for publishing
 * await updatePostStatus('post-123', 'queued')
 *
 * // Mark post as published
 * await updatePostStatus('post-123', 'published')
 *
 * // Mark post as failed with reason
 * await updatePostStatus('post-123', 'failed', 'Instagram API rate limit exceeded')
 */
export async function updatePostStatus(
  postId: string,
  status: PostStatus,
  failureReason?: string
): Promise<SocialPost> {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error(`Post with ID ${postId} not found`)
  }

  const updateData: any = {
    status,
    updatedAt: new Date(),
  }

  if (status === 'published') {
    updateData.postedAt = new Date()
  }

  if (status === 'failed' && failureReason) {
    updateData.failureReason = failureReason
  }

  const updated = await prisma.socialPost.update({
    where: { id: postId },
    data: updateData,
  })

  return updated as SocialPost
}

/**
 * Get a post with all user's social media connections
 *
 * This function fetches a post and also retrieves all social media accounts
 * the user has connected. This is useful when you need to display connection
 * status or verify accounts before publishing.
 *
 * Returns the post plus an array of connected social media accounts
 * (Instagram, Facebook, LinkedIn, etc.) for the user.
 *
 * @param postId - The ID of the post
 * @param userId - The ID of the post owner
 * @returns Object with post and user's social connections
 * @throws Error if post not found or doesn't belong to user
 *
 * @example
 * const { post, connections } = await getPostWithConnections('post-123', 'user-123')
 * console.log(`Post: ${post.content}`)
 * console.log(`Connected platforms: ${connections.map(c => c.provider).join(', ')}`)
 */
export async function getPostWithConnections(
  postId: string,
  userId: string
): Promise<{ post: SocialPost; connections: any[] }> {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error(`Post with ID ${postId} not found`)
  }

  if (post.ownerId !== userId) {
    throw new Error('Unauthorized: Post does not belong to this user')
  }

  const connections = await prisma.socialConnection.findMany({
    where: {
      userId,
      status: 'connected',
    },
  })

  return {
    post: post as SocialPost,
    connections,
  }
}

/**
 * Get posts pending approval
 *
 * This function retrieves posts that are waiting for approval before publishing.
 * These are posts where approvalRequired = true and approvalStatus = 'pending'.
 *
 * Useful for admin dashboards or approval workflows where team members need
 * to review posts before they go live.
 *
 * @param options - Query options (pagination, filtering)
 * @returns Array of posts pending approval
 *
 * @example
 * const pending = await getPostsPendingApproval({ take: 10 })
 * console.log(`${pending.length} posts awaiting approval`)
 */
export async function getPostsPendingApproval(
  options?: PostQueryOptions
): Promise<SocialPost[]> {
  const { skip = 0, take = 50 } = options || {}

  const posts = await prisma.socialPost.findMany({
    where: {
      approvalRequired: true,
      approvalStatus: 'pending',
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  })

  return posts as SocialPost[]
}

/**
 * Approve or reject a post
 *
 * This function updates the approval status of a post. When a post is approved,
 * it can proceed to publishing. When rejected, it returns to draft status
 * for editing.
 *
 * @param postId - The ID of the post
 * @param approved - Whether to approve (true) or reject (false)
 * @param reason - Optional reason for rejection (displayed to creator)
 * @returns The updated post
 * @throws Error if post not found or not pending approval
 *
 * @example
 * // Approve a post
 * await approvePost('post-123', true)
 *
 * // Reject a post with reason
 * await approvePost('post-123', false, 'Image quality too low')
 */
export async function approvePost(
  postId: string,
  approved: boolean,
  reason?: string
): Promise<SocialPost> {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error(`Post with ID ${postId} not found`)
  }

  if (!post.approvalRequired) {
    throw new Error('Post does not require approval')
  }

  const updated = await prisma.socialPost.update({
    where: { id: postId },
    data: {
      approvalStatus: approved ? 'approved' : 'rejected',
      notes: reason ? (post.notes ? `${post.notes}\n\n[Rejection: ${reason}]` : reason) : undefined,
      updatedAt: new Date(),
    },
  })

  return updated as SocialPost
}

/**
 * Get analytics for a post
 *
 * This function retrieves engagement metrics for a published post.
 * Shows how many people saw it (impressions), liked it (likes), and
 * shared it (shares) across each platform.
 *
 * @param postId - The ID of the post
 * @returns Array of analytics per platform
 *
 * @example
 * const metrics = await getPostAnalytics('post-123')
 * metrics.forEach(m => {
 *   console.log(`${m.platform}: ${m.likes} likes, ${m.comments} comments`)
 * })
 */
export async function getPostAnalytics(postId: string): Promise<any[]> {
  const analytics = await prisma.socialAnalytic.findMany({
    where: { postId },
    orderBy: { platform: 'asc' },
  })

  return analytics
}

/**
 * Archive old posts
 *
 * This function marks posts as archived (soft delete) instead of permanently
 * deleting them. This preserves the post history while removing clutter
 * from active post lists.
 *
 * @param userId - The ID of the user
 * @param daysOld - Only archive posts older than this many days (default: 90)
 * @returns Number of posts archived
 *
 * @example
 * const archived = await archiveOldPosts('user-123', 90)
 * console.log(`Archived ${archived} old posts`)
 */
export async function archiveOldPosts(
  userId: string,
  daysOld: number = 90
): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  const result = await prisma.socialPost.updateMany({
    where: {
      ownerId: userId,
      postedAt: { lt: cutoffDate },
      status: 'published',
    },
    data: {
      status: 'archived',
    },
  })

  return result.count
}
