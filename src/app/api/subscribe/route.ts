import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { successResponse, errorResponse } from '@/lib/api/response'
import { prisma } from '@/lib/db'

export const POST = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)
  const { plan, billing, price } = await req.json()

  if (!plan || !['silver', 'gold', 'diamond', 'platinum'].includes(plan)) {
    return errorResponse('Invalid plan')
  }

  const planRecord = await prisma.subscriptionPlan.findUnique({ where: { slug: plan } })
  if (!planRecord) {
    return errorResponse('Plan not found', 404)
  }

  const existing = await prisma.subscription.findUnique({ where: { userId: user.id } })
  const now = new Date()
  const duration = billing === 'yearly' ? 365 : 30
  const endDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000)

  if (existing) {
    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        planId: planRecord.id,
        status: 'ACTIVE',
        startDate: now,
        endDate,
        autoRenew: billing === 'yearly',
      },
    })
  } else {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: planRecord.id,
        status: 'ACTIVE',
        startDate: now,
        endDate,
        autoRenew: billing === 'yearly',
      },
    })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'PREMIUM_USER' },
  })

  return successResponse({
    plan,
    billing,
    price,
    startDate: now,
    endDate,
  }, `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan activated successfully!`)
}, { csrfDisabled: true })
