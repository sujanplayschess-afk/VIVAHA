import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireRole } from '@/lib/auth-helpers'
import { successResponse, errorResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

export const POST = apiHandler(async (req: NextRequest, { params }) => {
  await requireRole(req, ['ADMIN', 'SUPER_ADMIN'])
  const { id } = await params as { id: string }

  const { action, notes } = await req.json()
  if (!action || !['APPROVED', 'REJECTED'].includes(action)) {
    return errorResponse('Invalid action. Must be APPROVED or REJECTED')
  }

  const doc = await prisma.verificationDocument.findUnique({ where: { id } })
  if (!doc) {
    return errorResponse('Verification document not found', 404)
  }

  const updated = await prisma.verificationDocument.update({
    where: { id },
    data: {
      status: action,
      notes: notes || undefined,
    },
  })

  if (action === 'APPROVED') {
    await prisma.user.update({
      where: { id: doc.userId },
      data: { idVerified: true, status: 'ACTIVE' },
    })
  }

  return successResponse(updated, `Verification ${action.toLowerCase()} successfully`)
}, { csrfDisabled: true })
