/**
 * OAuth Utilities
 * 
 * Helper functions for OAuth operations:
 * - State token management (Redis-compatible)
 * - Token encryption/decryption
 * - Token validation and expiration checks
 */

import crypto from 'crypto'

/**
 * Simple in-memory state storage (for development)
 * In production, use Redis
 */
class InMemoryStateStorage {
  private states: Map<string, { userId: string; expiresAt: number }> = new Map()

  async set(key: string, userId: string, expiresInSeconds: number): Promise<void> {
    const expiresAt = Date.now() + expiresInSeconds * 1000
    this.states.set(key, { userId, expiresAt })
  }

  async get(key: string): Promise<string | null> {
    const entry = this.states.get(key)
    if (!entry) return null
    
    if (entry.expiresAt < Date.now()) {
      this.states.delete(key)
      return null
    }
    
    return entry.userId
  }

  async delete(key: string): Promise<void> {
    this.states.delete(key)
  }

  // Cleanup expired entries every 5 minutes
  startCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.states.entries()) {
        if (entry.expiresAt < now) {
          this.states.delete(key)
        }
      }
    }, 5 * 60 * 1000)
  }
}

/**
 * Encrypt sensitive data (tokens)
 * Use a proper KMS in production (Supabase Vault, AWS KMS, etc)
 */
export function encryptToken(token: string, secret: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(secret.padEnd(32, '0').slice(0, 32)),
    iv,
  )
  
  let encrypted = cipher.update(token, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

/**
 * Decrypt sensitive data (tokens)
 */
export function decryptToken(encryptedToken: string, secret: string): string {
  const parts = encryptedToken.split(':')
  if (parts.length !== 3) throw new Error('Invalid encrypted token format')
  
  const iv = Buffer.from(parts[0], 'hex')
  const authTag = Buffer.from(parts[1], 'hex')
  const encrypted = parts[2]
  
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(secret.padEnd(32, '0').slice(0, 32)),
    iv,
  )
  
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(expiresAt: Date | null, bufferMinutes: number = 5): boolean {
  if (!expiresAt) return false
  
  const bufferMs = bufferMinutes * 60 * 1000
  return new Date().getTime() + bufferMs > expiresAt.getTime()
}

/**
 * Get time until token expires (in milliseconds)
 */
export function getTokenTimeToExpiry(expiresAt: Date | null): number | null {
  if (!expiresAt) return null
  return expiresAt.getTime() - new Date().getTime()
}

/**
 * Format OAuth scopes for display
 */
export function formatOAuthScopes(scopes: string[]): string {
  return scopes
    .map(scope => {
      // Convert snake_case or dot.notation to readable format
      return scope
        .split(/[._]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    })
    .join(', ')
}

/**
 * Validate OAuth response for required fields
 */
export function validateOAuthResponse(response: Record<string, unknown>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!response.access_token) errors.push('Missing access_token')
  if (!response.token_type) errors.push('Missing token_type')
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Parse OAuth error response
 */
export function parseOAuthError(
  response: Record<string, unknown>,
): { code: string; message: string } {
  return {
    code: (response.error as string) || 'UNKNOWN_ERROR',
    message: (response.error_description as string) || 'Unknown OAuth error',
  }
}

/**
 * Build redirect URL with query parameters
 */
export function buildRedirectUrl(
  baseUrl: string,
  params: Record<string, string | null>,
): string {
  const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null) {
      url.searchParams.append(key, value)
    }
  })
  
  return url.toString()
}

/**
 * Get state storage instance
 * Use Redis in production
 */
let stateStorage: InMemoryStateStorage | null = null

export function getStateStorage(): InMemoryStateStorage {
  if (!stateStorage) {
    stateStorage = new InMemoryStateStorage()
    stateStorage.startCleanup()
  }
  return stateStorage
}

/**
 * Initialize OAuth utilities
 */
export function initializeOAuthUtils(): void {
  getStateStorage()
}

export default {
  encryptToken,
  decryptToken,
  isTokenExpired,
  getTokenTimeToExpiry,
  formatOAuthScopes,
  validateOAuthResponse,
  parseOAuthError,
  buildRedirectUrl,
  getStateStorage,
  initializeOAuthUtils,
}
