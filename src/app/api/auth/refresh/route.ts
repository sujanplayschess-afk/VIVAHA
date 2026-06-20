import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { successResponse } from '@/lib/api/response'
import { AuthError } from '@/lib/api/errors'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const POST = apiHandler(async (req: NextRequest) => {
  const refreshTokenValue = req.cookies.get('refreshToken')?.value
  if (!refreshTokenValue) {
    throw new AuthError('No refresh token provided')
  }

  const decoded = verifyRefreshToken(refreshTokenValue)
  if (!decoded) {
    throw new AuthError('Invalid or expired refresh token')
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { profile: true },
  })

  if (!user) {
    throw new AuthError('User not found')
  }

  const tokenPayload = { userId: user.id, email: user.email, role: user.role }
  const newAccessToken = generateAccessToken(tokenPayload)
  const newRefreshToken = generateRefreshToken(tokenPayload)

  const response = successResponse({
    user: {
      id: user.id,
      profileId: user.profileId,
      email: user.email,
      role: user.role,
      profile: user.profile,
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  })

  response.cookies.set('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  })

  response.cookies.set('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  return response
})
