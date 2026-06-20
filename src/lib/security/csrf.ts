import crypto from 'crypto'
import { AuthError } from '@/lib/api/errors'

const TOKEN_LENGTH = 32
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000

const tokenStore = new Map<string, number>()

export function generateCsrfToken(): string {
  const token = crypto.randomBytes(TOKEN_LENGTH).toString('hex')
  tokenStore.set(token, Date.now() + TOKEN_EXPIRY_MS)
  return token
}

export function validateCsrfToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    throw new AuthError('Missing CSRF token')
  }

  const expiry = tokenStore.get(token)
  if (!expiry) {
    throw new AuthError('Invalid CSRF token')
  }

  if (Date.now() > expiry) {
    tokenStore.delete(token)
    throw new AuthError('CSRF token expired')
  }

  tokenStore.delete(token)
  return true
}

export function getCsrfHeaderName(): string {
  return 'x-csrf-token'
}

export function clearExpiredTokens(): void {
  const now = Date.now()
  for (const [token, expiry] of tokenStore.entries()) {
    if (now > expiry) {
      tokenStore.delete(token)
    }
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(clearExpiredTokens, 60 * 60 * 1000)
}
