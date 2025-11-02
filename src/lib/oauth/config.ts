/**
 * OAuth Configuration Manager
 * 
 * Centralized OAuth configuration for all supported social media platforms.
 * Each platform has its own OAuth endpoints, scopes, and client credentials.
 */

import type { OAuthConfig, SocialPlatform } from '../../types/social'

/**
 * Get the redirect URI for OAuth callbacks
 */
function getRedirectUri(): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000'
  const url = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`
  return `${url}/api/social/oauth/callback`
}

/**
 * Instagram OAuth Configuration
 * Uses Meta Graph API for both Instagram and Facebook
 */
const instagramConfig: OAuthConfig = {
  provider: 'instagram',
  clientId: process.env.INSTAGRAM_CLIENT_ID || '',
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'instagram_basic',
    'instagram_content_publishing',
    'user_profile',
  ],
  authUrl: 'https://api.instagram.com/oauth/authorize',
  tokenUrl: 'https://graph.instagram.com/v18.0/oauth/access_token',
}

/**
 * Facebook OAuth Configuration
 * Uses Meta Graph API for page management
 */
const facebookConfig: OAuthConfig = {
  provider: 'facebook',
  clientId: process.env.FACEBOOK_CLIENT_ID || '',
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'pages_manage_posts',
    'pages_read_engagement',
    'pages_manage_metadata',
    'business_basic',
  ],
  authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
}

/**
 * LinkedIn OAuth Configuration
 * For user and company posts
 */
const linkedinConfig: OAuthConfig = {
  provider: 'linkedin',
  clientId: process.env.LINKEDIN_CLIENT_ID || '',
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'w_member_social',
    'r_basicprofile',
    'r_liteprofile',
  ],
  authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
}

/**
 * X / Twitter OAuth Configuration
 * Uses Twitter API v2
 */
const twitterConfig: OAuthConfig = {
  provider: 'x',
  clientId: process.env.TWITTER_CLIENT_ID || '',
  clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'tweet.write',
    'tweet.read',
    'users.read',
    'follows.read',
    'follows.write',
  ],
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token',
}

/**
 * TikTok OAuth Configuration
 */
const tiktokConfig: OAuthConfig = {
  provider: 'tiktok',
  clientId: process.env.TIKTOK_CLIENT_ID || '',
  clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'user.info.basic',
    'video.upload',
    'video.publish',
  ],
  authUrl: 'https://www.tiktok.com/oauth/authorize/',
  tokenUrl: 'https://open.tiktokapis.com/v1/oauth/token',
}

/**
 * YouTube OAuth Configuration
 * Uses Google OAuth
 */
const youtubeConfig: OAuthConfig = {
  provider: 'youtube',
  clientId: process.env.YOUTUBE_CLIENT_ID || '',
  clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
}

/**
 * Threads OAuth Configuration
 * Instagram Threads uses Meta Graph API
 */
const threadsConfig: OAuthConfig = {
  provider: 'threads',
  clientId: process.env.INSTAGRAM_CLIENT_ID || '', // Uses same Meta app
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'threads_basic',
    'threads_content_publish',
  ],
  authUrl: 'https://api.threads.instagram.com/oauth/authorize',
  tokenUrl: 'https://graph.threads.instagram.com/v1.0/oauth/access_token',
}

/**
 * Pinterest OAuth Configuration
 */
const pinterestConfig: OAuthConfig = {
  provider: 'pinterest',
  clientId: process.env.PINTEREST_CLIENT_ID || '',
  clientSecret: process.env.PINTEREST_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'pins:read',
    'pins:write',
    'user_accounts:read',
  ],
  authUrl: 'https://api.pinterest.com/oauth/',
  tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
}

/**
 * Bluesky OAuth Configuration
 * Uses ATP (Authenticated Transfer Protocol)
 */
const blueskyConfig: OAuthConfig = {
  provider: 'bluesky',
  clientId: process.env.BLUESKY_CLIENT_ID || '',
  clientSecret: process.env.BLUESKY_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'atproto',
  ],
  authUrl: 'https://bsky.social/oauth/authorize',
  tokenUrl: 'https://bsky.social/xrpc/com.atproto.server.getSession',
}

/**
 * Mastodon OAuth Configuration
 * Instance-specific - uses the user's Mastodon instance
 */
const mastodonConfig: OAuthConfig = {
  provider: 'mastodon',
  clientId: process.env.MASTODON_CLIENT_ID || '',
  clientSecret: process.env.MASTODON_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'read',
    'write',
    'follow',
  ],
  authUrl: '', // Dynamic based on instance
  tokenUrl: '', // Dynamic based on instance
}

/**
 * Google Business Profile OAuth Configuration
 */
const googleBusinessConfig: OAuthConfig = {
  provider: 'google_business',
  clientId: process.env.GOOGLE_BUSINESS_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_BUSINESS_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  scopes: [
    'https://www.googleapis.com/auth/business.manage',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
}

/**
 * All OAuth configurations mapped by platform
 */
const oauthConfigs: Record<SocialPlatform, OAuthConfig> = {
  instagram: instagramConfig,
  facebook: facebookConfig,
  linkedin: linkedinConfig,
  x: twitterConfig,
  tiktok: tiktokConfig,
  youtube: youtubeConfig,
  threads: threadsConfig,
  pinterest: pinterestConfig,
  bluesky: blueskyConfig,
  mastodon: mastodonConfig,
  google_business: googleBusinessConfig,
}

/**
 * Get OAuth configuration for a specific platform
 * 
 * @param platform - The social media platform
 * @returns OAuth configuration
 * @throws Error if platform is not configured
 */
export function getOAuthConfig(platform: SocialPlatform): OAuthConfig {
  const config = oauthConfigs[platform]
  
  if (!config) {
    throw new Error(`OAuth configuration not found for platform: ${platform}`)
  }
  
  // Validate required fields
  if (!config.clientId || !config.clientSecret) {
    throw new Error(
      `OAuth credentials not configured for ${platform}. ` +
      `Ensure ${platform.toUpperCase()}_CLIENT_ID and ${platform.toUpperCase()}_CLIENT_SECRET ` +
      `environment variables are set.`
    )
  }
  
  return config
}

/**
 * Get all configured platforms (ones with credentials)
 */
export function getConfiguredPlatforms(): SocialPlatform[] {
  return (Object.entries(oauthConfigs) as [SocialPlatform, OAuthConfig][])
    .filter(([_, config]) => config.clientId && config.clientSecret)
    .map(([platform, _]) => platform)
}

/**
 * Check if a platform is configured
 */
export function isPlatformConfigured(platform: SocialPlatform): boolean {
  try {
    getOAuthConfig(platform)
    return true
  } catch {
    return false
  }
}

/**
 * Validate OAuth configuration
 * Useful for startup checks
 */
export function validateOAuthConfigs(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  Object.entries(oauthConfigs).forEach(([platform, config]) => {
    if (!config.clientId) {
      errors.push(`Missing OAuth client ID for ${platform}`)
    }
    if (!config.clientSecret) {
      errors.push(`Missing OAuth client secret for ${platform}`)
    }
    if (!config.authUrl && platform !== 'mastodon') {
      errors.push(`Missing auth URL for ${platform}`)
    }
    if (!config.tokenUrl && platform !== 'mastodon') {
      errors.push(`Missing token URL for ${platform}`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Export all configs for reference
 */
export {
  instagramConfig,
  facebookConfig,
  linkedinConfig,
  twitterConfig,
  tiktokConfig,
  youtubeConfig,
  threadsConfig,
  pinterestConfig,
  blueskyConfig,
  mastodonConfig,
  googleBusinessConfig,
  getRedirectUri,
}
