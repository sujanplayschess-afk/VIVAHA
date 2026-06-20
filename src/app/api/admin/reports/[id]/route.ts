import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireRole } from '@/lib/auth-helpers'
import { successResponse, errorResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

export const PATCH = apiHandler(async (req: NextRequest, { params }) => {
  await requireRole(req, ['ADMIN', 'SUPER_ADMIN'])
  const { id } = await params as { id: string }

  const { status } = await req.json()
  if (!status || !['INVESTIGATING', 'RESOLVED', 'DISMISSED'].includes(status)) {
    return errorResponse('Invalid status')
  }

  const report = await prisma.report.findUnique({ where: { id } })
  if (!report) {
    return errorResponse('Report not found', 404)
  }

  const updated = await prisma.report.update({
    where: { id },
    data: { status },
  })

  return successResponse(updated, `Report ${status.toLowerCase()} successfully`)
}, { csrfDisabled: true })
