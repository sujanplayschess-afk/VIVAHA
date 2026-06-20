import { create } from 'zustand'

export interface MessageSender {
  id: string
  fullName: string
  avatarUrl?: string | null
}

export interface Message {
  id: string
  roomId: string
  senderId: string
  sender?: MessageSender
  content: string
  type: string
  metadata?: Record<string, unknown> | null
  readAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface ChatRoom {
  id: string
  type: string
  participantIds: string[]
  participants: MessageSender[]
  lastMessage?: Message | null
  createdAt: string
  updatedAt: string
}

interface ChatState {
  activeRoomId: string | null
  rooms: ChatRoom[]
  messages: Record<string, Message[]>
  unreadCounts: Record<string, number>
  typingUsers: Record<string, Record<string, boolean>>
  isLoadingRooms: boolean
  isLoadingMessages: boolean
  hasMoreMessages: Record<string, boolean>

  setActiveRoom: (roomId: string | null) => void
  setRooms: (rooms: ChatRoom[]) => void
  addRoom: (room: ChatRoom) => void
  updateRoom: (roomId: string, updates: Partial<ChatRoom>) => void
  setMessages: (roomId: string, messages: Message[]) => void
  addMessage: (roomId: string, message: Message) => void
  prependMessages: (roomId: string, messages: Message[]) => void
  setTyping: (roomId: string, userId: string, isTyping: boolean) => void
  incrementUnread: (roomId: string) => void
  resetUnread: (roomId: string) => void
  setHasMoreMessages: (roomId: string, hasMore: boolean) => void
  setLoadingRooms: (loading: boolean) => void
  setLoadingMessages: (loading: boolean) => void
  reset: () => void
}

export const useChatStore = create<ChatState>()((set) => ({
  activeRoomId: null,
  rooms: [],
  messages: {},
  unreadCounts: {},
  typingUsers: {},
  isLoadingRooms: false,
  isLoadingMessages: false,
  hasMoreMessages: {},

  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  setRooms: (rooms) => set({ rooms }),

  addRoom: (room) =>
    set((state) => {
      if (state.rooms.some((r) => r.id === room.id)) return state
      return { rooms: [...state.rooms, room] }
    }),

  updateRoom: (roomId, updates) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === roomId ? { ...r, ...updates } : r,
      ),
    })),

  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [roomId]: messages },
    })),

  addMessage: (roomId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
    })),

  prependMessages: (roomId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...messages, ...(state.messages[roomId] || [])],
      },
    })),

  setTyping: (roomId, userId, isTyping) =>
    set((state) => {
      const current = state.typingUsers[roomId] || {}
      return {
        typingUsers: {
          ...state.typingUsers,
          [roomId]: { ...current, [userId]: isTyping },
        },
      }
    }),

  incrementUnread: (roomId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [roomId]: (state.unreadCounts[roomId] || 0) + 1,
      },
    })),

  resetUnread: (roomId) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [roomId]: 0 },
    })),

  setHasMoreMessages: (roomId, hasMore) =>
    set((state) => ({
      hasMoreMessages: { ...state.hasMoreMessages, [roomId]: hasMore },
    })),

  setLoadingRooms: (isLoadingRooms) => set({ isLoadingRooms }),

  setLoadingMessages: (isLoadingMessages) => set({ isLoadingMessages }),

  reset: () =>
    set({
      activeRoomId: null,
      rooms: [],
      messages: {},
      unreadCounts: {},
      typingUsers: {},
      isLoadingRooms: false,
      isLoadingMessages: false,
      hasMoreMessages: {},
    }),
}))
