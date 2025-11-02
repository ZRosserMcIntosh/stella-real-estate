/**
 * OAuth Connect Route
 * 
 * Initiates the OAuth flow by generating an authorization URL
 * GET /api/social/oauth/connect?platform=instagram&userId=user-uuid
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { platform, userId } = req.query
    
    // Validate parameters
    if (!platform) {
      return res.status(400).json({ error: 'Missing required parameter: platform' })
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing required parameter: userId' })
    }
    
    // Dynamic imports to avoid build issues
    const { generateAuthUrl } = await import('../../lib/oauth/handler')
    const { isPlatformConfigured } = await import('../../lib/oauth/config')
    
    // Check if platform is configured
    if (!isPlatformConfigured(platform)) {
      return res.status(400).json({
        error: `Platform ${platform} is not configured. Ensure OAuth credentials are set in environment variables.`,
      })
    }
    
    // Generate auth URL
    const authUrl = await generateAuthUrl(userId, platform)
    
    return res.status(200).json({
      url: authUrl,
      platform,
    })
  } catch (error) {
    console.error('OAuth connect error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate authorization URL',
    })
  }
}
