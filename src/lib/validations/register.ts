import { z } from 'zod'

export const step1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  gender: z.enum(['MALE', 'FEMALE'] as const),
  dateOfBirth: z.string().refine(
    (val) => {
      const date = new Date(val)
      if (isNaN(date.getTime())) return false
      const age = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      return age >= 18 && age <= 100
    },
    { message: 'You must be between 18 and 100 years old' },
  ),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15)
    .regex(/^\+?[\d\- ]+$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
})

export const step2Schema = z.object({
  religion: z.string().min(1, 'Religion is required').max(100),
  caste: z.string().max(100).optional(),
  subCaste: z.string().max(100).optional(),
  motherTongue: z.string().min(1, 'Mother tongue is required').max(100),
  gothram: z.string().max(100).optional(),
  star: z.string().max(50).optional(),
  rashi: z.string().max(50).optional(),
  dosham: z.enum(['YES', 'NO', 'DONT_KNOW'] as const).optional(),
  languages: z.array(z.string().max(50)).max(10).optional(),
})

export const step3Schema = z.object({
  highestEducation: z.string().min(1, 'Education is required').max(200),
  educationDetail: z.string().max(500).optional(),
  college: z.string().max(200).optional(),
  employedIn: z.enum(['GOVERNMENT', 'PRIVATE', 'BUSINESS', 'DEFENCE', 'SELF_EMPLOYED', 'NOT_WORKING'] as const).optional(),
  occupation: z.string().max(200).optional(),
  organization: z.string().max(200).optional(),
  annualIncome: z.string().max(50).optional(),
  incomePrivacy: z.boolean().optional(),
  country: z.string().max(100).default('India'),
  state: z.string().min(1, 'State is required').max(100),
  city: z.string().min(1, 'City is required').max(100),
  citizenship: z.string().max(100).optional(),
  residentialStatus: z.enum(['CITIZEN', 'PERMANENT_RESIDENT', 'WORK_PERMIT', 'STUDENT_VISA', 'TEMPORARY_VISA'] as const).optional(),
})

export const step4Schema = z.object({
  familyType: z.enum(['JOINT', 'NUCLEAR'] as const).optional(),
  familyStatus: z.enum(['MIDDLE_CLASS', 'UPPER_MIDDLE_CLASS', 'RICH', 'AFFLUENT'] as const).optional(),
  familyValues: z.enum(['ORTHODOX', 'TRADITIONAL', 'MODERATE', 'LIBERAL'] as const).optional(),
  fatherName: z.string().max(100).optional(),
  fatherOccupation: z.string().max(100).optional(),
  motherName: z.string().max(100).optional(),
  motherOccupation: z.string().max(100).optional(),
  brothers: z.number().int().min(0).max(20).optional(),
  brothersMarried: z.number().int().min(0).max(20).optional(),
  sisters: z.number().int().min(0).max(20).optional(),
  sistersMarried: z.number().int().min(0).max(20).optional(),
  familyIncome: z.string().max(50).optional(),
  aboutFamily: z.string().max(2000).optional(),
  diet: z.enum(['VEGETARIAN', 'NON_VEGETARIAN', 'EGGETARIAN', 'VEGAN', 'JAIN'] as const).optional(),
  smoking: z.enum(['NO', 'YES', 'OCCASIONALLY'] as const).optional(),
  drinking: z.enum(['NO', 'YES', 'OCCASIONALLY', 'SOCIALLY'] as const).optional(),
  aboutMe: z.string().max(5000).optional(),
  partnerExpectation: z.string().max(5000).optional(),
})

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

export const step5Schema = z.object({
  photos: z
    .array(
      z.object({
        name: z.string(),
        type: z.string().refine((val) => ALLOWED_MIME_TYPES.includes(val), {
          message: 'File must be JPEG, PNG, WebP, or HEIC',
        }),
        size: z.number().refine((val) => val <= MAX_FILE_SIZE, {
          message: 'File must be less than 5MB',
        }),
        lastModified: z.number().optional(),
      }),
    )
    .min(1, 'At least one photo is required')
    .max(5, 'Maximum 5 photos allowed'),
  isPrimary: z.number().int().min(0).optional(),
})

export type Step1Input = z.infer<typeof step1Schema>
export type Step2Input = z.infer<typeof step2Schema>
export type Step3Input = z.infer<typeof step3Schema>
export type Step4Input = z.infer<typeof step4Schema>
export type Step5Input = z.infer<typeof step5Schema>

export const registrationSchemas: Record<number, z.ZodSchema> = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
} as const
