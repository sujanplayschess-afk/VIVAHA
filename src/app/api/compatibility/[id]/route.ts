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
  const { id: targetProfileId } = await context.params as { id: string }

  const [currentProfile, targetProfile] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.profile.findUnique({ where: { id: targetProfileId } }),
  ])

  if (!currentProfile) {
    throw new NotFoundError('Your profile not found')
  }

  if (!targetProfile) {
    throw new NotFoundError('Target profile not found')
  }

  const result = computeDetailedCompatibility(currentProfile, targetProfile)

  return successResponse(result)
})

interface ScoreDetail {
  score: number
  maxScore: number
  matched: string[]
  mismatched: string[]
}

interface CompatibilityResult {
  overall: number
  lifestyle: ScoreDetail
  education: ScoreDetail
  career: ScoreDetail
  familyValues: ScoreDetail
  interests: ScoreDetail
  personality: ScoreDetail
  matchedFields: string[]
  mismatchedFields: string[]
}

function compareField(a: any, b: any): boolean {
  if (a === null || a === undefined || b === null || b === undefined) return false
  return String(a).toLowerCase() === String(b).toLowerCase()
}

function computeDetailedCompatibility(current: any, target: any): CompatibilityResult {
  const allMatched: string[] = []
  const allMismatched: string[] = []

  function scoreCategory(
    fields: { key: string; weight: number }[],
  ): { score: number; maxScore: number; matched: string[]; mismatched: string[] } {
    let score = 0
    const maxScore = fields.reduce((sum, f) => sum + f.weight, 0)
    const matched: string[] = []
    const mismatched: string[] = []

    for (const field of fields) {
      const isMatch = compareField(current[field.key], target[field.key])
      if (isMatch) {
        score += field.weight
        matched.push(field.key)
        allMatched.push(field.key)
      } else {
        mismatched.push(field.key)
        allMismatched.push(field.key)
      }
    }

    return { score, maxScore, matched, mismatched }
  }

  const lifestyle = scoreCategory([
    { key: 'diet', weight: 25 },
    { key: 'smoking', weight: 20 },
    { key: 'drinking', weight: 20 },
    { key: 'bodyType', weight: 20 },
    { key: 'physicalStatus', weight: 15 },
  ])

  const education = scoreCategory([
    { key: 'highestEducation', weight: 40 },
    { key: 'educationDetail', weight: 30 },
    { key: 'college', weight: 30 },
  ])

  const career = scoreCategory([
    { key: 'employedIn', weight: 30 },
    { key: 'occupation', weight: 30 },
    { key: 'organization', weight: 20 },
  ])

  const familyValues = scoreCategory([
    { key: 'familyValues', weight: 30 },
    { key: 'familyType', weight: 25 },
    { key: 'familyStatus', weight: 25 },
    { key: 'religion', weight: 20 },
  ])

  const interests = scoreCategory([
    { key: 'motherTongue', weight: 25 },
    { key: 'caste', weight: 20 },
    { key: 'subCaste', weight: 15 },
    { key: 'dosham', weight: 15 },
    { key: 'star', weight: 15 },
    { key: 'maritalStatus', weight: 10 },
  ])

  const personality = scoreCategory([
    { key: 'complexion', weight: 25 },
    { key: 'height', weight: 25 },
    { key: 'age', weight: 25 },
    { key: 'bloodGroup', weight: 25 },
  ])

  const ageDiff = Math.abs((current.age || 0) - (target.age || 0))
  const heightDiff = Math.abs((current.height || 0) - (target.height || 0))

  if (ageDiff <= 3) {
    personality.score += 15
    allMatched.push('age_range')
  } else if (ageDiff <= 7) {
    personality.score += 8
  } else {
    allMismatched.push('age_range')
  }
  personality.maxScore += 15

  if (heightDiff <= 10) {
    personality.score += 10
    allMatched.push('height_range')
  } else {
    allMismatched.push('height_range')
  }
  personality.maxScore += 10

  const totalMaxScore = lifestyle.maxScore + education.maxScore + career.maxScore +
    familyValues.maxScore + interests.maxScore + personality.maxScore

  const totalScore = lifestyle.score + education.score + career.score +
    familyValues.score + interests.score + personality.score

  const overall = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0

  const normalizeScore = (s: ScoreDetail): number => {
    return s.maxScore > 0 ? Math.round((s.score / s.maxScore) * 100) : 0
  }

  return {
    overall,
    lifestyle: { ...lifestyle, score: normalizeScore(lifestyle) },
    education: { ...education, score: normalizeScore(education) },
    career: { ...career, score: normalizeScore(career) },
    familyValues: { ...familyValues, score: normalizeScore(familyValues) },
    interests: { ...interests, score: normalizeScore(interests) },
    personality: { ...personality, score: normalizeScore(personality) },
    matchedFields: [...new Set(allMatched)],
    mismatchedFields: [...new Set(allMismatched)],
  }
}
