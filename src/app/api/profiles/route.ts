import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireAuth } from '@/lib/auth-helpers'
import { successResponse, paginatedResponse } from '@/lib/api/response'
import { NotFoundError, ValidationError } from '@/lib/api/errors'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  displayName: z.string().max(100).optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  dateOfBirth: z.string().datetime().optional(),
  profileCreatedBy: z.enum(['SELF', 'PARENT', 'SIBLING', 'RELATIVE', 'FRIEND']).optional(),
  height: z.number().min(50).max(300).optional(),
  weight: z.number().min(20).max(300).optional(),
  bodyType: z.enum(['SLIM', 'AVERAGE', 'ATHLETIC', 'HEAVY']).optional(),
  complexion: z.enum(['VERY_FAIR', 'FAIR', 'WHEATISH', 'DARK']).optional(),
  physicalStatus: z.enum(['NORMAL', 'PHYSICALLY_CHALLENGED']).optional(),
  bloodGroup: z.string().max(10).optional(),
  religion: z.string().min(1).optional(),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
  gothram: z.string().optional(),
  star: z.string().optional(),
  rashi: z.string().optional(),
  dosham: z.enum(['YES', 'NO', 'DONT_KNOW']).optional(),
  motherTongue: z.string().min(1).optional(),
  languages: z.string().optional(),
  highestEducation: z.string().min(1).optional(),
  educationDetail: z.string().optional(),
  college: z.string().optional(),
  employedIn: z.enum(['GOVERNMENT', 'PRIVATE', 'BUSINESS', 'DEFENCE', 'SELF_EMPLOYED', 'NOT_WORKING']).optional(),
  occupation: z.string().optional(),
  organization: z.string().optional(),
  annualIncome: z.string().optional(),
  incomePrivacy: z.boolean().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  citizenship: z.string().optional(),
  residentialStatus: z.enum(['CITIZEN', 'PERMANENT_RESIDENT', 'WORK_PERMIT', 'STUDENT_VISA', 'TEMPORARY_VISA']).optional(),
  familyType: z.enum(['JOINT', 'NUCLEAR']).optional(),
  familyStatus: z.enum(['MIDDLE_CLASS', 'UPPER_MIDDLE_CLASS', 'RICH', 'AFFLUENT']).optional(),
  familyValues: z.enum(['ORTHODOX', 'TRADITIONAL', 'MODERATE', 'LIBERAL']).optional(),
  fatherName: z.string().max(100).optional(),
  fatherOccupation: z.string().max(100).optional(),
  motherName: z.string().max(100).optional(),
  motherOccupation: z.string().max(100).optional(),
  brothers: z.number().int().min(0).optional(),
  brothersMarried: z.number().int().min(0).optional(),
  sisters: z.number().int().min(0).optional(),
  sistersMarried: z.number().int().min(0).optional(),
  familyIncome: z.string().optional(),
  aboutFamily: z.string().max(2000).optional(),
  diet: z.enum(['VEGETARIAN', 'NON_VEGETARIAN', 'EGGETARIAN', 'VEGAN', 'JAIN']).optional(),
  smoking: z.enum(['NO', 'YES', 'OCCASIONALLY']).optional(),
  drinking: z.enum(['NO', 'YES', 'OCCASIONALLY', 'SOCIALLY']).optional(),
  horoscopeAvailable: z.boolean().optional(),
  placeOfBirth: z.string().optional(),
  timeOfBirth: z.string().optional(),
  aboutMe: z.string().max(5000).optional(),
  partnerExpectation: z.string().max(5000).optional(),
})

export const GET = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const url = new URL(req.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))
  const sortBy = url.searchParams.get('sortBy') || 'createdAt'
  const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

  const ageMin = url.searchParams.get('ageMin')
  const ageMax = url.searchParams.get('ageMax')
  const heightMin = url.searchParams.get('heightMin')
  const heightMax = url.searchParams.get('heightMax')
  const community = url.searchParams.get('community')
  const subCommunity = url.searchParams.get('subCommunity')
  const education = url.searchParams.get('education')
  const occupation = url.searchParams.get('occupation')
  const salaryMin = url.searchParams.get('salaryMin')
  const salaryMax = url.searchParams.get('salaryMax')
  const country = url.searchParams.get('country')
  const state = url.searchParams.get('state')
  const city = url.searchParams.get('city')
  const religion = url.searchParams.get('religion')
  const lifestyle = url.searchParams.get('lifestyle')
  const diet = url.searchParams.get('diet')
  const familyType = url.searchParams.get('familyType')
  const maritalStatus = url.searchParams.get('maritalStatus')

  const where: any = {
    userId: { not: user.id },
    user: {
      status: { notIn: ['DELETED', 'BANNED', 'SUSPENDED'] },
      privacySettings: { profileDiscovery: true },
    },
  }

  if (ageMin || ageMax) {
    where.age = {}
    if (ageMin) where.age.gte = parseInt(ageMin)
    if (ageMax) where.age.lte = parseInt(ageMax)
  }

  if (heightMin || heightMax) {
    where.height = {}
    if (heightMin) where.height.gte = parseFloat(heightMin)
    if (heightMax) where.height.lte = parseFloat(heightMax)
  }

  if (community) where.caste = community
  if (subCommunity) where.subCaste = subCommunity
  if (education) where.highestEducation = { contains: education }
  if (occupation) where.occupation = { contains: occupation }
  if (country) where.country = country
  if (state) where.state = state
  if (city) where.city = { contains: city }
  if (religion) where.religion = religion
  if (diet) where.diet = diet as any
  if (familyType) where.familyType = familyType as any
  if (maritalStatus) where.maritalStatus = maritalStatus as any
  if (lifestyle) {
    const lifestyleMap: Record<string, string> = {
      veg: 'VEGETARIAN',
      nonveg: 'NON_VEGETARIAN',
      nonsmoker: 'NO',
    }
    where.OR = [
      { diet: lifestyleMap[lifestyle] },
      { smoking: lifestyleMap[lifestyle] },
      { drinking: lifestyleMap[lifestyle] },
    ].filter(Boolean)
  }

  if (salaryMin || salaryMax) {
    const incomeFilter: any = {}
    if (salaryMin) incomeFilter.gte = salaryMin
    if (salaryMax) incomeFilter.lte = salaryMax
    where.annualIncome = incomeFilter
  }

  const validSortFields = ['createdAt', 'age', 'height', 'annualIncome', 'profileScore', 'photoCount']
  const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt'

  const [total, profiles] = await Promise.all([
    prisma.profile.count({ where }),
    prisma.profile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [orderByField]: sortOrder },
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        user: { select: { id: true, profileId: true, isVerified: true } },
      },
    }),
  ])

  return paginatedResponse(profiles, page, limit, total)
})

export const POST = apiHandler(async (req: NextRequest) => {
  const user = await requireAuth(req)

  const body = await req.json()
  const parsed = updateProfileSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(
      'Validation failed',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    )
  }

  const existing = await prisma.profile.findUnique({
    where: { userId: user.id },
  })
  if (!existing) {
    throw new NotFoundError('Profile not found')
  }

  const updateData: any = { ...parsed.data }

  if (updateData.dateOfBirth) {
    const dob = new Date(updateData.dateOfBirth)
    updateData.dateOfBirth = dob
    updateData.age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  const updated = await prisma.profile.update({
    where: { userId: user.id },
    data: updateData,
    include: {
      photos: true,
      user: { select: { id: true, profileId: true, email: true, role: true, isVerified: true } },
    },
  })

  return successResponse(updated, 'Profile updated successfully')
})
