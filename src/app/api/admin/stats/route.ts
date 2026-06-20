import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireRole } from '@/lib/auth-helpers'
import { successResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

export const GET = apiHandler(async (req: NextRequest) => {
  await requireRole(req, ['ADMIN', 'SUPER_ADMIN'])

  const [totalUsers, activeUsers, premiumUsers, pendingVerifications, reports, newToday] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { role: { in: ['PREMIUM_USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'] } } }),
    prisma.user.count({ where: { status: 'PENDING_VERIFICATION' } }),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    }),
  ])

  const recentUsers = await prisma.user.findMany({
    where: { role: 'USER' },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      profileId: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      profile: { select: { firstName: true, lastName: true } },
    },
  })

  const verifiedCount = await prisma.verificationDocument.count({ where: { status: 'APPROVED' } })

  return successResponse({
    totalUsers,
    activeUsers,
    premiumUsers,
    pendingVerifications,
    reports,
    newToday,
    verifiedCount,
    recentUsers: (recentUsers as Array<{profileId: string; email: string; role: string; status: string; createdAt: Date; profile: {firstName: string; lastName: string | null} | null}>).map((u) => ({
      id: u.profileId,
      name: u.profile ? `${u.profile.firstName} ${u.profile.lastName || ''}`.trim() : u.email,
      email: u.email,
      role: u.role,
      status: u.status,
      joined: formatRelativeTime(u.createdAt),
    })),
  })
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
