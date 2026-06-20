'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, RefreshCw, Heart, Sparkles } from 'lucide-react'

interface EmptyStateProps {
  type?: 'no-matches' | 'no-results' | 'no-profiles'
  onRefresh?: () => void
  onAdjustFilters?: () => void
  message?: string
  submessage?: string
}

const illustrations = {
  'no-matches': {
    icon: Search,
    title: 'No Matches Yet',
    description: "We're finding the perfect match for you. Check back soon or broaden your search criteria.",
    action: 'Adjust Filters',
    secondaryAction: 'Refresh',
  },
  'no-results': {
    icon: SlidersHorizontal,
    title: 'No Results Found',
    description: 'Try adjusting your filters to discover more profiles that match your preferences.',
    action: 'Adjust Filters',
    secondaryAction: 'Reset Filters',
  },
  'no-profiles': {
    icon: Heart,
    title: 'All Caught Up',
    description: "You've viewed all profiles in your area. We'll notify you when new members join.",
    action: 'Check Back Later',
    secondaryAction: 'Refresh',
  },
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-matches',
  onRefresh,
  onAdjustFilters,
  message,
  submessage,
}) => {
  const config = illustrations[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-b from-brand/10 to-brand/10 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-b from-brand/20 to-brand/20 flex items-center justify-center">
            <Icon size={32} className="text-brand/60" />
          </div>
        </div>
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles size={18} className="text-premium-gold" />
        </motion.div>
      </motion.div>

      <h3 className="text-xl font-bold text-brand-navy mb-2 text-center">
        {message || config.title}
      </h3>
      <p className="text-sm text-brand-navy/60 text-center max-w-xs mb-8 leading-relaxed">
        {submessage || config.description}
      </p>

      <div className="flex flex-col items-center gap-3">
        {onAdjustFilters && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAdjustFilters}
            className="px-6 py-3 bg-brand-gradient text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <SlidersHorizontal size={16} /> {config.action}
          </motion.button>
        )}
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRefresh}
            className="px-6 py-3 bg-white text-brand-navy text-sm font-bold rounded-full flex items-center gap-2 border border-white/30 shadow-md hover:shadow-lg transition-shadow"
          >
            <RefreshCw size={16} /> {config.secondaryAction || 'Refresh'}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
