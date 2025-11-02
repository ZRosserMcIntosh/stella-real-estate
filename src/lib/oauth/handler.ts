/**
 * OAuth Flow Handler
 * 
 * Manages the complete OAuth authorization flow:
 * 1. Generate authorization URL with state token
 * 2. Handle OAuth callback
 * 3. Exchange authorization code for tokens
 * 4. Fetch user profile
 * 5. Store connection and tokens in database
 */

import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import type { SocialPlatform, OAuthUserProfile, OAuthToken } from '../../types/social'
import { getOAuthConfig } from './config'

const prisma = new PrismaClient()

/**
 * Error class for OAuth-specific errors
 */
export class OAuthError extends Error {
  constructor(
    message: string,
    public code: string = 'OAUTH_ERROR',
    public platform?: SocialPlatform,
  ) {
    super(message)
    this.name = 'OAuthError'
  }
}

/**
 * Generate a CSRF state token for OAuth security
 */
export function generateStateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Generate OAuth authorization URL
 * 
 * @param userId - The user requesting authorization
 * @param platform - The social media platform
 * @param stateStorage - Object to store state token (typically Redis)
 * @returns Authorization URL to redirect user to
 */
export async function generateAuthUrl(
  userId: string,
  platform: SocialPlatform,
  stateStorage?: { set: (key: string, value: string, expiresIn: number) => Promise<void> },
): Promise<string> {
  const config = getOAuthConfig(platform)
  
  // Generate state token for CSRF protection
  const state = generateStateToken()
  
  // Store state in Redis/cache with 10 minute expiration
  if (stateStorage) {
    await stateStorage.set(`oauth:state:${state}`, userId, 600)
  }
  
  // Build authorization URL params
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
  })
  
  // Add platform-specific params
  if (platform === 'x') {
    // Twitter requires code_challenge for PKCE
    params.append('code_challenge_method', 'plain')
  } else if (platform === 'facebook') {
    // Facebook recommends display parameter
    params.append('display', 'popup')
  }
  
  return `${config.authUrl}?${params.toString()}`
}

/**
 * Exchange OAuth authorization code for tokens
 * 
 * @param code - Authorization code from OAuth provider
 * @param platform - The social media platform
 * @returns OAuth tokens
 */
export async function exchangeCodeForToken(
  code: string,
  platform: SocialPlatform,
): Promise<OAuthToken> {
  const config = getOAuthConfig(platform)
  
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code',
  })
  
  try {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: body.toString(),
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new OAuthError(
        `Failed to exchange code for token: ${error}`,
        'TOKEN_EXCHANGE_FAILED',
        platform,
      )
    }
    
    const data = await response.json()
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || null,
      expiresIn: data.expires_in,
      tokenType: data.token_type || 'Bearer',
    }
  } catch (error) {
    if (error instanceof OAuthError) throw error
    throw new OAuthError(
      `Token exchange failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'TOKEN_EXCHANGE_ERROR',
      platform,
    )
  }
}

/**
 * Fetch user profile from OAuth provider
 * Platform-specific implementation
 */
export async function fetchUserProfile(
  platform: SocialPlatform,
  accessToken: string,
): Promise<OAuthUserProfile> {
  switch (platform) {
    case 'instagram':
      return fetchInstagramProfile(accessToken)
    case 'facebook':
      return fetchFacebookProfile(accessToken)
    case 'linkedin':
      return fetchLinkedInProfile(accessToken)
    case 'x':
      return fetchTwitterProfile(accessToken)
    case 'tiktok':
      return fetchTikTokProfile(accessToken)
    case 'youtube':
      return fetchYouTubeProfile(accessToken)
    case 'threads':
      return fetchThreadsProfile(accessToken)
    case 'pinterest':
      return fetchPinterestProfile(accessToken)
    case 'bluesky':
      return fetchBlueskyProfile(accessToken)
    case 'mastodon':
      return fetchMastodonProfile(accessToken)
    case 'google_business':
      return fetchGoogleBusinessProfile(accessToken)
    default:
      throw new OAuthError(
        `Profile fetching not implemented for ${platform}`,
        'PROFILE_FETCH_NOT_IMPLEMENTED',
        platform,
      )
  }
}

/**
 * Instagram Profile Fetching
 */
async function fetchInstagramProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch(
    `https://graph.instagram.com/me?fields=id,username,name,profile_picture_url&access_token=${accessToken}`,
  )
  
  if (!response.ok) throw new OAuthError('Failed to fetch Instagram profile', 'INSTAGRAM_PROFILE_FETCH_FAILED', 'instagram')
  
  const data = await response.json()
  return {
    id: data.id,
    handle: data.username,
    displayName: data.name,
    profileImageUrl: data.profile_picture_url,
  }
}

