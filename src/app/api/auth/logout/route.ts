import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { successResponse } from '@/lib/api/response'
import { AuthError } from '@/lib/api/errors'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { logLogout } from '@/lib/security/audit'

export const POST = apiHandler(async (req: NextRequest) => {
  const token = req.cookies.get('accessToken')?.value
  if (!token) {
    throw new AuthError('Not authenticated')
  }

  const decoded = verifyAccessToken(token)
  if (!decoded) {
    throw new AuthError('Invalid or expired token')
  }

  await logLogout(decoded.userId)

  const response = successResponse({ message: 'Logged out successfully' })

  response.cookies.set('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  response.cookies.set('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
})
