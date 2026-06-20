import { NextRequest, NextResponse } from 'next/server'
import { AppError, AuthError } from './errors'
import { errorResponse } from './response'
import { rateLimit } from '@/lib/security/rate-limit'
import { validateCsrfToken, getCsrfHeaderName } from '@/lib/security/csrf'

type RouteContext = { params: Promise<unknown> }
type ApiHandler = (req: NextRequest, context: RouteContext) => Promise<NextResponse>

interface HandlerOptions {
  rateLimitDisabled?: boolean
  rateLimitMax?: number
  rateLimitWindowMs?: number
  csrfDisabled?: boolean
  corsEnabled?: boolean
}

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

export function apiHandler(handler: ApiHandler, options: HandlerOptions = {}) {
  return async (req: NextRequest, context: RouteContext): Promise<NextResponse> => {
    try {
      if (options.corsEnabled && req.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
            'Access-Control-Allow-Headers': `Content-Type, Authorization, ${getCsrfHeaderName()}`,
            'Access-Control-Max-Age': '86400',
          },
        })
      }

      if (!options.rateLimitDisabled) {
        const forwarded = req.headers.get('x-forwarded-for')
        const ip = forwarded?.split(',')[0]?.trim() || '127.0.0.1'
        await rateLimit(ip, req.nextUrl.pathname, {
          max: options.rateLimitMax,
          windowMs: options.rateLimitWindowMs,
        })
      }

      if (!options.csrfDisabled && MUTATING_METHODS.has(req.method)) {
        const token = req.headers.get(getCsrfHeaderName()) || ''
        if (!token) {
          throw new AuthError(`Missing ${getCsrfHeaderName()} header`)
        }
        validateCsrfToken(token)
      }

      const response = await handler(req, context)

      if (options.corsEnabled && response.headers) {
        response.headers.set('Access-Control-Allow-Origin', '*')
      }

      return response
    } catch (error) {
      if (error instanceof AppError) {
        return errorResponse(error.message, error.statusCode, error.code)
      }
      console.error('Unhandled API error:', error)
      return errorResponse('Internal server error', 500, 'INTERNAL_ERROR')
    }
  }
}
