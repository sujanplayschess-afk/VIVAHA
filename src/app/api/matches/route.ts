import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { paginatedResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

export const GET = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const url = new URL(req.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))

  const sentAccepted = await prisma.interest.findMany({
    where: { senderId: user.id, status: 'ACCEPTED' },
    select: { receiverId: true },
  })

  const receivedAccepted = await prisma.interest.findMany({
    where: { receiverId: user.id, status: 'ACCEPTED' },
    select: { senderId: true },
  })

  const matchedUserIds = [
    ...sentAccepted.map((i: { receiverId: string }) => i.receiverId),
    ...receivedAccepted.map((i: { senderId: string }) => i.senderId),
  ]

  const uniqueIds = [...new Set(matchedUserIds)]

  if (uniqueIds.length === 0) {
    return paginatedResponse([], page, limit, 0)
  }

  const [total, profiles] = await Promise.all([
    prisma.profile.count({
      where: { userId: { in: uniqueIds } },
    }),
    prisma.profile.findMany({
      where: { userId: { in: uniqueIds } },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        user: { select: { id: true, profileId: true, isVerified: true, lastLogin: true } },
      },
    }),
  ])

  const matchedAtMap = new Map<string, Date>()
  for (const i of sentAccepted) {
    const interest = await prisma.interest.findFirst({
      where: { senderId: user.id, receiverId: i.receiverId, status: 'ACCEPTED' },
      select: { respondedAt: true },
    })
    if (interest?.respondedAt) matchedAtMap.set(i.receiverId, interest.respondedAt)
  }
  for (const i of receivedAccepted) {
    const interest = await prisma.interest.findFirst({
      where: { senderId: i.senderId, receiverId: user.id, status: 'ACCEPTED' },
      select: { respondedAt: true },
    })
    if (interest?.respondedAt && !matchedAtMap.has(i.senderId)) {
      matchedAtMap.set(i.senderId, interest.respondedAt)
    }
  }

  const data = profiles.map((p: any) => ({
    ...p,
    matchedAt: matchedAtMap.get(p.userId) || null,
  }))

  return paginatedResponse(data, page, limit, total)
})
