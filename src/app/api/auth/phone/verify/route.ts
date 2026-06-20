import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { successResponse } from '@/lib/api/response'
import { AuthError, ValidationError } from '@/lib/api/errors'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sanitizePhone } from '@/lib/security/sanitize'
import { logRegistration } from '@/lib/security/audit'

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { phone, otp } = body

  if (!phone || !otp) {
    throw new ValidationError('Phone and OTP are required')
  }

  const sanitizedPhone = sanitizePhone(phone)

  const user = await prisma.user.findUnique({
    where: { phone: sanitizedPhone },
    include: { profile: true },
  })

  if (!user) {
    throw new AuthError('No user found with this phone number')
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new AuthError('No OTP requested')
  }

  if (new Date() > user.otpExpiresAt) {
    throw new AuthError('OTP has expired')
  }

  if (user.otp !== otp) {
    throw new AuthError('Invalid OTP')
  }

  const isNewUser = !user.emailVerified && !user.phoneVerified

  await prisma.user.update({
    where: { id: user.id },
    data: {
      phoneVerified: true,
      emailVerified: true,
      otp: null,
      otpExpiresAt: null,
    },
  })

  if (isNewUser) {
    await logRegistration(user.id)
  }

  const tokenPayload = { userId: user.id, email: user.email, role: user.role }
  const accessToken = generateAccessToken(tokenPayload)
  const refreshToken = generateRefreshToken(tokenPayload)

  const response = successResponse({
    user: {
      id: user.id,
      profileId: user.profileId,
      email: user.email,
      phone: user.phone,
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
})
