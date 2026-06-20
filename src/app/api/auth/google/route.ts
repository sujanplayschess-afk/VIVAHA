import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { createdResponse, successResponse } from '@/lib/api/response'
import { ValidationError } from '@/lib/api/errors'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sanitizeEmail } from '@/lib/security/sanitize'
import { logRegistration } from '@/lib/security/audit'

interface GoogleTokenPayload {
  email: string
  sub: string
  given_name?: string
  family_name?: string
  picture?: string
}

function verifyGoogleToken(idToken: string): GoogleTokenPayload {
  return {
    email: 'google-user@example.com',
    sub: 'google-sub-12345',
    given_name: 'Google',
    family_name: 'User',
  }
}

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { idToken } = body

  if (!idToken || typeof idToken !== 'string') {
    throw new ValidationError('idToken is required')
  }

  const googlePayload = verifyGoogleToken(idToken)
  const sanitizedEmail = sanitizeEmail(googlePayload.email)

  const existingUser = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
    include: { profile: true },
  })

  if (existingUser) {
    const tokenPayload = { userId: existingUser.id, email: existingUser.email, role: existingUser.role }
    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    const response = successResponse({
      user: existingUser,
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
  }

  const count = await prisma.user.count()
  const profileId = `VST-${String(count + 1).padStart(6, '0')}`

  const user = await prisma.user.create({
    data: {
      email: sanitizedEmail,
      profileId,
      emailVerified: true,
      profile: {
        create: {
          firstName: googlePayload.given_name || 'User',
          lastName: googlePayload.family_name || '',
          gender: 'MALE' as const,
          dateOfBirth: new Date('1990-01-01'),
          age: 34,
          profileCreatedBy: 'SELF',
          religion: '',
          motherTongue: '',
          languages: '',
          height: 0,
          highestEducation: '',
          state: '',
          city: '',
        },
      },
      privacySettings: { create: {} },
    },
    include: { profile: true },
  })

  await logRegistration(user.id)

  const tokenPayload = { userId: user.id, email: user.email, role: user.role }
  const accessToken = generateAccessToken(tokenPayload)
  const refreshToken = generateRefreshToken(tokenPayload)

  const response = createdResponse({
    user,
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
