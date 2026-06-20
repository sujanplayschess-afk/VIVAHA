'use client'

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { apiFetch } from '@/hooks/useApi'

const SHORTLIST_QUERY_KEY = ['shortlists'] as const

export function useShortlist() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [...SHORTLIST_QUERY_KEY, 'ids'],
    queryFn: async () => {
      const res = await apiFetch<string[]>('/api/shortlists')
      return new Set(res.data ?? [])
    },
    enabled: isAuthenticated,
    select: (data) => data,
  })

  const shortlistIds = query.data ?? new Set<string>()

  const toggleMutation = useMutation({
    mutationFn: async (profileId: string) => {
      if (shortlistIds.has(profileId)) {
        await apiFetch('/api/shortlists', {
          method: 'DELETE',
          body: { profileId },
        })
      } else {
        await apiFetch('/api/shortlists', {
          method: 'POST',
          body: { profileId },
        })
      }
    },
    onMutate: async (profileId) => {
      await queryClient.cancelQueries({ queryKey: [...SHORTLIST_QUERY_KEY, 'ids'] })
      const previous = queryClient.getQueryData<Set<string>>([...SHORTLIST_QUERY_KEY, 'ids'])
      queryClient.setQueryData<Set<string>>(
        [...SHORTLIST_QUERY_KEY, 'ids'],
        (old) => {
          const next = new Set(old ?? [])
          if (next.has(profileId)) {
            next.delete(profileId)
          } else {
            next.add(profileId)
          }
          return next
        },
      )
      return { previous }
    },
    onError: (_err, _profileId, context) => {
      if (context?.previous) {
        queryClient.setQueryData([...SHORTLIST_QUERY_KEY, 'ids'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...SHORTLIST_QUERY_KEY, 'ids'] })
    },
  })

  const isShortlisted = useCallback(
    (profileId: string) => shortlistIds.has(profileId),
    [shortlistIds],
  )

  const toggleShortlist = useCallback(
    async (profileId: string) => {
      await toggleMutation.mutateAsync(profileId)
    },
    [toggleMutation],
  )

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [...SHORTLIST_QUERY_KEY, 'ids'] })
  }, [queryClient])

  return {
    shortlistedIds: shortlistIds,
    isShortlisted,
    toggleShortlist,
    fetchShortlists: refetch,
    isLoading: query.isLoading,
  }
}
