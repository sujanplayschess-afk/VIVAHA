import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { apiHandler } from '@/lib/api/handler'
import { successResponse } from '@/lib/api/response'
import { ValidationError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'
import { sanitizePhone } from '@/lib/security/sanitize'

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { phone } = body

  if (!phone || typeof phone !== 'string') {
    throw new ValidationError('Phone is required')
  }

  const sanitizedPhone = sanitizePhone(phone)

  const otp = crypto.randomInt(100000, 999999).toString()
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

  const existingUser = await prisma.user.findUnique({ where: { phone: sanitizedPhone } })

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { otp, otpExpiresAt },
    })
  } else {
    const count = await prisma.user.count()
    const profileId = `VST-${String(count + 1).padStart(6, '0')}`

    await prisma.user.create({
      data: {
        email: `phone-${sanitizedPhone}@temp.vivahasetu.com`,
        phone: sanitizedPhone,
        profileId,
        otp,
        otpExpiresAt,
        profile: {
          create: {
            firstName: 'User',
            lastName: '',
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
    })
  }

  if (process.env.NODE_ENV === 'development') {
    return successResponse({ message: 'OTP sent successfully', otp }, undefined, 200)
  }

  return successResponse({ message: 'OTP sent successfully' }, undefined, 200)
})
