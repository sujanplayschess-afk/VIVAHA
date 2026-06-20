import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { successResponse, paginatedResponse, createdResponse } from '@/lib/api/response'
import { NotFoundError, ValidationError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const sendMessageSchema = z.object({
  roomId: z.string().optional(),
  receiverId: z.string().optional(),
  content: z.string().min(1).max(5000),
  type: z.enum(['TEXT', 'IMAGE', 'DOCUMENT', 'AUDIO']).default('TEXT'),
})

export const GET = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const url = new URL(req.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))

  const where = { userId: user.id }

  const [total, memberships] = await Promise.all([
    prisma.chatRoomMember.count({ where }),
    prisma.chatRoomMember.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { chatRoom: { updatedAt: 'desc' } },
      include: {
        chatRoom: {
          include: {
            members: {
              where: { userId: { not: user.id } },
              include: {
                user: {
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
                        occupation: true,
                        photos: { where: { isPrimary: true }, take: 1 },
                      },
                    },
                  },
                },
              },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                id: true,
                content: true,
                type: true,
                senderId: true,
                createdAt: true,
                isRead: true,
              },
            },
          },
        },
      },
    }),
  ])

  const data = await Promise.all(memberships.map(async (m: any) => {
    const room = m.chatRoom
    const lastMessage = room.messages[0] || null

    const unreadCount = await prisma.message.count({
      where: {
        chatRoomId: room.id,
        receiverId: user.id,
        isRead: false,
      },
    })

    const otherMember = room.members[0] || null

    return {
      roomId: room.id,
      type: room.type,
      isActive: room.isActive,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      lastMessage,
      unreadCount,
      otherUser: otherMember ? {
        id: otherMember.user.id,
        profileId: otherMember.user.profileId,
        profile: otherMember.user.profile,
      } : null,
    }
  }))

  return paginatedResponse(data, page, limit, total)
})

export const POST = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const body = await req.json()
  const parsed = sendMessageSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(
      'Validation failed',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    )
  }

  const { roomId, receiverId, content, type } = parsed.data

  let targetRoomId = roomId
  let targetReceiverId = receiverId

  if (!targetRoomId) {
    if (!targetReceiverId) {
      throw new ValidationError('Either roomId or receiverId is required')
    }

    if (targetReceiverId === user.id) {
      throw new ValidationError('Cannot send message to yourself')
    }

    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { members: { some: { userId: user.id } } },
          { members: { some: { userId: targetReceiverId } } },
        ],
      },
      select: { id: true },
    })

    if (existingRoom) {
      targetRoomId = existingRoom.id
    } else {
      const receiver = await prisma.user.findUnique({
        where: { id: targetReceiverId },
        select: { id: true, status: true },
      })

      if (!receiver || receiver.status === 'DELETED' || receiver.status === 'BANNED') {
        throw new NotFoundError('User not found')
      }

      const room = await prisma.chatRoom.create({
        data: {
          type: 'DIRECT',
          members: {
            createMany: {
              data: [
                { userId: user.id },
                { userId: targetReceiverId },
              ],
            },
          },
        },
      })

      targetRoomId = room.id
    }
  } else {
    const membership = await prisma.chatRoomMember.findUnique({
      where: { chatRoomId_userId: { chatRoomId: targetRoomId, userId: user.id } },
    })

    if (!membership) {
      throw new NotFoundError('Chat room not found')
    }

    const otherMembers = await prisma.chatRoomMember.findMany({
      where: { chatRoomId: targetRoomId, userId: { not: user.id } },
      select: { userId: true },
    })

    targetReceiverId = otherMembers[0]?.userId || targetReceiverId
  }

  if (!targetRoomId) {
    throw new ValidationError('Could not determine chat room')
  }

  if (!targetReceiverId) {
    throw new ValidationError('Could not determine message receiver')
  }

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        chatRoomId: targetRoomId,
        senderId: user.id,
        receiverId: targetReceiverId,
        content,
        type: type as any,
      },
      include: {
        sender: { select: { id: true, profileId: true } },
      },
    }),
    prisma.chatRoom.update({
      where: { id: targetRoomId },
      data: { updatedAt: new Date() },
    }),
    prisma.notification.create({
      data: {
        userId: targetReceiverId,
        title: 'New Message',
        message: content.length > 100 ? content.substring(0, 100) + '...' : content,
        type: 'MESSAGE_RECEIVED',
        link: `/messages/${targetRoomId}`,
      },
    }),
  ])

  return createdResponse(message, 'Message sent successfully')
})
