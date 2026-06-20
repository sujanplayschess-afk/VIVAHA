import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { apiHandler } from '@/lib/api/handler'
import { successResponse } from '@/lib/api/response'
import { ValidationError, NotFoundError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'
import { sanitizeEmail } from '@/lib/security/sanitize'

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { email } = body

  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email is required')
  }

  const sanitizedEmail = sanitizeEmail(email)

  const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } })
  if (!user) {
    throw new NotFoundError('User not found')
  }

  const otp = crypto.randomInt(100000, 999999).toString()
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpiresAt },
  })

  if (process.env.NODE_ENV === 'development') {
    return successResponse({ message: 'OTP sent successfully', otp }, undefined, 200)
  }

  return successResponse({ message: 'OTP sent successfully' }, undefined, 200)
})
