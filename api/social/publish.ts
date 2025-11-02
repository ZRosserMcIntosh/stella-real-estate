import type { IncomingMessage, ServerResponse } from 'http'
import { publishingOrchestrator } from '../../src/lib/social/publishing'

interface CustomRequest extends IncomingMessage {
  method?: string
  body?: any
  headers: Record<string, any>
}

interface CustomResponse extends ServerResponse {
  status?: (code: number) => CustomResponse
  json?: (data: any) => void
}

/**
 * Verify user authentication
 *
 * In production, check JWT token in headers
 */
function getUserId(req: CustomRequest): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return null
  }

  // In production: verify JWT token
  // For now, just extract user ID from headers
  const userIdHeader = req.headers['x-user-id'] as string
  return userIdHeader || null
}

/**
 * Validate publishing request
 *
 * @param postId - Post ID
 * @param platforms - List of platforms
 * @returns Error message or null if valid
 */
function validateRequest(
  postId?: string,
  platforms?: any
): string | null {
  if (!postId || typeof postId !== 'string') {
    return 'postId is required and must be a string'
  }

  if (!Array.isArray(platforms) || platforms.length === 0) {
    return 'platforms is required and must be a non-empty array'
  }

  // Validate platform names
  const validPlatforms = [
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
    if (!validPlatforms.includes(platform)) {
      return `Invalid platform: ${platform}`
    }
  }

  return null
}

/**
 * Helper to send JSON responses
 */
function sendJson(res: CustomResponse, status: number, data: any) {
  res.statusCode = status
  res.setHeader?.('Content-Type', 'application/json')
  res.end?.(JSON.stringify(data))
}

/**
 * Main endpoint handler
 */
export default async function handler(
  req: CustomRequest,
  res: CustomResponse
) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      error: 'Method not allowed',
      message: 'Only POST requests are supported',
    })
  }

  try {
    // Check authentication
    const userId = getUserId(req)
    if (!userId) {
      return sendJson(res, 401, {
        error: 'Unauthorized',
        message: 'Authentication required',
      })
    }

    // Extract request body
    const { postId, platforms } = req.body

    // Validate request
    const validationError = validateRequest(postId, platforms)
    if (validationError) {
      return sendJson(res, 400, {
        error: 'Invalid request',
        message: validationError,
      })
    }

    // Publish post
    const result = await publishingOrchestrator.publishPost(
      postId,
      userId,
      platforms
    )

    // Return result
    return sendJson(res, 200, {
      success: result.overallSuccess,
      jobId: result.jobId,
      postId: result.postId,
      results: result.results,
      overallSuccess: result.overallSuccess,
      totalPlatforms: result.totalPlatforms,
      successCount: result.successCount,
      failureCount: result.failureCount,
      completedAt: result.completedAt,
    })
  } catch (error) {
    console.error('Publishing error:', error)

    return sendJson(res, 500, {
      error: 'Publishing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
