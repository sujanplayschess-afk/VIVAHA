import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireRole } from '@/lib/auth-helpers'
import { successResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

export const GET = apiHandler(async (req: NextRequest) => {
  await requireRole(req, ['ADMIN', 'SUPER_ADMIN'])

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1)

  const [
    totalUsers,
    activeUsers,
    premiumUsers,
    totalReports,
    pendingReports,
    totalVerifications,
    approvedVerifications,
    usersThisMonth,
    usersThisYear,
    totalMale,
    totalFemale,
    subscriptionData,
    recentUsers,
    recentPremium,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { role: { in: ['PREMIUM_USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'] } } }),
    prisma.report.count(),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.verificationDocument.count(),
    prisma.verificationDocument.count({ where: { status: 'APPROVED' } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfYear } } }),
    prisma.user.count({ where: { profile: { gender: 'MALE' } } }),
    prisma.user.count({ where: { profile: { gender: 'FEMALE' } } }),
    prisma.subscriptionPlan.findMany({
      include: { _count: { select: { subscriptions: true } } },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true, role: true },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  const totalWithProfile = totalMale + totalFemale
  const genderRatio = {
    male: totalWithProfile > 0 ? Math.round((totalMale / totalWithProfile) * 100) : 0,
    female: totalWithProfile > 0 ? Math.round((totalFemale / totalWithProfile) * 100) : 0,
  }

  const totalSubscriptions = subscriptionData.reduce((sum: number, p: { _count: { subscriptions: number } }) => sum + p._count.subscriptions, 0)
  const subscriptionBreakdown = subscriptionData.map((p: { name: string; _count: { subscriptions: number } }) => ({
    plan: p.name,
    percentage: totalSubscriptions > 0 ? Math.round((p._count.subscriptions / totalSubscriptions) * 100) : 0,
  }))

  const monthlyMap = new Map<string, { users: number; premium: number }>()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const label = monthNames[d.getMonth()]
    monthlyMap.set(label, { users: 0, premium: 0 })
  }

  for (const u of recentUsers) {
    const label = monthNames[u.createdAt.getMonth()]
    const entry = monthlyMap.get(label)
    if (entry) {
      entry.users++
      if (['PREMIUM_USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(u.role)) {
        entry.premium++
      }
    }
  }

  const monthlyGrowth = Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    users: data.users,
    premium: data.premium,
  }))

  const premiumConversion = totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 10000) / 100 : 0
  const verifiedPercentage = totalVerifications > 0 ? Math.round((approvedVerifications / totalVerifications) * 100) : 0

  return successResponse({
    summary: {
      totalUsers,
      activeUsers,
      premiumUsers,
      premiumConversion,
      newThisMonth: usersThisMonth,
      newThisYear: usersThisYear,
      totalReports,
      pendingReports,
      verifiedPercentage,
    },
    genderRatio,
    subscriptionBreakdown,
    monthlyGrowth,
  })
})
