/**
 * OAuth Callback Route
 * 
 * Handles the OAuth provider redirect after user authorizes
 * GET /api/social/oauth/callback?code=xxx&state=yyy&platform=instagram
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, state, platform, error: oauthError, error_description } = req.query
    
    // Check for OAuth errors
    if (oauthError) {
      console.error(`OAuth error from ${platform}: ${oauthError} - ${error_description}`)
      return res.redirect(`/admin/social-media?error=${oauthError}&platform=${platform}`)
    }
    
    // Validate parameters
    if (!code) {
      return res.redirect('/admin/social-media?error=missing_code')
    }
    
    if (!state) {
      return res.redirect('/admin/social-media?error=missing_state')
    }
    
    if (!platform) {
      return res.redirect('/admin/social-media?error=missing_platform')
    }
    
    try {
      // Dynamic imports
      const { handleOAuthCallback } = await import('../../lib/oauth/handler')
      
      // Handle the OAuth callback
      const { connectionId, userId } = await handleOAuthCallback(
        code,
        state,
        platform,
      )
      
      // Redirect back with success
      return res.redirect(
        `/admin/social-media?connected=${platform}&connectionId=${connectionId}&success=true`,
      )
    } catch (error) {
      console.error(`OAuth callback error for ${platform}:`, error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return res.redirect(
        `/admin/social-media?error=${encodeURIComponent(errorMessage)}&platform=${platform}`,
      )
    }
  } catch (error) {
    console.error('OAuth callback error:', error)
    return res.status(500).json({
      error: 'Failed to process OAuth callback',
    })
  }
}
