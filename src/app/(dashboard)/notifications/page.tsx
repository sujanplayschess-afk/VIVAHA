'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Heart, MessageCircle, Eye, Crown, Shield, UserPlus, CheckCheck,
  Clock, Inbox, RefreshCw, Star, Sparkles, X,
} from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'

interface Notification {
  id: string
  type: 'interest_received' | 'interest_accepted' | 'message' | 'profile_view' | 'subscription' | 'system' | 'match'
  title: string
  message: string
  timestamp: Date
  read: boolean
  icon: React.ElementType
}

const generateNotifications = (): Notification[] => {
  const now = new Date()
  const types: Notification['type'][] = ['interest_received', 'interest_accepted', 'message', 'profile_view', 'subscription', 'system', 'match']
  const iconMap: Record<Notification['type'], React.ElementType> = {
    interest_received: Heart,
    interest_accepted: Heart,
    message: MessageCircle,
    profile_view: Eye,
    subscription: Crown,
    system: Shield,
    match: Star,
  }
  const titles: Record<Notification['type'], string> = {
    interest_received: 'Interest Received',
    interest_accepted: 'Interest Accepted',
    message: 'New Message',
    profile_view: 'Profile Viewed',
    subscription: 'Subscription Update',
    system: 'System Alert',
    match: "It's a Match!",
  }
  const messages: Record<Notification['type'], string[]> = {
    interest_received: ['Priya Sharma has sent you interest', 'Rahul Verma is interested in your profile', 'Ananya Gupta would like to connect'],
    interest_accepted: ['Ananya Gupta has accepted your interest', 'Your interest was accepted by Aarav Patel'],
    message: ['You have a new message from Neha', 'Vikram sent you a message: "Hi, how are you?"'],
    profile_view: ['Someone viewed your profile', 'Your profile was viewed 5 times today', '3 people viewed your profile today'],
    subscription: ['Your Gold plan will expire in 7 days', 'Diamond plan is now 15% off - Limited time offer'],
    system: ['Your profile has been verified successfully', 'New privacy features are now available'],
    match: ["You and Sneha have liked each other!", "It's a match with Arjun!", "New match! Priya also liked you"],
  }

  const items: Notification[] = []
  const timeSlots = [
    { minutes: 5, days: 0 },
    { minutes: 30, days: 0 },
    { minutes: 120, days: 0 },
    { minutes: 0, days: 1 },
    { minutes: 0, days: 1 },
    { minutes: 0, days: 2 },
    { minutes: 0, days: 4 },
    { minutes: 0, days: 8 },
    { minutes: 0, days: 14 },
    { minutes: 0, days: 25 },
  ]

  timeSlots.forEach((slot, i) => {
    const type = types[i % types.length]
    const ts = new Date(now)
    ts.setDate(ts.getDate() - slot.days)
    ts.setMinutes(ts.getMinutes() - slot.minutes)
    const msgList = messages[type]
    items.push({
      id: `notif-${i}`,
      type,
      title: titles[type],
      message: msgList[i % msgList.length],
      timestamp: ts,
      read: i > 3,
      icon: iconMap[type],
    })
  })
  return items
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function getIconBg(type: Notification['type']): string {
  switch (type) {
    case 'interest_received': return 'bg-pink-100 text-pink-500'
    case 'interest_accepted': return 'bg-green-100 text-green-500'
    case 'message': return 'bg-blue-100 text-blue-500'
    case 'profile_view': return 'bg-purple-100 text-purple-500'
    case 'subscription': return 'bg-yellow-100 text-yellow-500'
    case 'system': return 'bg-gray-100 text-gray-500'
    case 'match': return 'bg-brand/10 text-brand'
  }
}

function NotificationItem({
  notif,
  onMarkRead,
  index,
}: {
  notif: Notification
  onMarkRead: (id: string) => void
  index: number
}) {
  const Icon = notif.icon
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => { if (!notif.read) onMarkRead(notif.id) }}
      className={`group relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
        notif.read
          ? 'bg-white/50 border-white/30 hover:bg-white/70'
          : 'bg-white border-brand/10 shadow-sm hover:shadow-md'
      }`}
    >
      {!notif.read && (
        <span className="absolute top-4 left-4 w-2 h-2 bg-brand rounded-full" />
      )}
      <div className={`relative w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ml-2 ${getIconBg(notif.type)}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-sm ${notif.read ? 'font-medium' : 'font-bold'} text-brand-navy`}>
            {notif.title}
          </span>
          <span className="text-[10px] text-brand-navy/30 whitespace-nowrap ml-2">
            {getTimeAgo(notif.timestamp)}
          </span>
        </div>
        <p className="text-xs text-brand-navy/60 leading-relaxed">{notif.message}</p>
      </div>
      {!notif.read && (
        <button
          onClick={(e) => { e.stopPropagation(); onMarkRead(notif.id) }}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-brand-navy/30 hover:text-brand hover:bg-brand/5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  )
}

function GroupSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-brand-navy/30" />
        <h3 className="text-xs font-semibold text-brand-navy/40 uppercase tracking-wider">{label}</h3>
        <div className="flex-1 h-px bg-gray-50" />
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(generateNotifications)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {
      Today: [], Yesterday: [], 'This Week': [], Earlier: [],
    }
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - 7)

    notifications.forEach((n) => {
      const d = new Date(n.timestamp)
      const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      if (dateOnly.getTime() === today.getTime()) groups.Today.push(n)
      else if (dateOnly.getTime() === yesterday.getTime()) groups.Yesterday.push(n)
      else if (d >= weekStart) groups['This Week'].push(n)
      else groups.Earlier.push(n)
    })
    return groups
  }, [notifications])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const markOneRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await new Promise((r) => setTimeout(r, 1500))
    setNotifications(generateNotifications())
    setIsRefreshing(false)
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand" />
            Notifications
          </h1>
          <p className="text-brand-navy/50 text-sm mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 rounded-xl text-brand-navy/50 hover:text-brand hover:bg-brand/5 transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
          {unreadCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={markAllRead}
              className="h-10 px-5 bg-brand-gradient rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-brand/25"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark All Read
            </motion.button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-premium p-16 text-center border border-white/50"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-brand/10 flex items-center justify-center mb-4">
            <Inbox className="w-10 h-10 text-brand/40" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy mb-2">No Notifications Yet</h3>
          <p className="text-sm text-brand-navy/50 max-w-xs mx-auto">
            When someone sends you interest, messages, or profile views, they will appear here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence>
            {Object.entries(grouped).map(
              ([group, items]) =>
                items.length > 0 && (
                  <GroupSection key={group} label={group}>
                    <AnimatePresence>
                      {items.map((notif, i) => (
                        <NotificationItem key={notif.id} notif={notif} onMarkRead={markOneRead} index={i} />
                      ))}
                    </AnimatePresence>
                  </GroupSection>
                ),
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
