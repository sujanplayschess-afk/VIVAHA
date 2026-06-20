'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { apiFetch } from '@/hooks/useApi'

export interface CompatibilityResult {
  overall: number
  lifestyle: number
  education: number
  career: number
  familyValues: number
  interests: number
  personality: number
  matchedFields: string[]
  mismatchedFields: string[]
}

export function useCompatibility(targetProfileId: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const query = useQuery({
    queryKey: ['compatibility', targetProfileId],
    queryFn: async () => {
      const res = await apiFetch<CompatibilityResult>(
        `/api/compatibility/${targetProfileId}`,
      )
      return res.data ?? null
    },
    enabled: isAuthenticated && !!targetProfileId,
  })

  return {
    compatibility: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : 'Failed to load compatibility') : null,
  }
}
