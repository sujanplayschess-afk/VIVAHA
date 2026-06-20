import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { successResponse, paginatedResponse } from '@/lib/api/response'
import { ValidationError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const markReadSchema = z.object({
  ids: z.array(z.string()).optional(),
  all: z.boolean().optional(),
})

export const GET = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const url = new URL(req.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))
  const unreadOnly = url.searchParams.get('unreadOnly') === 'true'

  const where: any = { userId: user.id }
  if (unreadOnly) where.isRead = false

  const [total, notifications] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const thisWeekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)

  const grouped: Record<string, typeof notifications> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Earlier: [],
  }

  for (const n of notifications) {
    const d = new Date(n.createdAt)
    if (d >= today) {
      grouped['Today'].push(n)
    } else if (d >= yesterday) {
      grouped['Yesterday'].push(n)
    } else if (d >= thisWeekStart) {
      grouped['This Week'].push(n)
    } else {
      grouped['Earlier'].push(n)
    }
  }

  const data = Object.entries(grouped)
    .filter(([, items]) => items.length > 0)
    .map(([date, items]) => ({ date, notifications: items }))

  return successResponse({ groups: data, total })
})

export const PUT = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const body = await req.json()
  const parsed = markReadSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(
      'Validation failed',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    )
  }

  const { ids, all } = parsed.data

  if (all) {
    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    })
    return successResponse({ count: await prisma.notification.count({ where: { userId: user.id, isRead: false } }) }, 'All notifications marked as read')
  }

  if (ids && ids.length > 0) {
    await prisma.notification.updateMany({
      where: { id: { in: ids }, userId: user.id },
      data: { isRead: true },
    })
  }

  return successResponse({ count: await prisma.notification.count({ where: { userId: user.id, isRead: false } }) }, 'Notifications marked as read')
})
