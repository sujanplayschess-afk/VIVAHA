import { z } from 'zod'

export const basicInfoSchema = z.object({
  aboutMe: z.string().max(5000).optional(),
  name: z.string().min(2).max(100),
  displayName: z.string().max(100).optional(),
  height: z.number().min(50).max(300),
  weight: z.number().min(20).max(300).optional(),
  bodyType: z.enum(['SLIM', 'AVERAGE', 'ATHLETIC', 'HEAVY']).optional(),
  complexion: z.enum(['VERY_FAIR', 'FAIR', 'WHEATISH', 'DARK']).optional(),
  physicalStatus: z.enum(['NORMAL', 'PHYSICALLY_CHALLENGED']).default('NORMAL'),
})

export const educationSchema = z.object({
  education: z.string().min(1).max(200),
  college: z.string().max(200).optional(),
  employedIn: z.enum(['GOVERNMENT', 'PRIVATE', 'BUSINESS', 'DEFENCE', 'SELF_EMPLOYED', 'NOT_WORKING']).optional(),
  occupation: z.string().max(200).optional(),
  organization: z.string().max(200).optional(),
  annualIncome: z.string().max(50).optional(),
})

export const familySchema = z.object({
  familyType: z.enum(['JOINT', 'NUCLEAR']).optional(),
  status: z.enum(['MIDDLE_CLASS', 'UPPER_MIDDLE_CLASS', 'RICH', 'AFFLUENT']).optional(),
  values: z.enum(['ORTHODOX', 'TRADITIONAL', 'MODERATE', 'LIBERAL']).optional(),
  parents: z
    .object({
      fatherName: z.string().max(100).optional(),
      fatherOccupation: z.string().max(100).optional(),
      motherName: z.string().max(100).optional(),
      motherOccupation: z.string().max(100).optional(),
    })
    .optional(),
  siblings: z
    .object({
      brothers: z.number().int().min(0).max(20).optional(),
      brothersMarried: z.number().int().min(0).max(20).optional(),
      sisters: z.number().int().min(0).max(20).optional(),
      sistersMarried: z.number().int().min(0).max(20).optional(),
    })
    .optional(),
})

export const lifestyleSchema = z.object({
  diet: z.enum(['VEGETARIAN', 'NON_VEGETARIAN', 'EGGETARIAN', 'VEGAN', 'JAIN']).optional(),
  smoking: z.enum(['NO', 'YES', 'OCCASIONALLY']).optional(),
  drinking: z.enum(['NO', 'YES', 'OCCASIONALLY', 'SOCIALLY']).optional(),
  languages: z.array(z.string().max(50)).max(10).optional(),
})

export const partnerPreferenceSchema = z.object({
  ageRange: z
    .object({
      from: z.number().min(18).max(100).optional(),
      to: z.number().min(18).max(100).optional(),
    })
    .optional(),
  heightRange: z
    .object({
      from: z.number().min(50).max(300).optional(),
      to: z.number().min(50).max(300).optional(),
    })
    .optional(),
  maritalStatus: z.array(z.enum(['NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'AWAITING_DIVORCE', 'ANNULLED'])).optional(),
  religion: z.array(z.string().max(100)).optional(),
  caste: z.array(z.string().max(100)).optional(),
  education: z.array(z.string().max(200)).optional(),
  incomeRange: z
    .object({
      from: z.string().max(50).optional(),
      to: z.string().max(50).optional(),
    })
    .optional(),
  location: z
    .object({
      country: z.array(z.string()).optional(),
      state: z.array(z.string()).optional(),
      city: z.array(z.string()).optional(),
    })
    .optional(),
})

export const privacySettingsSchema = z.object({
  showPhoto: z.boolean().default(true),
  showPhone: z.boolean().default(false),
  showEmail: z.boolean().default(false),
  showIncome: z.boolean().default(false),
  allowChat: z.boolean().default(true),
  profileDiscovery: z.boolean().default(true),
})

export type BasicInfoInput = z.infer<typeof basicInfoSchema>
export type EducationInput = z.infer<typeof educationSchema>
export type FamilyInput = z.infer<typeof familySchema>
export type LifestyleInput = z.infer<typeof lifestyleSchema>
export type PartnerPreferenceInput = z.infer<typeof partnerPreferenceSchema>
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>
