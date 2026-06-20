'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Heart, Star, MessageCircle, UserPlus, ShieldCheck } from 'lucide-react'

interface Notification {
  id: string
  type: 'interest' | 'superlike' | 'message' | 'visit' | 'match' | 'verified'
  message: string
  time: string
  isRead: boolean
  profilePhoto?: string
}

interface NotificationBellProps {
  count: number
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onNotificationClick: (id: string) => void
  onViewAll?: () => void
}

const typeConfig = {
  interest: { icon: Heart, color: 'text-brand', bg: 'bg-brand/10' },
  superlike: { icon: Star, color: 'text-premium-gold', bg: 'bg-premium-gold/10' },
  message: { icon: MessageCircle, color: 'text-brand', bg: 'bg-brand/10' },
  visit: { icon: UserPlus, color: 'text-brand-navy/60', bg: 'bg-brand-navy/5' },
  match: { icon: Heart, color: 'text-premium-verified', bg: 'bg-premium-verified/10' },
  verified: { icon: ShieldCheck, color: 'text-premium-verified', bg: 'bg-premium-verified/10' },
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  count,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNotificationClick,
  onViewAll,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [prevCount, setPrevCount] = useState(count)
  const ref = useRef<HTMLDivElement>(null)
  const [shouldBounce, setShouldBounce] = useState(false)

  useEffect(() => {
    if (count > prevCount) {
      setShouldBounce(true)
      setTimeout(() => setShouldBounce(false), 600)
    }
    setPrevCount(count)
  }, [count])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full bg-brand-bg/80 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm"
      >
        <motion.div
          animate={shouldBounce ? {
            rotate: [0, -15, 15, -10, 10, -5, 5, 0],
          } : {}}
          transition={{ duration: 0.6 }}
        >
          <Bell size={18} className="text-brand-navy/70" />
        </motion.div>

        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center px-1 shadow-lg"
            >
              {count > 99 ? '99+' : count}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
              <h3 className="font-bold text-brand-navy text-sm">Notifications</h3>
              {count > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] text-brand font-bold hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell size={32} className="mx-auto text-brand-navy/20 mb-3" />
                  <p className="text-sm text-brand-navy/40">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const config = typeConfig[notif.type] || typeConfig.interest
                  const Icon = config.icon

                  return (
                    <motion.button
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => {
                        if (!notif.isRead) onMarkRead(notif.id)
                        onNotificationClick(notif.id)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-white/50 ${
                        !notif.isRead ? 'bg-brand/[0.02]' : ''
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed ${!notif.isRead ? 'font-bold text-brand-navy' : 'text-brand-navy/70'}`}>
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-brand-navy/40 mt-1 block">{notif.time}</span>
                      </div>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-2" />
                      )}
                    </motion.button>
                  )
                })
              )}
            </div>

            {onViewAll && notifications.length > 0 && (
              <button
                onClick={onViewAll}
                className="w-full py-3 text-center text-xs font-bold text-brand-navy/50 hover:text-brand border-t border-white/20 transition-colors"
              >
                View All Notifications
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
