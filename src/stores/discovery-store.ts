import { create } from 'zustand'

export type DiscoveryMode = 'swipe' | 'grid' | 'story' | 'reels'

export interface DiscoveryFilters {
  ageMin: number
  ageMax: number
  heightMin: number
  heightMax: number
  community: string
  subCommunity: string
  education: string
  occupation: string
  salaryMin: number
  salaryMax: number
  country: string
  state: string
  city: string
  religion: string
  lifestyle: string
  diet: string
  familyType: string
  maritalStatus: string
  onlyVerified: boolean
  onlyWithPhotos: boolean
}

export interface DiscoverProfile {
  id: string
  userId: string
  fullName: string
  age: number
  height: number
  gender: string
  photos: { id: string; url: string; isPrimary: boolean }[]
  education: string
  occupation: string
  organization: string
  city: string
  state: string
  community: string
  religion: string
  motherTongue: string
  compatibilityScore: number
  isShortlisted: boolean
  interestStatus: 'none' | 'pending' | 'accepted' | 'declined'
  verificationBadges: { type: string; verified: boolean }[]
  lifestyle: { diet: string; smoking: string; drinking: string }
  familyValues: string
  aboutMe: string
}

interface DiscoveryState {
  mode: DiscoveryMode
  profiles: DiscoverProfile[]
  currentIndex: number
  isLoading: boolean
  hasMore: boolean
  filters: DiscoveryFilters
  showFilters: boolean

  setMode: (mode: DiscoveryMode) => void
  setProfiles: (profiles: DiscoverProfile[]) => void
  appendProfiles: (profiles: DiscoverProfile[]) => void
  setCurrentIndex: (index: number) => void
  nextProfile: () => void
  setLoading: (loading: boolean) => void
  setHasMore: (hasMore: boolean) => void
  setFilters: (filters: Partial<DiscoveryFilters>) => void
  resetFilters: () => void
  setShowFilters: (show: boolean) => void
  toggleShortlist: (profileId: string) => void
  updateInterestStatus: (profileId: string, status: DiscoverProfile['interestStatus']) => void
  removeProfile: (profileId: string) => void
  reset: () => void
}

const defaultFilters: DiscoveryFilters = {
  ageMin: 18,
  ageMax: 60,
  heightMin: 100,
  heightMax: 230,
  community: '',
  subCommunity: '',
  education: '',
  occupation: '',
  salaryMin: 0,
  salaryMax: 10000000,
  country: '',
  state: '',
  city: '',
  religion: '',
  lifestyle: '',
  diet: '',
  familyType: '',
  maritalStatus: '',
  onlyVerified: false,
  onlyWithPhotos: false,
}

export const useDiscoveryStore = create<DiscoveryState>()((set) => ({
  mode: 'swipe',
  profiles: [],
  currentIndex: 0,
  isLoading: false,
  hasMore: true,
  filters: { ...defaultFilters },
  showFilters: false,

  setMode: (mode) => set({ mode }),

  setProfiles: (profiles) => set({ profiles, currentIndex: 0 }),

  appendProfiles: (profiles) =>
    set((state) => ({ profiles: [...state.profiles, ...profiles] })),

  setCurrentIndex: (index) => set({ currentIndex: index }),

  nextProfile: () =>
    set((state) => {
      const next = state.currentIndex + 1
      if (next >= state.profiles.length) return state
      return { currentIndex: next }
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setHasMore: (hasMore) => set({ hasMore }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  setShowFilters: (show) => set({ showFilters: show }),

  toggleShortlist: (profileId) =>
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === profileId ? { ...p, isShortlisted: !p.isShortlisted } : p,
      ),
    })),

  updateInterestStatus: (profileId, status) =>
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === profileId ? { ...p, interestStatus: status } : p,
      ),
    })),

  removeProfile: (profileId) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== profileId),
    })),

  reset: () =>
    set({
      mode: 'swipe',
      profiles: [],
      currentIndex: 0,
      isLoading: false,
      hasMore: true,
      filters: { ...defaultFilters },
      showFilters: false,
    }),
}))
