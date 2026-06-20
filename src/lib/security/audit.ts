import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export async function createAuditLog(
  userId: string,
  action: string,
  metadata?: Prisma.InputJsonValue,
): Promise<void> {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      metadata: (metadata ?? {}) as Prisma.InputJsonValue,
    },
  })
}

export async function logLogin(userId: string, ipAddress?: string): Promise<void> {
  await createAuditLog(
    userId,
    'USER_LOGIN',
    { ipAddress, timestamp: new Date().toISOString() } as Prisma.InputJsonValue,
  )
}

export async function logLogout(userId: string): Promise<void> {
  await createAuditLog(userId, 'USER_LOGOUT')
}

export async function logRegistration(userId: string): Promise<void> {
  await createAuditLog(userId, 'USER_REGISTERED')
}

export async function logProfileUpdate(userId: string, changes: Record<string, unknown>): Promise<void> {
  await createAuditLog(
    userId,
    'PROFILE_UPDATED',
    { changes } as Prisma.InputJsonValue,
  )
}

export async function logPasswordChange(userId: string): Promise<void> {
  await createAuditLog(userId, 'PASSWORD_CHANGED')
}

export async function logInterestSent(userId: string, targetUserId: string): Promise<void> {
  await createAuditLog(
    userId,
    'INTEREST_SENT',
    { targetUserId } as Prisma.InputJsonValue,
  )
}

export type AuditAction =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_REGISTERED'
  | 'PROFILE_UPDATED'
  | 'PASSWORD_CHANGED'
  | 'INTEREST_SENT'
  | 'INTEREST_ACCEPTED'
  | 'MESSAGE_SENT'
  | 'PHOTO_UPLOADED'
  | 'SUBSCRIPTION_CHANGED'
  | 'PAYMENT_MADE'
  | 'ACCOUNT_DEACTIVATED'
