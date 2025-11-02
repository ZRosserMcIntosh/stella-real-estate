/**
 * API Endpoint: Create a new social media post
 *
 * This endpoint creates a new post in the database. The post can be
 * saved as a draft (for editing later) or immediately scheduled for
 * publishing at a specific time.
 *
 * POST /api/social/posts/create
 *
 * Request body includes:
 * - content: The text/caption for the post
 * - platforms: Which social media to post to (Instagram, Facebook, etc)
 * - mediaUrls: URLs of images or videos to attach
 * - scheduledAt: When to publish (optional - leave null for draft)
 * - timezone: User's timezone for scheduling
 *
 * Response includes:
 * - The created post with all details
 * - Success/error messages
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    // ========================================================================
    // Step 1: Validate User Authentication
    // ========================================================================

    // In a real app, verify the user is authenticated
    const userId = req.headers['x-user-id']
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: User ID required',
      })
    }

    // ========================================================================
    // Step 2: Extract and Validate Request Body
    // ========================================================================

    const {
      content,
      platforms,
      mediaUrls,
      campaign,
      notes,
      scheduledAt,
      timezone,
      approvalRequired,
    } = req.body

    // Validate required fields
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Post content is required and must be a string',
      })
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one platform must be selected',
      })
    }

    // Validate optional fields
    if (mediaUrls && !Array.isArray(mediaUrls)) {
      return res.status(400).json({
        success: false,
        error: 'mediaUrls must be an array',
      })
    }

    if (scheduledAt && isNaN(Date.parse(scheduledAt))) {
      return res.status(400).json({
        success: false,
        error: 'scheduledAt must be a valid date',
      })
    }

    // ========================================================================
    // Step 3: Create the Post
    // ========================================================================

    // Dynamically import to avoid build issues  
    const { createPost } = await import('../../../src/lib/social/posts')

    const post = await createPost({
      content: content.trim(),
      platforms,
      mediaUrls: mediaUrls || [],
      campaign: campaign || undefined,
      notes: notes || undefined,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      timezone: timezone || 'UTC',
      approvalRequired: approvalRequired || false,
      ownerId: userId,
      createdBy: userId,
    })

    console.log(`[API] Created post ${post.id} for user ${userId}`)

    // ========================================================================
    // Step 4: Return Success Response
    // ========================================================================

    return res.status(201).json({
      success: true,
      post,
    })
  } catch (error) {
    console.error('[API] Create post error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      // Validation error
      if (
        error.message.includes('cannot be empty') ||
        error.message.includes('must be selected') ||
        error.message.includes('Invalid platforms') ||
        error.message.includes('must be in the future')
      ) {
        return res.status(400).json({
          success: false,
          error: error.message,
        })
      }

      // Database or other error
      return res.status(500).json({
        success: false,
        error: `Failed to create post: ${error.message}`,
      })
    }

    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    })
  }
}
