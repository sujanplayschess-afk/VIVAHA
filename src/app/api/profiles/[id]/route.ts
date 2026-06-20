import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { successResponse } from '@/lib/api/response'
import { NotFoundError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'

export const GET = apiHandler(async (
  req: NextRequest,
  context: any,
) => {
  const user = await requireAuth(req)
  const { id } = await context.params as { id: string }

  const targetProfile = await prisma.profile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          profileId: true,
          email: true,
          role: true,
          isVerified: true,
          phoneVerified: true,
          emailVerified: true,
          idVerified: true,
          photoVerified: true,
          status: true,
          createdAt: true,
          preferences: true,
        },
      },
      photos: { orderBy: { isPrimary: 'desc' } },
    },
  })

  if (!targetProfile) {
    throw new NotFoundError('Profile not found')
  }

  if (targetProfile.user.status === 'DELETED' || targetProfile.user.status === 'BANNED') {
    throw new NotFoundError('Profile not found')
  }

  const isBlocked = await prisma.blockedUser.findFirst({
    where: {
      OR: [
        { blockerId: user.id, blockedId: targetProfile.userId },
        { blockerId: targetProfile.userId, blockedId: user.id },
      ],
    },
  })

  if (isBlocked) {
    throw new NotFoundError('Profile not found')
  }

  const interestedSent = await prisma.interest.findFirst({
    where: { senderId: user.id, receiverId: targetProfile.userId },
  })

  const interestReceived = await prisma.interest.findFirst({
    where: { senderId: targetProfile.userId, receiverId: user.id },
  })

  let interestStatus: string | null = null
  if (interestedSent) interestStatus = `sent_${interestedSent.status.toLowerCase()}`
  else if (interestReceived) interestStatus = `received_${interestReceived.status.toLowerCase()}`

  const isShortlisted = await prisma.shortlist.findUnique({
    where: { userId_shortlistedId: { userId: user.id, shortlistedId: targetProfile.userId } },
  })

  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  await prisma.$transaction(async (tx: any) => {
    const existingView = await tx.profileView.findUnique({
      where: { viewerId_viewedId: { viewerId: user.id, viewedId: targetProfile.userId } },
    })

    if (existingView) {
      if (existingView.lastViewed < twentyFourHoursAgo) {
        await tx.profileView.update({
          where: { viewerId_viewedId: { viewerId: user.id, viewedId: targetProfile.userId } },
          data: {
            count: { increment: 1 },
            lastViewed: now,
          },
        })
      }
    } else {
      await tx.profileView.create({
        data: {
          viewerId: user.id,
          viewedId: targetProfile.userId,
          count: 1,
          lastViewed: now,
        },
      })
    }
  })

  const currentProfile = await prisma.profile.findUnique({
    where: { userId: user.id },
  })

  const compatibilityScore = currentProfile
    ? computeProfileCompatibility(currentProfile, targetProfile)
    : null

  const data = {
    ...targetProfile,
    user: targetProfile.user,
    photos: targetProfile.photos,
    preferences: targetProfile.user.preferences,
    interestStatus,
    isShortlisted: !!isShortlisted,
    compatibilityScore,
    viewCount: undefined,
  }

  return successResponse(data)
})

function computeProfileCompatibility(current: any, target: any): number {
  let score = 0
  const fields = [
    { key: 'religion', weight: 15 },
    { key: 'motherTongue', weight: 10 },
    { key: 'diet', weight: 10 },
    { key: 'smoking', weight: 5 },
    { key: 'drinking', weight: 5 },
    { key: 'familyValues', weight: 10 },
    { key: 'familyType', weight: 5 },
    { key: 'bodyType', weight: 5 },
    { key: 'physicalStatus', weight: 5 },
    { key: 'complexion', weight: 5 },
    { key: 'dosham', weight: 5 },
    { key: 'caste', weight: 10 },
    { key: 'subCaste', weight: 5 },
    { key: 'maritalStatus', weight: 5 },
  ]

  for (const field of fields) {
    if (current[field.key] && target[field.key] && current[field.key] === target[field.key]) {
      score += field.weight
    }
  }

  if (current.highestEducation && target.highestEducation) {
    const edMap: Record<string, number> = {
      'Ph.D': 10, 'Doctorate': 10, 'Masters': 8, 'Master': 8,
      'Bachelors': 6, 'Bachelor': 6, 'Diploma': 4, 'High School': 2,
    }
    const currEd = Object.entries(edMap).find(([k]) => current.highestEducation.includes(k))
    const targEd = Object.entries(edMap).find(([k]) => target.highestEducation.includes(k))
    const diff = Math.abs((currEd?.[1] || 5) - (targEd?.[1] || 5))
    score += Math.max(0, 10 - diff * 2)
  }

  const incomeScore = compareIncome(current.annualIncome, target.annualIncome)
  score += incomeScore

  return Math.min(100, score)
}

function compareIncome(income1: string | null | undefined, income2: string | null | undefined): number {
  if (!income1 || !income2) return 5
  const extractValue = (s: string): number => {
    const digits = s.replace(/[^0-9]/g, '')
    return digits ? parseInt(digits) : 0
  }
  const v1 = extractValue(income1)
  const v2 = extractValue(income2)
  if (v1 === 0 || v2 === 0) return 5
  const ratio = Math.min(v1, v2) / Math.max(v1, v2)
  if (ratio > 0.8) return 10
  if (ratio > 0.5) return 5
  return 0
}
