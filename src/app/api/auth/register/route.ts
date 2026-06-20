import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { createdResponse } from '@/lib/api/response'
import { ValidationError } from '@/lib/api/errors'
import { registerSchema } from '@/lib/validations/auth'
import { hashPassword, generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sanitizeEmail, sanitizeString } from '@/lib/security/sanitize'
import { logRegistration } from '@/lib/security/audit'

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(
      'Validation failed',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    )
  }

  const { firstName, lastName, gender, dateOfBirth, phone, email, password, religion, motherTongue } = parsed.data

  const sanitizedEmail = sanitizeEmail(email)
  const sanitizedPhone = sanitizeString(phone)

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: sanitizedEmail }, { phone: sanitizedPhone }],
    },
  })

  if (existing) {
    throw new ValidationError('A user with this email or phone already exists')
  }

  const passwordHash = await hashPassword(password)

  const count = await prisma.user.count()
  const profileId = `VST-${String(count + 1).padStart(6, '0')}`

  const user = await prisma.user.create({
    data: {
      email: sanitizedEmail,
      phone: sanitizedPhone,
      passwordHash,
      profileId,
      profile: {
        create: {
          firstName: sanitizeString(firstName),
          lastName: sanitizeString(lastName),
          gender,
          dateOfBirth: new Date(dateOfBirth),
          age: Math.floor(
            (new Date().getTime() - new Date(dateOfBirth).getTime()) /
              (1000 * 60 * 60 * 24 * 365),
          ),
          profileCreatedBy: 'SELF',
          religion: sanitizeString(religion),
          motherTongue: sanitizeString(motherTongue),
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
})
