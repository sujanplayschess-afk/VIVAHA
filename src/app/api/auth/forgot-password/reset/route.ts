import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { successResponse } from '@/lib/api/response'
import { ValidationError, AuthError, NotFoundError } from '@/lib/api/errors'
import { hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sanitizeEmail } from '@/lib/security/sanitize'
import { logPasswordChange } from '@/lib/security/audit'

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { email, token, newPassword } = body

  if (!email || !token || !newPassword) {
    throw new ValidationError('Email, token, and newPassword are required')
  }

  if (newPassword.length < 8) {
    throw new ValidationError('Password must be at least 8 characters')
  }

  const sanitizedEmail = sanitizeEmail(email)

  const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } })
  if (!user) {
    throw new NotFoundError('User not found')
  }

  if (!user.resetToken || !user.resetTokenExpiresAt) {
    throw new AuthError('No reset token requested')
  }

  if (new Date() > user.resetTokenExpiresAt) {
    throw new AuthError('Reset token has expired')
  }

  if (user.resetToken !== token) {
    throw new AuthError('Invalid reset token')
  }

  const passwordHash = await hashPassword(newPassword)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  })

  await logPasswordChange(user.id)

  return successResponse({ message: 'Password reset successfully' })
})
