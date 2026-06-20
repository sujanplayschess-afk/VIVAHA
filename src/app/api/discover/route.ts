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
  const mode = url.searchParams.get('mode') || 'grid'

  const currentProfile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { gender: true, id: true },
  })

  if (!currentProfile) {
    return paginatedResponse([], page, limit, 0)
  }

  const oppositeGender = currentProfile.gender === 'MALE' ? 'FEMALE' : 'MALE'

  const blockedUserIds = await prisma.blockedUser.findMany({
    where: {
      OR: [
        { blockerId: user.id },
        { blockedId: user.id },
      ],
    },
    select: {
      blockerId: true,
      blockedId: true,
    },
  })

  const excludedIds = new Set<string>()
  excludedIds.add(user.id)
  for (const b of blockedUserIds) {
    excludedIds.add(b.blockerId)
    excludedIds.add(b.blockedId)
  }

  const interactedUserIds = await prisma.interest.findMany({
    where: {
      OR: [
        { senderId: user.id },
        { receiverId: user.id },
      ],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  })

  for (const i of interactedUserIds) {
    excludedIds.add(i.senderId)
    excludedIds.add(i.receiverId)
  }

  const shortlistedIds = await prisma.shortlist.findMany({
    where: { userId: user.id },
    select: { shortlistedId: true },
  })
  const shortlistedSet = new Set(shortlistedIds.map((s: { shortlistedId: string }) => s.shortlistedId))

  const interestsSent = await prisma.interest.findMany({
    where: { senderId: user.id },
    select: { receiverId: true, status: true },
  })
  const interestsReceived = await prisma.interest.findMany({
    where: { receiverId: user.id },
    select: { senderId: true, status: true },
  })
  const interestMap = new Map<string, string>()
  for (const i of interestsSent) interestMap.set(i.receiverId, i.status)
  for (const i of interestsReceived) interestMap.set(i.senderId, i.status)

  const where: any = {
    userId: { notIn: Array.from(excludedIds) },
    gender: oppositeGender,
    user: {
      status: { notIn: ['DELETED', 'BANNED', 'SUSPENDED'] },
      privacySettings: { profileDiscovery: true },
    },
  }

  const [total, profiles] = await Promise.all([
    prisma.profile.count({ where }),
    prisma.profile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { isHighlighted: 'desc' },
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        user: { select: { id: true, profileId: true } },
      },
    }),
  ])

  const data = profiles.map((p: any) => ({
    id: p.id,
    userId: p.userId,
    firstName: p.firstName,
    lastName: p.lastName,
    gender: p.gender,
    age: p.age,
    height: p.height,
    religion: p.religion,
    caste: p.caste,
    occupation: p.occupation,
    city: p.city,
    state: p.state,
    country: p.country,
    highestEducation: p.highestEducation,
    employedIn: p.employedIn,
    maritalStatus: p.maritalStatus,
    diet: p.diet,
    smoking: p.smoking,
    drinking: p.drinking,
    motherTongue: p.motherTongue,
    aboutMe: p.aboutMe,
    photoCount: p.photoCount,
    isFeatured: p.isFeatured,
    isHighlighted: p.isHighlighted,
    profileScore: p.profileScore,
    profileCompletion: p.profileCompletion,
    photos: p.photos,
    compatibilityScore: computeCompatibility(currentProfile.id, p.id),
    isShortlisted: shortlistedSet.has(p.userId),
    interestStatus: interestMap.get(p.userId) || null,
    profileId: p.user.profileId,
    mode,
  }))

  return paginatedResponse(data, page, limit, total)
})

function computeCompatibility(_profileId: string, _targetId: string): number {
  return Math.floor(Math.random() * 41) + 60
}
