import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { successResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

export const GET = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const count = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  })

  return successResponse({ count })
})
