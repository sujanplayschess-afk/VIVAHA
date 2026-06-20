import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireRole } from '@/lib/auth-helpers'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

type UserRecord = {
  id: string
  profileId: string
  email: string
  phone: string | null
  role: string
  status: string
  emailVerified: boolean
  createdAt: Date
  profile: { firstName: string; lastName: string | null } | null
}

export const GET = apiHandler(async (req: NextRequest) => {
  await requireRole(req, ['ADMIN', 'SUPER_ADMIN'])

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 10))
  const search = searchParams.get('search') || ''
  const role = searchParams.get('role') || ''
  const status = searchParams.get('status') || ''

  const where: Record<string, unknown> = {}
  if (role) where.role = role
  if (status) where.status = status
  if (search) {
    where.OR = [
      { email: { contains: search } },
      { profileId: { contains: search } },
      { profile: { firstName: { contains: search } } },
      { profile: { lastName: { contains: search } } },
    ]
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where: where as any }),
    prisma.user.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        profileId: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        profile: { select: { firstName: true, lastName: true } },
      },
    }),
  ])

  const mapped = (users as UserRecord[]).map((u) => ({
    id: u.id,
    profileId: u.profileId,
    name: u.profile ? `${u.profile.firstName} ${u.profile.lastName || ''}`.trim() : u.email,
    email: u.email,
    phone: u.phone || '',
    role: u.role,
    status: u.status,
    emailVerified: u.emailVerified,
    joined: formatRelativeTime(u.createdAt),
  }))

  return paginatedResponse(mapped, page, limit, total)
})

export const PATCH = apiHandler(async (req: NextRequest) => {
  await requireRole(req, ['SUPER_ADMIN'])

  const { ids, role, status } = await req.json()
  if (!Array.isArray(ids) || ids.length === 0) {
    return errorResponse('No user IDs provided')
  }

  const data: Record<string, string> = {}
  if (role) data.role = role
  if (status) data.status = status

  if (Object.keys(data).length === 0) {
    return errorResponse('No updates provided')
  }

  await prisma.user.updateMany({
    where: { id: { in: ids } },
    data,
  })

  return successResponse({ updated: ids.length }, `${ids.length} user(s) updated`)
}, { csrfDisabled: true })

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
