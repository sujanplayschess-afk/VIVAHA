import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | '';
  dateOfBirth: string;
  phone: string;
  email: string;
  password: string;
  religion: string;
  caste: string;
  subCaste: string;
  motherTongue: string;
  gothra: string;
  languages: string[];
  education: string;
  college: string;
  employmentSector: string;
  occupation: string;
  organization: string;
  annualIncome: string;
  state: string;
  city: string;
  familyType: string;
  familyStatus: string;
  familyValues: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothers: number;
  sisters: number;
  diet: string;
  smoking: string;
  drinking: string;
  aboutMe: string;
  photos: string[];
  primaryPhotoIndex: number;
}

interface RegistrationState {
  step: number;
  data: RegistrationData;
  isSubmitting: boolean;
  errors: Record<string, string>;
  setStep: (step: number) => void;
  updateData: (partial: Partial<RegistrationData>) => void;
  setSubmitting: (v: boolean) => void;
  setErrors: (e: Record<string, string>) => void;
  reset: () => void;
}

const initialData: RegistrationData = {
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  password: '',
  religion: '',
  caste: '',
  subCaste: '',
  motherTongue: '',
  gothra: '',
  languages: [],
  education: '',
  college: '',
  employmentSector: '',
  occupation: '',
  organization: '',
  annualIncome: '',
  state: '',
  city: '',
  familyType: '',
  familyStatus: '',
  familyValues: '',
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  brothers: 0,
  sisters: 0,
  diet: '',
  smoking: '',
  drinking: '',
  aboutMe: '',
  photos: [],
  primaryPhotoIndex: 0,
};

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      step: 1,
      data: initialData,
      isSubmitting: false,
      errors: {},
      setStep: (step) => set({ step }),
      updateData: (partial) =>
        set((state) => ({ data: { ...state.data, ...partial } })),
      setSubmitting: (isSubmitting) => set({ isSubmitting }),
      setErrors: (errors) => set({ errors }),
      reset: () => set({ step: 1, data: initialData, errors: {}, isSubmitting: false }),
    }),
    { name: 'registration-storage' }
  )
);
