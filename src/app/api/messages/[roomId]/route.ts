import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { paginatedResponse } from '@/lib/api/response'
import { NotFoundError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'

export const GET = apiHandler(async (
  req: NextRequest,
  context: any,
) => {
  const user = await requireAuth(req)
  const { roomId } = await context.params as { roomId: string }

  const membership = await prisma.chatRoomMember.findUnique({
    where: { chatRoomId_userId: { chatRoomId: roomId, userId: user.id } },
  })

  if (!membership) {
    throw new NotFoundError('Chat room not found')
  }

  const url = new URL(req.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50')))

  const where = { chatRoomId: roomId, isDeleted: false }

  const [total, messages] = await Promise.all([
    prisma.message.count({ where }),
    prisma.message.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, profileId: true } },
      },
    }),
  ])

  await prisma.message.updateMany({
    where: {
      chatRoomId: roomId,
      receiverId: user.id,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })

  await prisma.chatRoomMember.update({
    where: { chatRoomId_userId: { chatRoomId: roomId, userId: user.id } },
    data: { lastReadAt: new Date() },
  })

  return paginatedResponse(messages.reverse(), page, limit, total)
})
