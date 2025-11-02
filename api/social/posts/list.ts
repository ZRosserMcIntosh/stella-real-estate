/**
 * API Endpoint: List user's social media posts
 *
 * This endpoint retrieves all posts created by a user with filtering,
 * sorting, and pagination options.
 *
 * GET /api/social/posts/list?status=scheduled&take=10&skip=0&orderBy=newest
 *
 * Query parameters:
 * - status: Filter by status (draft, scheduled, published, failed)
 * - platform: Filter by platform (instagram, facebook, etc)
 * - campaign: Filter by campaign name
 * - skip: Number of posts to skip (for pagination)
 * - take: Number of posts to return (max 100)
 * - orderBy: Sort order (newest, oldest, scheduled)
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.',
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

    // Parse query parameters
    const { status, platform, campaign, skip, take, orderBy } = req.query

    // Validate and parse pagination
    let skipNum = 0
    let takeNum = 50

    if (skip) {
      skipNum = Math.max(0, parseInt(String(skip), 10) || 0)
    }

    if (take) {
      takeNum = Math.min(100, Math.max(1, parseInt(String(take), 10) || 50))
    }

    // Build options
    const options = {
      skip: skipNum,
      take: takeNum,
      orderBy: (orderBy as any) || 'newest',
      status: status ? String(status) : undefined,
      platform: platform ? String(platform) : undefined,
      campaign: campaign ? String(campaign) : undefined,
    }

    // Dynamically import
    const { getPostsByUser } = await import(
      '../../../src/lib/social/posts'
    )

    // Fetch posts
    const posts = await getPostsByUser(userId, options)

    console.log(`[API] Retrieved ${posts.length} posts for user ${userId}`)

    return res.status(200).json({
      success: true,
      posts,
      pagination: {
        skip: skipNum,
        take: takeNum,
        count: posts.length,
      },
    })
  } catch (error) {
    console.error('[API] List posts error:', error)

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        error: `Failed to retrieve posts: ${error.message}`,
      })
    }

    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    })
  }
}
