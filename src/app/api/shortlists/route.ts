import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { successResponse, paginatedResponse, createdResponse, noContentResponse } from '@/lib/api/response'
import { NotFoundError, ValidationError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const shortlistSchema = z.object({
  profileId: z.string().min(1),
})

export const GET = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const url = new URL(req.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))

  const where = { userId: user.id }

  const [total, shortlists] = await Promise.all([
    prisma.shortlist.count({ where }),
    prisma.shortlist.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        shortlistedUser: {
          select: {
            id: true,
            profileId: true,
            profile: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                age: true,
                gender: true,
                city: true,
                state: true,
                occupation: true,
                highestEducation: true,
                religion: true,
                motherTongue: true,
                photos: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    }),
  ])

  const data = shortlists.map((s: any) => ({
    id: s.id,
    shortlistedId: s.shortlistedId,
    createdAt: s.createdAt,
    profile: s.shortlistedUser.profile,
  }))

  return paginatedResponse(data, page, limit, total)
})

export const POST = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const body = await req.json()
  const parsed = shortlistSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(
      'Validation failed',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    )
  }

  const { profileId } = parsed.data

  if (profileId === user.id) {
    throw new ValidationError('Cannot shortlist yourself')
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: profileId },
    select: { id: true, status: true },
  })

  if (!targetUser || targetUser.status === 'DELETED' || targetUser.status === 'BANNED') {
    throw new NotFoundError('User not found')
  }

  const existing = await prisma.shortlist.findUnique({
    where: { userId_shortlistedId: { userId: user.id, shortlistedId: profileId } },
  })

  if (existing) {
    return successResponse(existing, 'Already in shortlist')
  }

  const shortlist = await prisma.shortlist.create({
    data: {
      userId: user.id,
      shortlistedId: profileId,
    },
  })

  return createdResponse(shortlist, 'Added to shortlist')
})

export const DELETE = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const body = await req.json()
  const parsed = shortlistSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(
      'Validation failed',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    )
  }

  const { profileId } = parsed.data

  const existing = await prisma.shortlist.findUnique({
    where: { userId_shortlistedId: { userId: user.id, shortlistedId: profileId } },
  })

  if (!existing) {
    throw new NotFoundError('Not in shortlist')
  }

  await prisma.shortlist.delete({
    where: { userId_shortlistedId: { userId: user.id, shortlistedId: profileId } },
  })

  return successResponse({ profileId }, 'Removed from shortlist')
})
