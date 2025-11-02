/**
 * Social Media Publishing Status API Endpoint
 *
 * GET /api/social/publish-status
 *
 * This endpoint gets the publishing status and statistics.
 *
 * Query parameters:
 * - `jobId` (optional): Get status of a specific job
 * - `postId` (optional): Get status of a specific post
 * - `stats` (optional): Get overall publishing statistics
 *
 * Examples:
 * - GET /api/social/publish-status?stats=true - Get overall stats
 * - GET /api/social/publish-status?jobId=job_123 - Get specific job status
 *
 * Response (stats):
 * ```json
 * {
 *   "totalJobs": 42,
 *   "successfulJobs": 38,
 *   "failedJobs": 2,
 *   "partialSuccessJobs": 2,
 *   "platformStats": {
 *     "instagram": { "attempts": 45, "successes": 42, "failures": 3 },
 *     "facebook": { "attempts": 42, "successes": 40, "failures": 2 },
 *     ...
 *   }
 * }
 * ```
 */

import type { IncomingMessage, ServerResponse } from 'http'
import { publishingOrchestrator } from '../../src/lib/social/publishing'

interface CustomRequest extends IncomingMessage {
  method?: string
  url?: string
  headers: Record<string, any>
}

interface CustomResponse extends ServerResponse {
  status?: (code: number) => CustomResponse
  json?: (data: any) => void
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
 * Parse query parameters from URL
 */
function parseQueryString(url?: string): Record<string, string> {
  if (!url) return {}

  const queryStart = url.indexOf('?')
  if (queryStart === -1) return {}

  const queryString = url.substring(queryStart + 1)
  const params: Record<string, string> = {}

  queryString.split('&').forEach((pair) => {
    const [key, value] = pair.split('=')
    params[decodeURIComponent(key)] = decodeURIComponent(value || '')
  })

  return params
}

/**
 * Main endpoint handler
 */
export default async function handler(
  req: CustomRequest,
  res: CustomResponse
) {
  // Only GET allowed
  if (req.method !== 'GET') {
    return sendJson(res, 405, {
      error: 'Method not allowed',
      message: 'Only GET requests are supported',
    })
  }

  try {
    // Parse query parameters
    const params = parseQueryString(req.url)

    // Get statistics
    if (params.stats === 'true') {
      const stats = publishingOrchestrator.getStats()
      return sendJson(res, 200, {
        success: true,
        data: stats,
      })
    }

    // Get platform-specific stats
    if (params.platform) {
      const platformStats = publishingOrchestrator.getPlatformStats(
        params.platform
      )
      if (!platformStats) {
        return sendJson(res, 404, {
          error: 'Platform not found',
          message: `No statistics found for platform: ${params.platform}`,
        })
      }
      return sendJson(res, 200, {
        success: true,
        platform: params.platform,
        data: platformStats,
      })
    }

    // If no specific query, return general status
    return sendJson(res, 200, {
      success: true,
      message: 'Publishing service is operational',
      availableQueries: {
        stats: 'Get overall publishing statistics',
        platform: 'Get statistics for a specific platform (e.g., ?platform=instagram)',
      },
    })
  } catch (error) {
    console.error('Status check error:', error)

    return sendJson(res, 500, {
      error: 'Status check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
