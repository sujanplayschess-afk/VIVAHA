import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { successResponse } from '@/lib/api/response'
import { AuthError, ValidationError } from '@/lib/api/errors'
import { loginSchema } from '@/lib/validations/auth'
import { verifyPassword, generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sanitizeEmail } from '@/lib/security/sanitize'
import { logLogin } from '@/lib/security/audit'
import { getDeviceInfo } from '@/lib/security/device'

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(
      'Validation failed',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    )
  }

  const { email, password } = parsed.data
  const sanitizedEmail = sanitizeEmail(email)

  const user = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
    include: { profile: true },
  })

  if (!user || !user.passwordHash) {
    throw new AuthError('Invalid email or password')
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    throw new AuthError('Invalid email or password')
  }

  const deviceInfo = getDeviceInfo(req)
  const forwarded = req.headers.get('x-forwarded-for')
  const ipAddress = forwarded?.split(',')[0]?.trim() || '127.0.0.1'

  await prisma.loginHistory.create({
    data: {
      userId: user.id,
      ipAddress,
      device: `${deviceInfo.os} ${deviceInfo.osVersion}`,
      browser: `${deviceInfo.browser} ${deviceInfo.browserVersion}`,
    },
  })

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
      loginCount: { increment: 1 },
    },
  })

  await logLogin(user.id, ipAddress)

  const tokenPayload = { id: user.id, profileId: user.profileId, email: user.email, role: user.role }
  const accessToken = generateAccessToken(tokenPayload)
  const refreshToken = generateRefreshToken(tokenPayload)

  const response = successResponse({
    user: {
      id: user.id,
      profileId: user.profileId,
      email: user.email,
      role: user.role,
      profile: user.profile,
    },
    accessToken,
    refreshToken,
  })

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  })

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  return response
}, { csrfDisabled: true, rateLimitDisabled: true })
