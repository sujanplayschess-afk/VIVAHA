import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { successResponse } from '@/lib/api/response'
import { ValidationError, AuthError, NotFoundError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'
import { sanitizeEmail } from '@/lib/security/sanitize'

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { email, otp } = body

  if (!email || !otp) {
    throw new ValidationError('Email and OTP are required')
  }

  const sanitizedEmail = sanitizeEmail(email)

  const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } })
  if (!user) {
    throw new NotFoundError('User not found')
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

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      otp: null,
      otpExpiresAt: null,
    },
  })

  return successResponse({ message: 'Email verified successfully' })
})
