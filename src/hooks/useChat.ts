'use client'

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useChatStore } from '@/stores/chat-store'
import { useAuthStore } from '@/stores/auth-store'
import { apiFetch } from '@/hooks/useApi'
import type { ChatRoom, Message } from '@/stores/chat-store'

export function useChat() {
  const store = useChatStore()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const queryClient = useQueryClient()

  const roomsQuery = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: async () => {
      const res = await apiFetch<ChatRoom[]>('/api/messages')
      const data = res.data ?? []
      store.setRooms(data)
      return data
    },
    enabled: isAuthenticated,
  })

  const fetchMessages = useCallback(
    async (roomId: string, page = 1) => {
      store.setLoadingMessages(true)
      try {
        const res = await apiFetch<Message[]>(`/api/messages/${roomId}?page=${page}`)
        const messages = res.data ?? []
        if (page === 1) {
          store.setMessages(roomId, messages)
        } else {
          store.prependMessages(roomId, messages)
        }
        store.setHasMoreMessages(roomId, messages.length >= 20)
        return messages
      } finally {
        store.setLoadingMessages(false)
      }
    },
    [store],
  )

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      roomId,
      content,
      type,
    }: {
      roomId: string
      content: string
      type?: string
    }) => {
      const res = await apiFetch<Message>('/api/messages', {
        method: 'POST',
        body: { roomId, content, type: type ?? 'TEXT' },
      })
      return res.data!
    },
    onSuccess: (message) => {
      if (message) {
        store.addMessage(message.roomId, message)
        store.updateRoom(message.roomId, { lastMessage: message })
      }
    },
  })

  const setActiveRoom = useCallback(
    (roomId: string | null) => {
      store.setActiveRoom(roomId)
      if (roomId) {
        store.resetUnread(roomId)
        fetchMessages(roomId)
      }
    },
    [store, fetchMessages],
  )

  const markAsRead = useCallback(
    async (roomId: string) => {
      store.resetUnread(roomId)
      try {
        await apiFetch('/api/notifications', {
          method: 'PUT',
          body: { roomId, type: 'MESSAGE_RECEIVED' },
        })
      } catch {
        // silently fail
      }
    },
    [store],
  )

  const loadMoreMessages = useCallback(
    async (roomId: string) => {
      const current = store.messages[roomId]
      if (!current) return
      const page = Math.ceil(current.length / 20) + 1
      await fetchMessages(roomId, page)
    },
    [store, fetchMessages],
  )

  const activeRoom = store.rooms.find((r) => r.id === store.activeRoomId) ?? null
  const messages = store.activeRoomId ? store.messages[store.activeRoomId] ?? [] : []

  return {
    rooms: store.rooms,
    activeRoom,
    messages,
    isLoading: roomsQuery.isLoading || store.isLoadingRooms || store.isLoadingMessages,
    unreadCounts: store.unreadCounts,
    typingUsers: store.typingUsers,

    fetchRooms: () => queryClient.invalidateQueries({ queryKey: ['chat-rooms'] }),
    fetchMessages,
    sendMessage: sendMessageMutation.mutateAsync,
    setActiveRoom,
    markAsRead,
    loadMoreMessages,
  }
}
