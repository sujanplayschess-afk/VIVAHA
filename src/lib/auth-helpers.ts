import { prisma } from './db'
import { hashPassword, generateAccessToken, generateRefreshToken, verifyAccessToken } from './auth'
import { AuthError } from './api/errors'
import type { AuthUser } from '@/types'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function generateProfileId(): string {
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `VST-${suffix}`
}

interface CreateUserInput {
  email: string
  phone?: string
  password: string
  firstName: string
  lastName: string
  gender: 'MALE' | 'FEMALE'
  dateOfBirth: Date
  religion: string
  motherTongue: string
}

export async function createUser(input: CreateUserInput) {
  const passwordHash = await hashPassword(input.password)
  const profileId = generateProfileId()

  return prisma.user.create({
    data: {
      email: input.email,
      phone: input.phone,
      passwordHash,
      profileId,
      profile: {
        create: {
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
          dateOfBirth: input.dateOfBirth,
          age: Math.floor((Date.now() - input.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
          profileCreatedBy: 'SELF',
          height: 0,
          religion: input.religion,
          motherTongue: input.motherTongue,
          languages: '',
          highestEducation: '',
          state: '',
          city: '',
        },
      },
      privacySettings: {
        create: {},
      },
    },
    include: {
      profile: true,
      privacySettings: true,
    },
  })
}

export async function createProfile(userId: string, data: Record<string, unknown>) {
  return prisma.profile.update({
    where: { userId },
    data,
  })
}

interface TokenPayload {
  id: string
  profileId: string
  email: string
  role: string
}

export function generateTokens(user: { id: string; profileId: string; email: string; role: string }) {
  const payload: TokenPayload = {
    id: user.id,
    profileId: user.profileId,
    email: user.email,
    role: user.role,
  }
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  }
}

const REFRESH_TOKEN_COOKIE = 'refreshToken'
const ACCESS_TOKEN_COOKIE = 'accessToken'

export async function setAuthCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string }
) {
  const cookieStore = await cookies()

  cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  })
}

export async function clearAuthCookies(response: NextResponse) {
  const cookieStore = await cookies()

  cookieStore.set(REFRESH_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  cookieStore.set(ACCESS_TOKEN_COOKIE, '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  const cookieHeader = request.headers.get('cookie') || ''
  const authHeader = request.headers.get('authorization')

  let token: string | null = null

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7)
  } else {
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ACCESS_TOKEN_COOKIE}=([^;]*)`))
    token = match ? match[1] : null
  }

  if (!token) return null

  const decoded = verifyAccessToken(token)
  if (!decoded || !decoded.id) return null

  return {
    id: decoded.id,
    profileId: decoded.profileId,
    email: decoded.email,
    role: decoded.role,
    status: decoded.status || 'ACTIVE',
  }
}

export async function requireAuth(request: Request): Promise<AuthUser> {
  const user = await getAuthUser(request)
  if (!user) throw new AuthError()
  return user
}

export async function requireRole(request: Request, roles: string[]): Promise<AuthUser> {
  const user = await requireAuth(request)
  if (!roles.includes(user.role)) {
    throw new AuthError('Insufficient permissions')
  }
  return user
}
