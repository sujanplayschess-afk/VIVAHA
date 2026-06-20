import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireRole } from '@/lib/auth-helpers'
import { paginatedResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

type VerificationRecord = {
  id: string
  type: string
  status: string
  notes: string | null
  createdAt: Date
  user: { profileId: string; profile: { firstName: string; lastName: string | null } | null }
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
      { user: { profile: { firstName: { contains: search } } } },
      { user: { profile: { lastName: { contains: search } } } },
      { user: { profileId: { contains: search } } },
    ]
  }

  const [total, verifications] = await Promise.all([
    prisma.verificationDocument.count({ where: where as any }),
    prisma.verificationDocument.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            profileId: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
  ])

  const mapped = (verifications as VerificationRecord[]).map((v) => ({
    id: v.id,
    userName: v.user.profile ? `${v.user.profile.firstName} ${v.user.profile.lastName || ''}`.trim() : v.user.profileId,
    userProfileId: v.user.profileId,
    documentType: v.type,
    status: v.status,
    notes: v.notes || undefined,
    uploadedAt: v.createdAt.toISOString().split('T')[0],
  }))

  return paginatedResponse(mapped, page, limit, total)
})
