import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    firstName: z.string().min(2, 'First name is too short'),
    lastName: z.string().min(1, 'Last name is required'),
    gender: z.enum(['MALE', 'FEMALE']),
    dateOfBirth: z.string().refine((date) => {
        const age = (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24 * 365);
        return age >= 18;
    }, 'You must be at least 18 years old'),
    religion: z.string().min(1, 'Religion is required'),
    motherTongue: z.string().min(1, 'Mother tongue is required'),
});

export const otpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
});