/**
 * Facebook Profile Fetching
 */
async function fetchFacebookProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`,
  )
  
  if (!response.ok) throw new OAuthError('Failed to fetch Facebook profile', 'FACEBOOK_PROFILE_FETCH_FAILED', 'facebook')
  
  const data = await response.json()
  return {
    id: data.id,
    handle: data.email || data.name,
    displayName: data.name,
    profileImageUrl: data.picture?.data?.url,
  }
}

/**
 * LinkedIn Profile Fetching
 */
async function fetchLinkedInProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch('https://api.linkedin.com/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  
  if (!response.ok) throw new OAuthError('Failed to fetch LinkedIn profile', 'LINKEDIN_PROFILE_FETCH_FAILED', 'linkedin')
  
  const data = await response.json()
  const fullName = `${data.localizedFirstName} ${data.localizedLastName}`
  
  return {
    id: data.id,
    handle: fullName.trim(),
    displayName: fullName.trim(),
  }
}

/**
 * X / Twitter Profile Fetching
 */
async function fetchTwitterProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch('https://api.twitter.com/2/users/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  
  if (!response.ok) throw new OAuthError('Failed to fetch Twitter profile', 'TWITTER_PROFILE_FETCH_FAILED', 'x')
  
  const data = await response.json()
  return {
    id: data.data.id,
    handle: data.data.username,
    displayName: data.data.name,
  }
}

/**
 * TikTok Profile Fetching
 */
async function fetchTikTokProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch(
    'https://open.tiktokapis.com/v1/user/info/?fields=open_id,union_id,avatar_large,display_name',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  
  if (!response.ok) throw new OAuthError('Failed to fetch TikTok profile', 'TIKTOK_PROFILE_FETCH_FAILED', 'tiktok')
  
  const data = await response.json()
  return {
    id: data.data.user.open_id,
    handle: data.data.user.display_name,
    displayName: data.data.user.display_name,
    profileImageUrl: data.data.user.avatar_large,
  }
}

/**
 * YouTube Profile Fetching
 */
async function fetchYouTubeProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  
  if (!response.ok) throw new OAuthError('Failed to fetch YouTube profile', 'YOUTUBE_PROFILE_FETCH_FAILED', 'youtube')
  
  const data = await response.json()
  const channel = data.items?.[0]
  
  if (!channel) throw new OAuthError('No YouTube channel found', 'YOUTUBE_CHANNEL_NOT_FOUND', 'youtube')
  
  return {
    id: channel.id,
    handle: channel.snippet.customUrl || channel.snippet.title,
    displayName: channel.snippet.title,
    profileImageUrl: channel.snippet.thumbnails?.default?.url,
  }
}

/**
 * Threads Profile Fetching
 */
async function fetchThreadsProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch(
    `https://graph.threads.instagram.com/me?fields=id,username,name&access_token=${accessToken}`,
  )
  
  if (!response.ok) throw new OAuthError('Failed to fetch Threads profile', 'THREADS_PROFILE_FETCH_FAILED', 'threads')
  
  const data = await response.json()
  return {
    id: data.id,
    handle: data.username,
    displayName: data.name,
  }
}

/**
 * Pinterest Profile Fetching
 */
async function fetchPinterestProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch('https://api.pinterest.com/v5/user_account', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  
  if (!response.ok) throw new OAuthError('Failed to fetch Pinterest profile', 'PINTEREST_PROFILE_FETCH_FAILED', 'pinterest')
  
  const data = await response.json()
  return {
    id: data.id,
    handle: data.username,
    displayName: data.username,
  }
}

/**
 * Bluesky Profile Fetching
 */
async function fetchBlueskyProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch('https://bsky.social/xrpc/app.bsky.actor.getProfile', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  
  if (!response.ok) throw new OAuthError('Failed to fetch Bluesky profile', 'BLUESKY_PROFILE_FETCH_FAILED', 'bluesky')
  
  const data = await response.json()
  return {
    id: data.did,
    handle: data.handle,
    displayName: data.displayName,
    profileImageUrl: data.avatar,
  }
}

/**
 * Mastodon Profile Fetching
 */
async function fetchMastodonProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch('https://mastodon.social/api/v1/accounts/verify_credentials', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  
  if (!response.ok) throw new OAuthError('Failed to fetch Mastodon profile', 'MASTODON_PROFILE_FETCH_FAILED', 'mastodon')
  
  const data = await response.json()
  return {
    id: data.id,
    handle: data.username,
    displayName: data.display_name,
    profileImageUrl: data.avatar,
  }
}

/**
 * Google Business Profile Fetching
 */
