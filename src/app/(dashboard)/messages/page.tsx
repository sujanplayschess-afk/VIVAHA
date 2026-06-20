'use client'

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, Phone, Video, Search, Send, Paperclip, Smile, MoreVertical,
  ChevronLeft, Loader2, Circle, Check, CheckCheck, Image, Mic, X,
} from 'lucide-react'

interface ChatMessage {
  id: string
  content: string
  timestamp: Date
  isSent: boolean
  readStatus: 'sent' | 'delivered' | 'read'
  reaction?: string | null
}

interface ChatUser {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  lastSeen: Date
  lastMessage: string
  timestamp: Date
  unreadCount: number
}

const MOCK_CONVERSATIONS: ChatUser[] = [
  { id: 'chat-1', name: 'Priya Sharma', avatar: '', lastMessage: 'Hey! How are you?', timestamp: new Date(Date.now() - 1000 * 60 * 5), unreadCount: 2, isOnline: true, lastSeen: new Date() },
  { id: 'chat-2', name: 'Rahul Verma', avatar: '', lastMessage: 'That sounds great!', timestamp: new Date(Date.now() - 1000 * 60 * 30), unreadCount: 0, isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 'chat-3', name: 'Ananya Gupta', avatar: '', lastMessage: 'Would you like to meet?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), unreadCount: 1, isOnline: true, lastSeen: new Date() },
  { id: 'chat-4', name: 'Sneha Reddy', avatar: '', lastMessage: 'Sure, let me check', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), unreadCount: 0, isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: 'chat-5', name: 'Kavita Patel', avatar: '', lastMessage: 'Thank you! 😊', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), unreadCount: 0, isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24) },
]

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'chat-1': [
    { id: 'm1', content: 'Hi there! I saw your profile and I think we have a lot in common.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isSent: false, readStatus: 'read' },
    { id: 'm2', content: 'Hey! Thank you so much. I actually thought the same when I saw yours!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), isSent: true, readStatus: 'read' },
    { id: 'm3', content: 'That is wonderful! What do you like to do in your free time?', timestamp: new Date(Date.now() - 1000 * 60 * 60), isSent: false, readStatus: 'read' },
    { id: 'm4', content: 'I love reading, traveling, and trying new cuisines. How about you?', timestamp: new Date(Date.now() - 1000 * 60 * 30), isSent: true, readStatus: 'delivered' },
    { id: 'm5', content: 'Hey! How are you?', timestamp: new Date(Date.now() - 1000 * 60 * 5), isSent: false, readStatus: 'delivered' },
  ],
  'chat-3': [
    { id: 'n1', content: 'Hello! I really liked your profile.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), isSent: false, readStatus: 'read' },
    { id: 'n2', content: 'Thanks Ananya! You seem like a great match too.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), isSent: true, readStatus: 'read' },
    { id: 'n3', content: 'Would you like to meet?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isSent: false, readStatus: 'read' },
  ],
}

function formatMessageDate(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.floor((today.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' })
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function getLastSeen(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const reactions = ['❤️', '😂', '😍', '👍', '🙏', '😢']

function ChatBubble({ message }: { message: ChatMessage }) {
  const [showReactions, setShowReactions] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.isSent ? 'justify-end' : 'justify-start'} mb-2 group`}
    >
      <div
        className={`relative max-w-[75%] px-4 py-2.5 rounded-2xl ${
          message.isSent
            ? 'bg-brand-gradient text-white rounded-br-md'
            : 'bg-white border border-gray-50 rounded-bl-md'
        }`}
      >
        <p className={`text-sm leading-relaxed ${message.isSent ? 'text-white' : 'text-brand-navy'}`}>
          {message.content}
        </p>
        <div className={`flex items-center gap-1 mt-1 ${message.isSent ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${message.isSent ? 'text-white/60' : 'text-brand-navy/30'}`}>
            {formatTime(message.timestamp)}
          </span>
          {message.isSent && (
            message.readStatus === 'read' ? (
              <CheckCheck className="w-3 h-3 text-premium-verified" />
            ) : (
              <Check className="w-3 h-3 text-white/50" />
            )
          )}
        </div>
        {message.reaction && (
          <span className="absolute -bottom-2 -right-2 text-lg">{message.reaction}</span>
        )}
        <button
          onClick={() => setShowReactions(!showReactions)}
          className={`absolute -top-2 ${message.isSent ? '-left-2' : '-right-2'} opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center text-xs`}
        >
          <Smile className="w-3 h-3 text-brand-navy/40" />
        </button>
        {showReactions && (
          <div className={`absolute -top-10 ${message.isSent ? 'left-0' : 'right-0'} bg-white rounded-xl shadow-premium border border-white/50 px-2 py-1.5 flex gap-1 z-10`}>
            {reactions.map((r) => (
              <button
                key={r}
                onClick={() => { setShowReactions(false); message.reaction = r }}
                className="hover:scale-125 transition-transform text-sm"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ChatInput({ onSend, disabled }: { onSend: (text: string) => void; disabled: boolean }) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="flex items-center gap-2 p-3 border-t border-gray-50 bg-white/50">
      <button className="p-2 rounded-xl text-brand-navy/40 hover:text-brand hover:bg-brand/5 transition-all">
        <Paperclip className="w-5 h-5" />
      </button>
      <button className="p-2 rounded-xl text-brand-navy/40 hover:text-brand hover:bg-brand/5 transition-all">
        <Image className="w-5 h-5" />
      </button>
      <button className="p-2 rounded-xl text-brand-navy/40 hover:text-brand hover:bg-brand/5 transition-all">
        <Smile className="w-5 h-5" />
      </button>
      <div className="flex-1 relative">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
          placeholder="Type a message..."
          className="input-field w-full h-11 text-sm pr-4"
        />
      </div>
      <motion.button
        whileHover={{ scale: text.trim() ? 1.05 : 1 }}
        whileTap={{ scale: text.trim() ? 0.95 : 1 }}
        onClick={handleSubmit}
        disabled={!text.trim() || disabled}
        className="p-2.5 bg-brand-gradient text-white rounded-xl disabled:opacity-40 shadow-lg shadow-brand/25 hover:shadow-brand/30 transition-all"
      >
        <Send className="w-5 h-5" />
      </motion.button>
      <button className="p-2.5 rounded-xl text-brand-navy/40 hover:text-brand hover:bg-brand/5 transition-all">
        <Mic className="w-5 h-5" />
      </button>
    </div>
  )
}

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(MOCK_MESSAGES)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeUser = useMemo(() => MOCK_CONVERSATIONS.find((c) => c.id === activeChat), [activeChat])
  const chatMessages = useMemo(() => (activeChat ? messages[activeChat] || [] : []), [activeChat, messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_CONVERSATIONS
    const q = searchQuery.toLowerCase()
    return MOCK_CONVERSATIONS.filter((c) => c.name.toLowerCase().includes(q))
  }, [searchQuery])

  const handleSend = useCallback(async (text: string) => {
    if (!activeChat) return
    setIsSending(true)
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: text,
      timestamp: new Date(),
      isSent: true,
      readStatus: 'sent',
    }
    setMessages((prev) => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), newMsg] }))
    await new Promise((r) => setTimeout(r, 1200))
    setMessages((prev) => ({
      ...prev,
      [activeChat]: (prev[activeChat] || []).map((m) =>
        m.id === newMsg.id ? { ...m, readStatus: 'delivered' as const } : m,
      ),
    }))
    setIsSending(false)
  }, [activeChat])

  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: ChatMessage[] }[] = []
    let currentGroup: { date: string; messages: ChatMessage[] } | null = null
    chatMessages.forEach((msg) => {
      const dateStr = formatMessageDate(msg.timestamp)
      if (!currentGroup || currentGroup.date !== dateStr) {
        currentGroup = { date: dateStr, messages: [] }
        groups.push(currentGroup)
      }
      currentGroup.messages.push(msg)
    })
    return groups
  }, [chatMessages])

  return (
    <div className="h-[calc(100vh-12rem)] max-w-6xl mx-auto">
      <div className="h-full bg-white/80 backdrop-blur-md rounded-3xl shadow-premium border border-white/50 overflow-hidden flex">
        <div className={`w-full lg:w-80 border-r border-gray-50 flex flex-col ${showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-brand-navy flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-brand" />
                Messages
              </h2>
              <span className="text-xs text-brand-navy/40">{filteredConversations.length} chats</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-navy/30" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="input-field w-full pl-9 h-9 text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle className="w-10 h-10 mx-auto text-brand-navy/20 mb-2" />
                <p className="text-xs text-brand-navy/40">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeChat === conv.id
                return (
                  <button
                    key={conv.id}
                    onClick={() => { setActiveChat(conv.id); setShowMobileChat(true) }}
                    className={`w-full flex items-center gap-3 p-4 transition-all hover:bg-brand/5 ${
                      isActive ? 'bg-brand/10 border-l-2 border-brand' : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-bold text-sm">
                        {conv.name.charAt(0)}
                      </div>
                      {conv.isOnline && (
                        <Circle className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 text-green-500 fill-green-500 stroke-white stroke-[2px]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-brand-navy">{conv.name}</h3>
                        <span className="text-[10px] text-brand-navy/30 whitespace-nowrap">
                          {getLastSeen(conv.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-brand-navy/50 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-brand-gradient text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${!showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
          {activeChat && activeUser ? (
            <>
              <div className="flex items-center justify-between p-3 border-b border-gray-50 bg-white/50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="lg:hidden text-brand-navy/50 hover:text-brand-navy"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-brand-gradient flex items-center justify-center text-white text-sm font-bold">
                      {activeUser.name.charAt(0)}
                    </div>
                    {activeUser.isOnline && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 text-green-500 fill-green-500 stroke-white stroke-[2px]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-navy text-sm">{activeUser.name}</h3>
                    <p className="text-[10px] text-brand-navy/40">
                      {activeUser.isOnline ? 'Online' : `Last seen ${getLastSeen(activeUser.lastSeen)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-xl text-brand-navy/50 hover:text-brand hover:bg-brand/5 transition-all">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl text-brand-navy/50 hover:text-brand hover:bg-brand/5 transition-all">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl text-brand-navy/50 hover:text-brand hover:bg-brand/5 transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-gradient-to-b from-brand/[0.02] to-transparent">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-12 h-12 text-brand-navy/20 mb-3" />
                    <p className="text-sm text-brand-navy/40">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  groupedMessages.map((group) => (
                    <div key={group.date}>
                      <div className="flex items-center justify-center my-4">
                        <span className="text-[10px] text-brand-navy/30 bg-white/80 px-3 py-1 rounded-full font-medium shadow-sm">
                          {group.date}
                        </span>
                      </div>
                      {group.messages.map((msg) => (
                        <ChatBubble key={msg.id} message={msg} />
                      ))}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <ChatInput onSend={handleSend} disabled={isSending} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-3xl bg-brand/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-brand/40" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">Your Messages</h3>
              <p className="text-sm text-brand-navy/50 max-w-sm">
                Select a conversation from the left to start chatting with your matches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
