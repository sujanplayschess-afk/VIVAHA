import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { successResponse } from '@/lib/api/response'
import { AuthError } from '@/lib/api/errors'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = apiHandler(async (req: NextRequest) => {
  const token = req.cookies.get('accessToken')?.value
  if (!token) {
    throw new AuthError('Not authenticated')
  }

  const decoded = verifyAccessToken(token)
  if (!decoded) {
    throw new AuthError('Invalid or expired token')
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      profile: true,
      preferences: true,
      privacySettings: true,
      subscription: {
        include: { plan: true },
      },
    },
  })

  if (!user) {
    throw new AuthError('User not found')
  }

  return successResponse({ user })
})
