'use client'

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDiscoveryStore } from '@/stores/discovery-store'
import { useAuthStore } from '@/stores/auth-store'
import { apiFetch } from '@/hooks/useApi'
import type { PaginatedResponse } from '@/types'
import type { DiscoverProfile } from '@/stores/discovery-store'

const DISCOVER_QUERY_KEY = ['discovery'] as const

export function useDiscovery() {
  const store = useDiscoveryStore()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const queryClient = useQueryClient()

  const fetchProfilesFn = useCallback(async () => {
    const params = new URLSearchParams()
    const f = store.filters
    if (f.ageMin > 18) params.set('ageMin', String(f.ageMin))
    if (f.ageMax < 60) params.set('ageMax', String(f.ageMax))
    if (f.community) params.set('community', f.community)
    if (f.education) params.set('education', f.education)
    if (f.occupation) params.set('occupation', f.occupation)
    if (f.city) params.set('city', f.city)
    if (f.state) params.set('state', f.state)
    if (f.country) params.set('country', f.country)
    if (f.religion) params.set('religion', f.religion)
    if (f.diet) params.set('diet', f.diet)
    if (f.familyType) params.set('familyType', f.familyType)
    if (f.maritalStatus) params.set('maritalStatus', f.maritalStatus)
    if (f.onlyVerified) params.set('onlyVerified', 'true')
    if (f.onlyWithPhotos) params.set('onlyWithPhotos', 'true')
    if (f.heightMin > 100) params.set('heightMin', String(f.heightMin))
    if (f.heightMax < 230) params.set('heightMax', String(f.heightMax))

    const res = await apiFetch<DiscoverProfile[]>(`/api/discover?${params.toString()}`)
    return res.data ?? []
  }, [store.filters])

  const profilesQuery = useQuery({
    queryKey: [...DISCOVER_QUERY_KEY, store.filters],
    queryFn: fetchProfilesFn,
    enabled: isAuthenticated,
  })

  const interestMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const res = await apiFetch<{ status: string }>('/api/interests', {
        method: 'POST',
        body: { profileId },
      })
      return res.data
    },
    onSuccess: (_data, profileId) => {
      store.updateInterestStatus(profileId, 'pending')
    },
  })

  const shortlistMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const profile = store.profiles.find((p) => p.id === profileId)
      if (profile?.isShortlisted) {
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
    onSuccess: (_data, profileId) => {
      store.toggleShortlist(profileId)
    },
  })

  const loadMore = useCallback(async () => {
    store.setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(Math.ceil(store.profiles.length / 10) + 1))
      const res = await apiFetch<DiscoverProfile[]>(`/api/discover?${params.toString()}`)
      const newProfiles = res.data ?? []
      if (newProfiles.length === 0) {
        store.setHasMore(false)
      } else {
        store.appendProfiles(newProfiles)
      }
    } finally {
      store.setLoading(false)
    }
  }, [store])

  const sendInterest = useCallback(
    async (profileId: string) => {
      await interestMutation.mutateAsync(profileId)
    },
    [interestMutation],
  )

  const swipeRight = useCallback(
    async (profileId: string) => {
      await sendInterest(profileId)
    },
    [sendInterest],
  )

  const swipeLeft = useCallback(
    (profileId: string) => {
      store.removeProfile(profileId)
    },
    [store],
  )

  const swipeUp = useCallback(
    async (profileId: string) => {
      await shortlistMutation.mutateAsync(profileId)
    },
    [shortlistMutation],
  )

  const toggleShortlistHook = useCallback(
    async (profileId: string) => {
      await shortlistMutation.mutateAsync(profileId)
    },
    [shortlistMutation],
  )

  const setMode = useCallback(
    (mode: 'swipe' | 'grid' | 'story' | 'reels') => {
      store.setMode(mode)
    },
    [store],
  )

  const setFilters = useCallback(
    (filters: Partial<typeof store.filters>) => {
      store.setFilters(filters)
    },
    [store],
  )

  const applyFilters = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: DISCOVER_QUERY_KEY })
  }, [queryClient])

  const toggleFilters = useCallback(() => {
    store.setShowFilters(!store.showFilters)
  }, [store])

  const profiles = profilesQuery.data ?? store.profiles

  return {
    currentProfile: profiles[store.currentIndex] ?? null,
    profiles,
    mode: store.mode,
    isLoading: store.isLoading || profilesQuery.isLoading,
    hasMore: store.hasMore,
    filters: store.filters,
    showFilters: store.showFilters,

    fetchProfiles: () => queryClient.invalidateQueries({ queryKey: DISCOVER_QUERY_KEY }),
    loadMore,
    swipeLeft,
    swipeRight,
    swipeUp,
    sendInterest,
    toggleShortlist: toggleShortlistHook,
    setMode,
    setFilters,
    applyFilters,
    toggleFilters,
  }
}
