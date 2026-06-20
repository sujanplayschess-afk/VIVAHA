'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Star, MessageCircle, UserPlus, ShieldCheck, Bell, Calendar } from 'lucide-react'

interface NotificationItem {
  id: string
  type: 'interest' | 'superlike' | 'message' | 'visit' | 'match' | 'verified'
  message: string
  time: string
  isRead: boolean
  profilePhoto?: string
}

interface NotificationGroupProps {
  date: string
  notifications: NotificationItem[]
  onMarkRead: (id: string) => void
  onNotificationClick: (id: string) => void
}

const typeConfig = {
  interest: { icon: Heart, color: 'text-brand', bg: 'bg-brand/10' },
  superlike: { icon: Star, color: 'text-premium-gold', bg: 'bg-premium-gold/10' },
  message: { icon: MessageCircle, color: 'text-brand', bg: 'bg-brand/10' },
  visit: { icon: UserPlus, color: 'text-brand-navy/60', bg: 'bg-brand-navy/5' },
  match: { icon: Heart, color: 'text-premium-verified', bg: 'bg-premium-verified/10' },
  verified: { icon: ShieldCheck, color: 'text-premium-verified', bg: 'bg-premium-verified/10' },
}

const dateLabels: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This Week',
  earlier: 'Earlier',
}

export const NotificationGroup: React.FC<NotificationGroupProps> = ({
  date,
  notifications,
  onMarkRead,
  onNotificationClick,
}) => {
  const label = dateLabels[date] || date

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 px-5 py-3">
        <Calendar size={12} className="text-brand-navy/30" />
        <span className="text-xs font-bold text-brand-navy/40 uppercase tracking-wider">{label}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <AnimatePresence mode="popLayout">
        {notifications.map((notif, i) => {
          const config = typeConfig[notif.type] || typeConfig.interest
          const Icon = config.icon

          return (
            <motion.button
              key={notif.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              onClick={() => {
                if (!notif.isRead) onMarkRead(notif.id)
                onNotificationClick(notif.id)
              }}
              className={`w-full flex items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-white/50 ${
                !notif.isRead ? 'bg-brand/[0.02]' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={config.color} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${!notif.isRead ? 'font-bold text-brand-navy' : 'text-brand-navy/70'}`}>
                  {notif.message}
                </p>
                <span className="text-[10px] text-brand-navy/40 mt-1 block">{notif.time}</span>
              </div>

              {!notif.isRead && (
                <motion.span
                  layoutId={`unread-dot-${notif.id}`}
                  className="w-2.5 h-2.5 rounded-full bg-brand flex-shrink-0 mt-2 shadow-sm shadow-brand/30"
                />
              )}
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
