/**
 * Social Media Integration Type Definitions
 * 
 * TypeScript interfaces and types for the social media feature
 */

// Platform types
export type SocialPlatform = 
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'x'
  | 'tiktok'
  | 'youtube'
  | 'threads'
  | 'pinterest'
  | 'bluesky'
  | 'mastodon'
  | 'google_business'

// Status types
export type ConnectionStatus = 'connected' | 'pending' | 'error'
export type PostStatus = 'draft' | 'scheduled' | 'queued' | 'published' | 'failed'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

// ============================================================================
// Database Models (mapped from Prisma)
// ============================================================================

export interface SocialConnection {
  id: string
  userId: string
  provider: SocialPlatform
  status: ConnectionStatus
  connectedAt: Date | null
  authMetadata: Record<string, unknown> | null
  updatedAt: Date
}

export interface SocialAccountToken {
  id: string
  connectionId: string
  accessToken: string
  refreshToken: string | null
  tokenExpiresAt: Date | null
  accountHandle: string
  displayName: string | null
  profileImageUrl: string | null
  platformAccountId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SocialPost {
  id: string
  content: string
  platforms: SocialPlatform[]
  status: PostStatus
  scheduledAt: Date | null
  postedAt: Date | null
  timezone: string | null
  mediaUrls: string[]
  campaign: string | null
  notes: string | null
  approvalRequired: boolean
  approvalStatus: ApprovalStatus | null
  failureReason: string | null
  createdBy: string | null
  ownerId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SocialAnalytic {
  id: string
  postId: string | null
  platform: SocialPlatform
  platformPostId: string | null
  impressions: number
  engagement: number
  shares: number
  comments: number
  likes: number
  fetchedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateSocialPostRequest {
  content: string
  platforms: SocialPlatform[]
  mediaUrls?: string[]
  campaign?: string
  notes?: string
  scheduledAt?: Date | null
  timezone?: string
  approvalRequired?: boolean
}

export interface UpdateSocialPostRequest {
  content?: string
  platforms?: SocialPlatform[]
  mediaUrls?: string[]
  campaign?: string
  notes?: string
  scheduledAt?: Date | null
  timezone?: string
  approvalRequired?: boolean
  approvalStatus?: ApprovalStatus
}

export interface PublishSocialPostRequest {
  postId: string
  platforms?: SocialPlatform[] // Override platforms if needed
}

export interface ConnectSocialAccountRequest {
  provider: SocialPlatform
  code: string // OAuth authorization code
  state: string // OAuth state for CSRF protection
}

export interface DisconnectSocialAccountRequest {
  connectionId: string
}

export interface RefreshTokenRequest {
  connectionId: string
}

export interface FetchAnalyticsRequest {
  postId?: string
  platform?: SocialPlatform
  startDate?: Date
  endDate?: Date
}

// ============================================================================
// OAuth Types
// ============================================================================

export interface OAuthConfig {
  provider: SocialPlatform
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
  authUrl: string
  tokenUrl: string
}

export interface OAuthToken {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  tokenType: string
}

export interface OAuthUserProfile {
  id: string
  handle: string
  displayName: string
  profileImageUrl?: string
  email?: string
}

// ============================================================================
// Platform-Specific Types
// ============================================================================

// Instagram / Facebook (Meta Graph API)
export interface MetaOAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface MetaUserInfo {
  id: string
  username: string
  name: string
  profile_picture_url?: string
}

export interface MetaPublishPostRequest {
  message: string
  link?: string
  type: 'feed' | 'story' // for Instagram stories
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL'
  media_source?: string
}

// X / Twitter (API v2)
export interface TwitterOAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export interface TwitterUserInfo {
  data: {
    id: string
    username: string
    name: string
    profile_image_url?: string
  }
}

export interface TwitterPublishRequest {
  text: string
  reply_settings?: 'everyone' | 'following' | 'mentionedUsers'
  media?: {
    media_ids: string[]
  }
  quote_tweet_id?: string
}

// LinkedIn
export interface LinkedInOAuthResponse {
  access_token: string
  expires_in: number
  token_type: string
}

export interface LinkedInUserInfo {
  localizedFirstName: string
  localizedLastName: string
  profilePicture?: {
    displayImage?: string
  }
}

export interface LinkedInPublishRequest {
  content: {
    contentEntities?: Array<{ entity: string }>
    title?: string
    shareMediaCategory?: 'ARTICLE' | 'IMAGE' | 'NONE'
  }
  distribution?: {
    feedDistribution: 'MAIN_FEED' | 'PRIVATE'
    targetEntities?: string[]
  }
  owner: string // LinkedIn organization URN
  subject?: string
  text: {
    annotations?: unknown[]
    text: string
  }
}

// TikTok
export interface TikTokOAuthResponse {
  data: {
    access_token: string
    expires_in: number
    refresh_expires_in: number
    refresh_token: string
    scope: string
    token_type: string
    open_id: string
  }
}

export interface TikTokUserInfo {
  open_id: string
  union_id?: string
  user_id?: string
}

// YouTube
export interface YouTubeOAuthResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

export interface YouTubeUserInfo {
  kind: string
  etag: string
  items?: Array<{
    id: string
    snippet?: {
      customUrl?: string
      title?: string
      profileImageUrl?: string
    }
  }>
}

// ============================================================================
// Error Handling
// ============================================================================

export class SocialMediaError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'SocialMediaError'
  }
}

export class OAuthError extends SocialMediaError {
  constructor(message: string, code?: string) {
    super(code || 'OAUTH_ERROR', message)
    this.name = 'OAuthError'
  }
}

export class PublishError extends SocialMediaError {
  constructor(message: string, public platform?: SocialPlatform) {
    super('PUBLISH_ERROR', message)
    this.name = 'PublishError'
  }
}

export class TokenExpiredError extends SocialMediaError {
  constructor(public connectionId: string) {
    super('TOKEN_EXPIRED', 'OAuth token has expired')
    this.name = 'TokenExpiredError'
  }
}

// ============================================================================
// Analytics & Metrics
// ============================================================================

export interface PostMetrics {
  impressions: number
  engagement: number
  likes: number
  comments: number
  shares: number
  engagementRate: number // percentage
}

export interface PostAnalyticsSummary {
  postId: string
  content: string
  platforms: Map<SocialPlatform, PostMetrics>
  averageEngagementRate: number
  bestPerformingPlatform?: SocialPlatform
  totalReach: number
  createdAt: Date
  postedAt?: Date
}

// ============================================================================
// Campaign Management
// ============================================================================

export interface CampaignData {
  name: string
  description?: string
  platforms: SocialPlatform[]
  startDate: Date
  endDate?: Date
  budget?: number
  goals?: string[]
}

export interface CampaignAnalytics {
  campaign: string
  totalPosts: number
  totalReach: number
  totalEngagement: number
  averageEngagementRate: number
  platformBreakdown: Record<SocialPlatform, PostMetrics>
}
