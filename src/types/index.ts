export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta
}

export interface AuthUser {
  id: string
  profileId: string
  email: string
  role: UserRole
  status: AccountStatus
}

export type RegistrationStep = 1 | 2 | 3 | 4 | 5

export interface ProfileCompletion {
  step: RegistrationStep
  label: string
  percentage: number
  isComplete: boolean
  fields: string[]
}

// Enums matching Prisma schema
export type UserRole = 'USER' | 'PREMIUM_USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'
export type AccountStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED' | 'BANNED' | 'DELETED'
export type Gender = 'MALE' | 'FEMALE'
export type ProfileCreatedBy = 'SELF' | 'PARENT' | 'SIBLING' | 'RELATIVE' | 'FRIEND'
export type BodyType = 'SLIM' | 'AVERAGE' | 'ATHLETIC' | 'HEAVY'
export type Complexion = 'VERY_FAIR' | 'FAIR' | 'WHEATISH' | 'DARK'
export type PhysicalStatus = 'NORMAL' | 'PHYSICALLY_CHALLENGED'
export type Dosham = 'YES' | 'NO' | 'DONT_KNOW'
export type EmploymentSector = 'GOVERNMENT' | 'PRIVATE' | 'BUSINESS' | 'DEFENCE' | 'SELF_EMPLOYED' | 'NOT_WORKING'
export type ResidentialStatus = 'CITIZEN' | 'PERMANENT_RESIDENT' | 'WORK_PERMIT' | 'STUDENT_VISA' | 'TEMPORARY_VISA'
export type FamilyType = 'JOINT' | 'NUCLEAR'
export type FamilyStatus = 'MIDDLE_CLASS' | 'UPPER_MIDDLE_CLASS' | 'RICH' | 'AFFLUENT'
export type FamilyValues = 'ORTHODOX' | 'TRADITIONAL' | 'MODERATE' | 'LIBERAL'
export type DietType = 'VEGETARIAN' | 'NON_VEGETARIAN' | 'EGGETARIAN' | 'VEGAN' | 'JAIN'
export type SmokingHabit = 'NO' | 'YES' | 'OCCASIONALLY'
export type DrinkingHabit = 'NO' | 'YES' | 'OCCASIONALLY' | 'SOCIALLY'
export type MaritalStatus = 'NEVER_MARRIED' | 'DIVORCED' | 'WIDOWED' | 'AWAITING_DIVORCE' | 'ANNULLED'
export type InterestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN'
export type ChatType = 'DIRECT' | 'GROUP'
export type MessageType = 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'AUDIO' | 'VIDEO_CALL_REQUEST' | 'CONTACT_SHARED'
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'ON_HOLD'
export type PaymentGateway = 'RAZORPAY' | 'PHONEPE' | 'PAYTM' | 'STRIPE'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
export type ReportStatus = 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
export type NotificationType = 'INTEREST_RECEIVED' | 'INTEREST_ACCEPTED' | 'MESSAGE_RECEIVED' | 'PROFILE_VIEWED' | 'SYSTEM_ALERT' | 'SUBSCRIPTION_UPDATE'
export type DocumentType = 'AADHAAR' | 'PAN' | 'PASSPORT' | 'VOTER_ID' | 'EDUCATION_CERT' | 'INCOME_PROOF'
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
