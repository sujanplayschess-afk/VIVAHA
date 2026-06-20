import { create } from 'zustand'

export interface AppNotification {
  id: string
  type: string
  title: string
  message?: string
  data?: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}

export interface GroupedNotification {
  date: string
  label: string
  notifications: AppNotification[]
}

function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const dayMs = 86400000

  if (diff < dayMs && date.getDate() === now.getDate()) return 'Today'
  if (diff < 2 * dayMs && date.getDate() === now.getDate() - 1) return 'Yesterday'
  if (diff < 7 * dayMs) return 'This Week'
  if (diff < 30 * dayMs) return 'This Month'

  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

function groupByDate(notifications: AppNotification[]): GroupedNotification[] {
  const groups = new Map<string, AppNotification[]>()
  for (const n of notifications) {
    const label = getDateLabel(n.createdAt)
    const existing = groups.get(label) || []
    existing.push(n)
    groups.set(label, existing)
  }
  return Array.from(groups.entries()).map(([label, items]) => ({
    date: label,
    label,
    notifications: items,
  }))
}

interface NotificationState {
  notifications: AppNotification[]
  groupedNotifications: GroupedNotification[]
  unreadCount: number
  isLoading: boolean

  setNotifications: (notifications: AppNotification[]) => void
  addNotification: (notification: AppNotification) => void
  markAsRead: (ids: string[]) => void
  markAllAsRead: () => void
  setUnreadCount: (count: number) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  groupedNotifications: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications) =>
    set({
      notifications,
      groupedNotifications: groupByDate(notifications),
    }),

  addNotification: (notification) =>
    set((state) => {
      const updated = [notification, ...state.notifications]
      const unreadDelta = notification.isRead ? 0 : 1
      return {
        notifications: updated,
        groupedNotifications: groupByDate(updated),
        unreadCount: state.unreadCount + unreadDelta,
      }
    }),

  markAsRead: (ids) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        ids.includes(n.id) ? { ...n, isRead: true } : n,
      )
      const delta = ids.filter((id) => {
        const n = state.notifications.find((x) => x.id === id)
        return n && !n.isRead
      }).length
      return {
        notifications: updated,
        groupedNotifications: groupByDate(updated),
        unreadCount: Math.max(0, state.unreadCount - delta),
      }
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      groupedNotifications: groupByDate(
        state.notifications.map((n) => ({ ...n, isRead: true })),
      ),
      unreadCount: 0,
    })),

  setUnreadCount: (unreadCount) => set({ unreadCount }),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({
      notifications: [],
      groupedNotifications: [],
      unreadCount: 0,
      isLoading: false,
    }),
}))
