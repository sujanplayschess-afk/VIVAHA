import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireRole } from '@/lib/auth-helpers'
import { successResponse, errorResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

export const PATCH = apiHandler(async (req: NextRequest, { params }) => {
  await requireRole(req, ['SUPER_ADMIN'])
  const { id } = await params as { id: string }

  const { role, status } = await req.json()
  if (!role && !status) {
    return errorResponse('Nothing to update')
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return errorResponse('User not found', 404)
  }

  const data: Record<string, string> = {}
  if (role) data.role = role
  if (status) data.status = status

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      profileId: true,
      email: true,
      role: true,
      status: true,
      profile: { select: { firstName: true, lastName: true } },
    },
  })

  return successResponse({
    ...updated,
    name: updated.profile ? `${updated.profile.firstName} ${updated.profile.lastName || ''}`.trim() : updated.email,
  }, 'User updated successfully')
}, { csrfDisabled: true })
