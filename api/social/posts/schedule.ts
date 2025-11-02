/**
 * API Endpoint: Schedule a post for publishing
 *
 * This endpoint adds a post to the job queue for automatic publishing
 * at the scheduled time. The post must be in 'scheduled' status to
 * be queued.
 *
 * POST /api/social/posts/schedule
 *
 * Request body includes:
 * - postId: The ID of the post to schedule
 * - (Posts already have scheduledAt and timezone from creation)
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const userId = req.headers['x-user-id']
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: User ID required',
      })
    }

    const { postId } = req.body

    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'Post ID is required',
      })
    }

    // Dynamically import
    const { getPost } = await import('../../../src/lib/social/posts')
    const { addPublishJob } = await import(
      '../../../src/lib/social/queue'
    )

    // Fetch the post
    const post = await getPost(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      })
    }

    // Verify ownership
    if (post.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not own this post',
      })
    }

    // Check if post is scheduled
    if (post.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        error: `Post must be in scheduled status (current: ${post.status})`,
      })
    }

    // Add to job queue
    const job = await addPublishJob(post)

    console.log(
      `[API] Scheduled post ${postId} for user ${userId} with job ${job.id}`
    )

    return res.status(200).json({
      success: true,
      job: {
        id: job.id,
        postId: post.id,
        scheduledAt: post.scheduledAt,
        platforms: post.platforms,
        status: 'queued',
      },
    })
  } catch (error) {
    console.error('[API] Schedule post error:', error)

    if (error instanceof Error) {
      // Validation error
      if (
        error.message.includes('not found') ||
        error.message.includes('not found')
      ) {
        return res.status(404).json({
          success: false,
          error: error.message,
        })
      }

      if (
        error.message.includes('must have') ||
        error.message.includes('must be in the future') ||
        error.message.includes('at least one platform')
      ) {
        return res.status(400).json({
          success: false,
          error: error.message,
        })
      }

      return res.status(500).json({
        success: false,
        error: `Failed to schedule post: ${error.message}`,
      })
    }

    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    })
  }
}
