/**
 * API Endpoint: Update a social media post
 *
 * This endpoint updates an existing post. You can change the content,
 * platforms, scheduled time, or any other field. Cannot update posts
 * that have already been published.
 *
 * PATCH /api/social/posts/update
 *
 * Request body includes:
 * - postId: The ID of the post to update
 * - content: Updated text (optional)
 * - platforms: Updated platforms list (optional)
 * - scheduledAt: Updated scheduled time (optional)
 * - (and other optional fields)
 */

export default async function handler(req, res) {
  if (req.method !== 'PATCH' && req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use PATCH or PUT.',
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

    const { postId, ...updateData } = req.body

    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'Post ID is required',
      })
    }

    // Dynamically import
    const { updatePost, getPost } = await import(
      '../../../src/lib/social/posts'
    )

    // Verify ownership
    const existingPost = await getPost(postId)
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      })
    }

    if (existingPost.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not own this post',
      })
    }

    // Update the post
    const updated = await updatePost(postId, updateData)

    console.log(`[API] Updated post ${postId} for user ${userId}`)

    return res.status(200).json({
      success: true,
      post: updated,
    })
  } catch (error) {
    console.error('[API] Update post error:', error)

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: error.message,
        })
      }

      if (error.message.includes('published') || error.message.includes('empty')) {
        return res.status(400).json({
          success: false,
          error: error.message,
        })
      }

      return res.status(500).json({
        success: false,
        error: `Failed to update post: ${error.message}`,
      })
    }

    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    })
  }
}
