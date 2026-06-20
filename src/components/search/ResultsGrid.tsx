'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ShieldCheck, Heart, BookmarkPlus, Sparkles, Search } from 'lucide-react'
import { EmptyState } from '../discovery/EmptyState'

interface SearchResultProfile {
  id: string
  fullName: string
  age: number
  photos: { url: string; isPrimary: boolean }[]
  city: string
  state: string
  education: string
  occupation: string
  compatibilityScore: number
  isVerified: boolean
  isPremium: boolean
  isShortlisted: boolean
}

interface ResultsGridProps {
  profiles: SearchResultProfile[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onViewProfile?: (id: string) => void
  onShortlist?: (id: string) => void
  onInterest?: (id: string) => void
  onRefresh?: () => void
  onAdjustFilters?: () => void
}

const SkeletonCard: React.FC = () => (
  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 animate-pulse">
    <div className="w-full h-full relative overflow-hidden">
      <div className="shimmer absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="h-4 w-24 bg-white/30 rounded mb-2" />
        <div className="h-3 w-16 bg-white/20 rounded" />
      </div>
    </div>
  </div>
)

const ResultCard: React.FC<{
  profile: SearchResultProfile
  onViewProfile?: (id: string) => void
  onShortlist?: (id: string) => void
  onInterest?: (id: string) => void
}> = ({ profile, onViewProfile, onShortlist, onInterest }) => {
  const primaryPhoto = profile.photos.find(p => p.isPrimary)?.url || profile.photos[0]?.url

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer card-premium"
      whileHover={{ y: -4 }}
      onClick={() => onViewProfile?.(profile.id)}
    >
      <div className="absolute inset-0">
        {primaryPhoto ? (
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${primaryPhoto})` }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="absolute inset-0 bg-brand-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      </div>

      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {profile.isVerified && (
          <span className="px-2 py-0.5 bg-premium-verified/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full flex items-center gap-1">
            <ShieldCheck size={8} /> VERIFIED
          </span>
        )}
        {profile.education && (
          <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium rounded-full border border-white/10">
            {profile.education.length > 12 ? profile.education.slice(0, 12) + '...' : profile.education}
          </span>
        )}
      </div>

      {profile.isPremium && (
        <div className="absolute top-3 right-3 z-10">
          <Sparkles size={14} className="text-premium-gold drop-shadow-lg" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h4 className="text-white font-bold text-sm leading-tight">
          {profile.fullName}, {profile.age}
        </h4>
        <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
          <MapPin size={10} /> {profile.city}, {profile.state}
        </p>
        {profile.occupation && (
          <p className="text-white/60 text-[10px] mt-1 truncate">{profile.occupation}</p>
        )}

        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={e => { e.stopPropagation(); onInterest?.(profile.id) }}
            className="flex-1 py-1.5 bg-brand-gradient text-white text-[10px] font-bold rounded-full flex items-center justify-center gap-1"
          >
            <Heart size={10} /> Interest
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={e => { e.stopPropagation(); onShortlist?.(profile.id) }}
            className={`py-1.5 px-3 rounded-full text-[10px] font-bold border flex items-center justify-center gap-1 transition-colors ${
              profile.isShortlisted
                ? 'bg-brand text-white border-brand'
                : 'bg-white/20 text-white border-white/20 hover:bg-white/30'
            }`}
          >
            <BookmarkPlus size={10} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({
  profiles,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onViewProfile,
  onShortlist,
  onInterest,
  onRefresh,
  onAdjustFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <EmptyState
        type="no-results"
        onRefresh={onRefresh}
        onAdjustFilters={onAdjustFilters}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {profiles.map((profile, i) => (
            <motion.div
              key={profile.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <ResultCard
                profile={profile}
                onViewProfile={onViewProfile}
                onShortlist={onShortlist}
                onInterest={onInterest}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLoadMore}
            className="px-8 py-3 bg-white text-brand-navy font-bold rounded-full border border-white/30 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Search size={16} /> Load More
          </motion.button>
        </div>
      )}

      <div className="text-center text-xs text-brand-navy/40 pb-4">
        Showing {profiles.length} results
      </div>
    </div>
  )
}
