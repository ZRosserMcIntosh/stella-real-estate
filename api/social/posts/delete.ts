/**
 * API Endpoint: Delete a social media post
 *
 * This endpoint permanently removes a post. Only unpublished posts can
 * be deleted (draft and scheduled posts). Published posts cannot be deleted.
 *
 * DELETE /api/social/posts/delete
 *
 * Request body includes:
 * - postId: The ID of the post to delete
 */

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use DELETE.',
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
    const { deletePost, getPost } = await import(
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

    // Delete the post
    await deletePost(postId)

    console.log(`[API] Deleted post ${postId} for user ${userId}`)

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    })
  } catch (error) {
    console.error('[API] Delete post error:', error)

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: error.message,
        })
      }

      if (error.message.includes('published') || error.message.includes('Cannot delete')) {
        return res.status(400).json({
          success: false,
          error: error.message,
        })
      }

      return res.status(500).json({
        success: false,
        error: `Failed to delete post: ${error.message}`,
      })
    }

    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    })
  }
}
