import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { successResponse } from '@/lib/api/response'
import { NotFoundError, ValidationError, ForbiddenError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const respondInterestSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
})

export const PUT = apiHandler(async (
  req: NextRequest,
  context: any,
) => {
  const user = await requireAuth(req)
  const { id } = await context.params as { id: string }

  const body = await req.json()
  const parsed = respondInterestSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(
      'Validation failed',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    )
  }

  const { status } = parsed.data

  const interest = await prisma.interest.findUnique({
    where: { id },
    include: {
      sender: { select: { id: true, profileId: true } },
    },
  })

  if (!interest) {
    throw new NotFoundError('Interest not found')
  }

  if (interest.receiverId !== user.id) {
    throw new ForbiddenError('You cannot respond to this interest')
  }

  if (interest.status !== 'PENDING') {
    throw new ValidationError('Interest has already been responded to')
  }

  if (status === 'ACCEPTED') {
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        type: 'DIRECT',
        members: {
          every: {
            userId: { in: [interest.senderId, interest.receiverId] },
          },
        },
      },
    })

    await prisma.$transaction(async (tx: any) => {
      await tx.interest.update({
        where: { id },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
        },
      })

      if (!existingRoom) {
        const room = await tx.chatRoom.create({
          data: { type: 'DIRECT' },
        })

        await tx.chatRoomMember.createMany({
          data: [
            { chatRoomId: room.id, userId: interest.senderId },
            { chatRoomId: room.id, userId: interest.receiverId },
          ],
        })
      }

      await tx.notification.create({
        data: {
          userId: interest.senderId,
          title: 'Interest Accepted',
          message: 'Your interest has been accepted',
          type: 'INTEREST_ACCEPTED',
          link: `/profiles/${user.profileId}`,
        },
      })
    })
  } else {
    await prisma.$transaction([
      prisma.interest.update({
        where: { id },
        data: {
          status: 'DECLINED',
          respondedAt: new Date(),
        },
      }),
      prisma.notification.create({
        data: {
          userId: interest.senderId,
          title: 'Interest Declined',
          message: 'Your interest has been declined',
          type: 'INTEREST_ACCEPTED',
          link: '#',
        },
      }),
    ])
  }

  return successResponse({ id, status }, `Interest ${status.toLowerCase()} successfully`)
})

export const DELETE = apiHandler(async (
  req: NextRequest,
  context: any,
) => {
  const user = await requireAuth(req)
  const { id } = await context.params

  const interest = await prisma.interest.findUnique({
    where: { id },
  })

  if (!interest) {
    throw new NotFoundError('Interest not found')
  }

  if (interest.senderId !== user.id) {
    throw new ForbiddenError('You can only withdraw your own interest')
  }

  if (interest.status !== 'PENDING') {
    throw new ValidationError('Can only withdraw a pending interest')
  }

  await prisma.interest.update({
    where: { id },
    data: { status: 'WITHDRAWN' },
  })

  return successResponse({ id, status: 'WITHDRAWN' }, 'Interest withdrawn successfully')
})
