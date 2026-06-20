'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/stores/notification-store'
import { useAuthStore } from '@/stores/auth-store'
import { apiFetch } from '@/hooks/useApi'
import type { AppNotification } from '@/stores/notification-store'

const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

export function useNotifications() {
  const store = useNotificationStore()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const queryClient = useQueryClient()

  useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, 'list'],
    queryFn: async () => {
      const res = await apiFetch<AppNotification[]>('/api/notifications')
      const data = res.data ?? []
      store.setNotifications(data)
      return data
    },
    enabled: isAuthenticated,
  })

  useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, 'count'],
    queryFn: async () => {
      const res = await apiFetch<{ count: number }>('/api/notifications/count')
      const count = res.data?.count ?? 0
      store.setUnreadCount(count)
      return count
    },
    enabled: isAuthenticated,
    refetchInterval: 30000,
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (ids?: string[]) => {
      if (ids && ids.length > 0) {
        return apiFetch('/api/notifications', {
          method: 'PUT',
          body: { ids },
        })
      }
      return apiFetch('/api/notifications', {
        method: 'PUT',
        body: { all: true },
      })
    },
    onSuccess: (_data, ids) => {
      if (ids && ids.length > 0) {
        store.markAsRead(ids)
      } else {
        store.markAllAsRead()
      }
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiFetch('/api/notifications', {
        method: 'PUT',
        body: { all: true },
      })
    },
    onSuccess: () => {
      store.markAllAsRead()
    },
  })

  return {
    notifications: store.groupedNotifications,
    unreadCount: store.unreadCount,
    isLoading: store.isLoading,

    fetchNotifications: () =>
      queryClient.invalidateQueries({ queryKey: [...NOTIFICATIONS_QUERY_KEY, 'list'] }),
    fetchUnreadCount: () =>
      queryClient.invalidateQueries({ queryKey: [...NOTIFICATIONS_QUERY_KEY, 'count'] }),
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
  }
}
