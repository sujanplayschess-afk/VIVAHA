import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireRole } from '@/lib/auth-helpers'
import { paginatedResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

type ReportRecord = {
  id: string
  reason: string
  description: string | null
  status: string
  createdAt: Date
  reporter: { profileId: string; profile: { firstName: string; lastName: string | null } | null }
  reported: { profileId: string; profile: { firstName: string; lastName: string | null } | null }
}

export const GET = apiHandler(async (req: NextRequest) => {
  await requireRole(req, ['ADMIN', 'SUPER_ADMIN'])

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 10))
  const status = searchParams.get('status') || ''
  const search = searchParams.get('search') || ''

  const where: Record<string, unknown> = {}
  if (status && status !== 'ALL') where.status = status
  if (search) {
    where.OR = [
      { reason: { contains: search } },
      { reporter: { profile: { firstName: { contains: search } } } },
      { reporter: { profile: { lastName: { contains: search } } } },
      { reported: { profile: { firstName: { contains: search } } } },
      { reported: { profile: { lastName: { contains: search } } } },
    ]
  }

  const [total, reports] = await Promise.all([
    prisma.report.count({ where: where as any }),
    prisma.report.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reporter: {
          select: {
            profileId: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
        reported: {
          select: {
            profileId: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
  ])

  const mapped = (reports as ReportRecord[]).map((r) => ({
    id: r.id,
    reporterId: r.reporter.profileId,
    reporterName: r.reporter.profile ? `${r.reporter.profile.firstName} ${r.reporter.profile.lastName || ''}`.trim() : r.reporter.profileId,
    reportedId: r.reported.profileId,
    reportedName: r.reported.profile ? `${r.reported.profile.firstName} ${r.reported.profile.lastName || ''}`.trim() : r.reported.profileId,
    reason: r.reason,
    description: r.description || '',
    status: r.status,
    date: r.createdAt.toISOString().split('T')[0],
  }))

  return paginatedResponse(mapped, page, limit, total)
})
