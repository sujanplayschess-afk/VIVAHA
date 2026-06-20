import { AppError } from '@/lib/api/errors'

interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitOptions {
  max?: number
  windowMs?: number
}

const store = new Map<string, RateLimitEntry>()

const AUTH_ROUTES = ['/api/auth/login', '/api/auth/register', '/api/auth/otp']
const AUTH_MAX = 5
const AUTH_WINDOW_MS = 15 * 60 * 1000

const GENERAL_MAX = 100
const GENERAL_WINDOW_MS = 60 * 1000

export async function rateLimit(
  identifier: string,
  path: string,
  options: RateLimitOptions = {},
): Promise<void> {
  const isAuthRoute = AUTH_ROUTES.some((route) => path.startsWith(route))
  const max = options.max ?? (isAuthRoute ? AUTH_MAX : GENERAL_MAX)
  const windowMs = options.windowMs ?? (isAuthRoute ? AUTH_WINDOW_MS : GENERAL_WINDOW_MS)

  const key = `${identifier}:${path}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return
  }

  if (entry.count >= max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    const err = new AppError(
      `Too many requests. Try again in ${retryAfter} seconds.`,
      429,
      'RATE_LIMIT',
    )
    err.headers = { 'Retry-After': String(retryAfter) } as Record<string, string>
    throw err
  }

  entry.count++
}

export function resetRateLimit(identifier: string, path: string): void {
  const key = `${identifier}:${path}`
  store.delete(key)
}

export function clearRateLimitStore(): void {
  store.clear()
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key)
      }
    }
  }, 60 * 1000)
}