async function fetchGoogleBusinessProfile(accessToken: string): Promise<OAuthUserProfile> {
  const response = await fetch('https://www.googleapis.com/business/insight/v1/accounts', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  
  if (!response.ok) throw new OAuthError('Failed to fetch Google Business profile', 'GOOGLE_BUSINESS_PROFILE_FETCH_FAILED', 'google_business')
  
  const data = await response.json()
  const account = data.accounts?.[0]
  
  if (!account) throw new OAuthError('No Google Business account found', 'GOOGLE_BUSINESS_ACCOUNT_NOT_FOUND', 'google_business')
  
  return {
    id: account.name,
    handle: account.accountName,
    displayName: account.accountName,
  }
}

/**
 * Handle OAuth callback and create/update connection
 * 
 * @param code - Authorization code from OAuth provider
 * @param state - State token for CSRF verification
 * @param platform - The social media platform
 * @param stateStorage - Storage to verify state token
 * @returns Connection ID
 */
export async function handleOAuthCallback(
  code: string,
  state: string,
  platform: SocialPlatform,
  stateStorage?: { get: (key: string) => Promise<string | null> },
): Promise<{ connectionId: string; userId: string }> {
  // Verify state token
  const userId = stateStorage ? await stateStorage.get(`oauth:state:${state}`) : null
  
  if (!userId) {
    throw new OAuthError(
      'Invalid or expired state token. Please try connecting again.',
      'INVALID_STATE_TOKEN',
      platform,
    )
  }
  
  // Exchange code for tokens
  const tokens = await exchangeCodeForToken(code, platform)
  
  // Fetch user profile
  const profile = await fetchUserProfile(platform, tokens.accessToken)
  
  // Create or update social connection
  const connection = await prisma.socialConnection.upsert({
    where: {
      userId_provider: {
        userId,
        provider: platform,
      },
    },
    update: {
      status: 'connected',
      updatedAt: new Date(),
    },
    create: {
      userId,
      provider: platform,
      status: 'connected',
      connectedAt: new Date(),
    },
  })
  
  // Store or update tokens
  await prisma.socialAccountToken.upsert({
    where: {
      connectionId: connection.id,
    },
    update: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || undefined,
      tokenExpiresAt: tokens.expiresIn
        ? new Date(Date.now() + tokens.expiresIn * 1000)
        : null,
      updatedAt: new Date(),
    },
    create: {
      connectionId: connection.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || null,
      tokenExpiresAt: tokens.expiresIn
        ? new Date(Date.now() + tokens.expiresIn * 1000)
        : null,
      accountHandle: profile.handle,
      displayName: profile.displayName || null,
      profileImageUrl: profile.profileImageUrl || null,
      platformAccountId: profile.id,
    },
  })
  
  return { connectionId: connection.id, userId }
}

/**
 * Refresh an expired OAuth token
 * 
 * @param connectionId - ID of the social connection
 */
export async function refreshOAuthToken(connectionId: string): Promise<void> {
  const token = await prisma.socialAccountToken.findUnique({
    where: { connectionId },
  })
  
  if (!token || !token.refreshToken) {
    throw new OAuthError(
      'No refresh token available. Please reconnect your account.',
      'NO_REFRESH_TOKEN',
    )
  }
  
  const connection = await prisma.socialConnection.findUnique({
    where: { id: connectionId },
  })
  
  if (!connection) {
    throw new OAuthError('Connection not found', 'CONNECTION_NOT_FOUND')
  }
  
  const config = getOAuthConfig(connection.provider as SocialPlatform)
  
  try {
    const body = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: token.refreshToken,
      grant_type: 'refresh_token',
    })
    
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: body.toString(),
    })
    
    if (!response.ok) {
      // Token refresh failed - mark connection as error
      await prisma.socialConnection.update({
        where: { id: connectionId },
        data: { status: 'error' },
      })
      
      throw new OAuthError(
        'Token refresh failed. Please reconnect your account.',
        'TOKEN_REFRESH_FAILED',
        connection.provider as SocialPlatform,
      )
    }
    
    const data = await response.json()
    
    // Update tokens
    await prisma.socialAccountToken.update({
      where: { connectionId },
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || token.refreshToken,
        tokenExpiresAt: data.expires_in
          ? new Date(Date.now() + data.expires_in * 1000)
          : null,
        updatedAt: new Date(),
      },
    })
    
    // Mark connection as connected again
    await prisma.socialConnection.update({
      where: { id: connectionId },
      data: { status: 'connected' },
    })
  } catch (error) {
    if (error instanceof OAuthError) throw error
    throw new OAuthError(
      `Token refresh error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'TOKEN_REFRESH_ERROR',
      connection.provider as SocialPlatform,
    )
  }
}

export default {
  generateAuthUrl,
  exchangeCodeForToken,
  fetchUserProfile,
  handleOAuthCallback,
  refreshOAuthToken,
}
