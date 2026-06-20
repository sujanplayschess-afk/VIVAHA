import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { successResponse, paginatedResponse, createdResponse } from '@/lib/api/response'
import { NotFoundError, ValidationError, ForbiddenError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const sendInterestSchema = z.object({
  receiverId: z.string().min(1, 'receiverId is required'),
  message: z.string().max(500).optional(),
})

export const GET = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const url = new URL(req.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))
  const type = url.searchParams.get('type')
  const status = url.searchParams.get('status')

  const where: any = {}

  if (type === 'sent') {
    where.senderId = user.id
  } else if (type === 'received') {
    where.receiverId = user.id
  } else if (type === 'matched') {
    where.OR = [
      { senderId: user.id, status: 'ACCEPTED' },
      { receiverId: user.id, status: 'ACCEPTED' },
    ]
  } else {
    where.OR = [
      { senderId: user.id },
      { receiverId: user.id },
    ]
  }

  if (status) {
    where.status = status
  }

  const [total, interests] = await Promise.all([
    prisma.interest.count({ where }),
    prisma.interest.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
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
                photos: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        receiver: {
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
                photos: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    }),
  ])

  return paginatedResponse(interests, page, limit, total)
})

export const POST = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const body = await req.json()
  const parsed = sendInterestSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(
      'Validation failed',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    )
  }

  const { receiverId, message } = parsed.data

  if (receiverId === user.id) {
    throw new ValidationError('Cannot send interest to yourself')
  }

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    include: { profile: { select: { id: true } } },
  })

  if (!receiver || receiver.status === 'DELETED' || receiver.status === 'BANNED') {
    throw new NotFoundError('User not found')
  }

  const existingInterest = await prisma.interest.findUnique({
    where: { senderId_receiverId: { senderId: user.id, receiverId } },
  })

  if (existingInterest) {
    throw new ValidationError('Interest already sent to this user')
  }

  const isBlocked = await prisma.blockedUser.findFirst({
    where: {
      OR: [
        { blockerId: user.id, blockedId: receiverId },
        { blockerId: receiverId, blockedId: user.id },
      ],
    },
  })

  if (isBlocked) {
    throw new ForbiddenError('Cannot send interest to this user')
  }

  const [interest] = await prisma.$transaction([
    prisma.interest.create({
      data: {
        senderId: user.id,
        receiverId,
        message: message || null,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            profileId: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
        receiver: {
          select: {
            id: true,
            profileId: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
    prisma.notification.create({
      data: {
        userId: receiverId,
        title: 'New Interest',
        message: 'Someone has shown interest in your profile',
        type: 'INTEREST_RECEIVED',
        link: `/profiles/${user.profileId}`,
      },
    }),
  ])

  return createdResponse(interest, 'Interest sent successfully')
})
