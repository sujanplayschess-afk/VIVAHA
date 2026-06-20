'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, Square, Video, BookOpen, SlidersHorizontal, Bell, Circle } from 'lucide-react'

type DiscoveryMode = 'swipe' | 'grid' | 'story' | 'reels'

interface DiscoveryToolbarProps {
  activeMode: DiscoveryMode
  onModeChange: (mode: DiscoveryMode) => void
  onOpenFilters: () => void
  onOpenNotifications: () => void
  notificationCount?: number
  profileCompletion?: number
}

const modes: { key: DiscoveryMode; label: string; icon: React.FC<{ size?: number }> }[] = [
  { key: 'swipe', label: 'Swipe', icon: Square },
  { key: 'grid', label: 'Grid', icon: LayoutGrid },
  { key: 'story', label: 'Story', icon: BookOpen },
  { key: 'reels', label: 'Reels', icon: Video },
]

export const DiscoveryToolbar: React.FC<DiscoveryToolbarProps> = ({
  activeMode,
  onModeChange,
  onOpenFilters,
  onOpenNotifications,
  notificationCount = 0,
  profileCompletion = 0,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-brand-bg/80 backdrop-blur-sm rounded-2xl p-1.5 border border-white/20 shadow-sm">
            {modes.map(mode => {
              const Icon = mode.icon
              const isActive = activeMode === mode.key
              return (
                <button
                  key={mode.key}
                  onClick={() => onModeChange(mode.key)}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all"
                >
                  {isActive && (
                    <motion.div
                      layoutId="mode-indicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-md border border-white/20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={16} />
                    <span className={isActive ? 'text-brand-navy font-bold' : 'text-brand-navy/50'}>
                      {mode.label}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            {profileCompletion > 0 && profileCompletion < 100 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50/80 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-16 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-gradient rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[10px] text-brand-navy/60 font-medium">{profileCompletion}%</span>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenFilters}
              className="w-10 h-10 rounded-full bg-brand-bg/80 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm"
            >
              <SlidersHorizontal size={16} className="text-brand-navy/70" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenNotifications}
              className="relative w-10 h-10 rounded-full bg-brand-bg/80 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm"
            >
              <Bell size={16} className="text-brand-navy/70" />
              <AnimatePresence>
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center px-1 shadow-lg"
                  >
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
