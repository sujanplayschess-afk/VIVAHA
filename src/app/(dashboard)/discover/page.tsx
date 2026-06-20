'use client'

import React, { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Heart, X, Bookmark, Filter, Grid3X3, Play, Image, SlidersHorizontal,
  MapPin, Briefcase, GraduationCap, BadgeCheck, Crown, Star, ChevronRight, RefreshCw,
  Loader2, Users, ArrowLeft, MessageCircle, Volume2, VolumeX, Maximize2,
} from 'lucide-react'
import { useDiscovery } from '@/hooks/useDiscovery'
import { useShortlist } from '@/hooks/useShortlist'
import type { DiscoverProfile } from '@/stores/discovery-store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const modes = [
  { id: 'swipe' as const, icon: Heart, label: 'Swipe' },
  { id: 'grid' as const, icon: Grid3X3, label: 'Grid' },
  { id: 'story' as const, icon: Image, label: 'Story' },
  { id: 'reels' as const, icon: Play, label: 'Reels' },
]

function PremiumSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-3 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-24 h-10 rounded-full bg-white/30 animate-pulse" />
        ))}
      </div>
      <div className="max-w-md mx-auto aspect-[3/4] rounded-3xl bg-white/20 animate-pulse" />
    </div>
  )
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center mb-6">
        <Users className="w-12 h-12 text-brand/40" />
      </div>
      <h3 className="text-xl font-bold text-brand-navy mb-2">No More Profiles</h3>
      <p className="text-brand-navy/50 text-sm max-w-sm mb-6">
        We&apos;ve shown you all available profiles matching your criteria. Try adjusting your filters.
      </p>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-full font-semibold shadow-lg shadow-brand/25 hover:scale-105 transition-all"
      >
        <RefreshCw className="w-4 h-4" /> Refresh
      </button>
    </motion.div>
  )
}

function MatchCounter({ count }: { count: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-24 right-6 z-30 bg-white/90 backdrop-blur-md rounded-2xl shadow-premium border border-white/50 px-4 py-3 hidden lg:block"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-brand-navy/40">Matches Found</p>
          <p className="text-2xl font-bold text-brand-navy">{count}</p>
        </div>
      </div>
    </motion.div>
  )
}

function DiscoveryToolbar({
  mode,
  onModeChange,
  onToggleFilters,
  hasFilters,
}: {
  mode: string
  onModeChange: (mode: 'swipe' | 'grid' | 'story' | 'reels') => void
  onToggleFilters: () => void
  hasFilters: boolean
}) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-premium p-1.5 border border-white/50">
        {modes.map((m) => {
          const Icon = m.icon
          const isActive = mode === m.id
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-brand-gradient text-white shadow-md' : 'text-brand-navy/60 hover:text-brand'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          )
        })}
      </div>
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
          hasFilters
            ? 'bg-brand-gradient text-white border-brand shadow-md'
            : 'bg-white/80 backdrop-blur-md border-white/50 text-brand-navy/60 hover:text-brand shadow-premium'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">Filters</span>
        {hasFilters && <div className="w-2 h-2 rounded-full bg-premium-gold" />}
      </button>
    </div>
  )
}

function FilterPanel({
  filters,
  onFilterChange,
  onApply,
  onClose,
}: {
  filters: any
  onFilterChange: (filters: Partial<any>) => void
  onApply: () => void
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-20 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-white/50 z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand" /> Filters
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-50 text-brand-navy/50">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Age Range</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={filters.ageMin}
                onChange={(e) => onFilterChange({ ageMin: Number(e.target.value) })}
                className="input-field w-full text-sm"
                placeholder="Min"
              />
              <span className="text-brand-navy/30">-</span>
              <input
                type="number"
                value={filters.ageMax}
                onChange={(e) => onFilterChange({ ageMax: Number(e.target.value) })}
                className="input-field w-full text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Religion</label>
            <select
              value={filters.religion}
              onChange={(e) => onFilterChange({ religion: e.target.value })}
              className="input-field w-full text-sm"
            >
              <option value="">Any Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
              <option value="Jain">Jain</option>
              <option value="Buddhist">Buddhist</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="input-field w-full text-sm"
              placeholder="e.g. Mumbai"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Education</label>
            <input
              type="text"
              value={filters.education}
              onChange={(e) => onFilterChange({ education: e.target.value })}
              className="input-field w-full text-sm"
              placeholder="e.g. MBA"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Occupation</label>
            <input
              type="text"
              value={filters.occupation}
              onChange={(e) => onFilterChange({ occupation: e.target.value })}
              className="input-field w-full text-sm"
              placeholder="e.g. Doctor"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Diet</label>
            <select
              value={filters.diet}
              onChange={(e) => onFilterChange({ diet: e.target.value })}
              className="input-field w-full text-sm"
            >
              <option value="">Any</option>
              <option value="VEGETARIAN">Vegetarian</option>
              <option value="NON_VEGETARIAN">Non-Vegetarian</option>
              <option value="EGGETARIAN">Eggetarian</option>
              <option value="VEGAN">Vegan</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Marital Status</label>
            <select
              value={filters.maritalStatus}
              onChange={(e) => onFilterChange({ maritalStatus: e.target.value })}
              className="input-field w-full text-sm"
            >
              <option value="">Any</option>
              <option value="NEVER_MARRIED">Never Married</option>
              <option value="DIVORCED">Divorced</option>
              <option value="WIDOWED">Widowed</option>
              <option value="SEPARATED">Separated</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50">
            <span className="text-sm font-medium text-brand-navy">Verified Only</span>
            <button
              onClick={() => onFilterChange({ onlyVerified: !filters.onlyVerified })}
              className={`relative w-12 h-6 rounded-full transition-all ${filters.onlyVerified ? 'bg-brand-gradient' : 'bg-gray-200'}`}
            >
              <motion.div
                animate={{ x: filters.onlyVerified ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50">
            <span className="text-sm font-medium text-brand-navy">With Photos Only</span>
            <button
              onClick={() => onFilterChange({ onlyWithPhotos: !filters.onlyWithPhotos })}
              className={`relative w-12 h-6 rounded-full transition-all ${filters.onlyWithPhotos ? 'bg-brand-gradient' : 'bg-gray-200'}`}
            >
              <motion.div
                animate={{ x: filters.onlyWithPhotos ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onApply}
          className="w-full mt-8 h-12 bg-brand-gradient text-white rounded-2xl font-semibold shadow-lg shadow-brand/25 flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" /> Apply Filters
        </motion.button>
      </div>
    </motion.div>
  )
}

function SwipeDeck({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onViewProfile,
}: {
  profile: DiscoverProfile
  onSwipeLeft: (id: string) => void
  onSwipeRight: (id: string) => void
  onSwipeUp: (id: string) => void
  onViewProfile: (id: string) => void
}) {
  const [exitX, setExitX] = useState(0)
  const [exitY, setExitY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true)
    setStartX(e.clientX)
    setStartY(e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    setOffsetX(e.clientX - startX)
    setOffsetY(e.clientY - startY)
  }

  const handlePointerUp = () => {
    if (!dragging) return
    setDragging(false)
    const threshold = 120
    if (offsetX > threshold) {
      setExitX(500)
      setTimeout(() => { onSwipeRight(profile.id); setExitX(0); setOffsetX(0); setOffsetY(0) }, 300)
    } else if (offsetX < -threshold) {
      setExitX(-500)
      setTimeout(() => { onSwipeLeft(profile.id); setExitX(0); setOffsetX(0); setOffsetY(0) }, 300)
    } else if (offsetY < -threshold) {
      setExitY(-500)
      setTimeout(() => { onSwipeUp(profile.id); setExitX(0); setOffsetX(0); setOffsetY(0) }, 300)
    } else {
      setOffsetX(0)
      setOffsetY(0)
    }
  }

  const rotate = offsetX * 0.08
  const likeOpacity = Math.min(offsetX / 150, 1)
  const nopeOpacity = Math.min(-offsetX / 150, 1)
  const superOpacity = Math.min(-offsetY / 150, 1)

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto cursor-grab active:cursor-grabbing select-none"
      animate={{ x: exitX, y: exitY, rotate: exitX * 0.08 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div
        className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-brand-gradient"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`,
          transition: dragging ? 'none' : 'transform 0.3s ease',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl text-white/20 font-bold">{profile.fullName.charAt(0)}</span>
        </div>

        <div
          className="absolute top-8 left-8 z-20 px-4 py-2 bg-green-500/90 rounded-xl rotate-[-15deg] border-2 border-white"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-white font-extrabold text-lg tracking-wider">LIKE</span>
        </div>
        <div
          className="absolute top-8 right-8 z-20 px-4 py-2 bg-red-500/90 rounded-xl rotate-[15deg] border-2 border-white"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-white font-extrabold text-lg tracking-wider">NOPE</span>
        </div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-6 py-3 bg-blue-500/90 rounded-2xl rotate-0 border-2 border-white"
          style={{ opacity: superOpacity }}
        >
          <span className="text-white font-extrabold text-lg tracking-wider flex items-center gap-2">
            <Star className="w-5 h-5 fill-white" /> SUPER
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">{profile.fullName}</h2>
            <span className="text-xl text-white/80">{profile.age}</span>
            {profile.verificationBadges?.some((b) => b.verified) && (
              <BadgeCheck className="w-6 h-6 text-premium-verified" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.city}, {profile.state}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {profile.occupation}</span>
            <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {profile.education}</span>
          </div>
          {profile.compatibilityScore > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden max-w-[200px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.compatibilityScore}%` }}
                  className="h-full bg-premium-gold rounded-full"
                />
              </div>
              <span className="text-xs text-premium-gold font-semibold">{profile.compatibilityScore}% Match</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { setExitX(-500); setTimeout(() => { onSwipeLeft(profile.id); setExitX(0) }, 300) }}
          className="w-14 h-14 rounded-full bg-white shadow-premium border border-white/50 flex items-center justify-center text-red-500 hover:shadow-red-500/20"
        >
          <X className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { setExitY(-500); setTimeout(() => { onSwipeUp(profile.id); setExitX(0); setExitY(0) }, 300) }}
          className="w-14 h-14 rounded-full bg-white shadow-premium border border-white/50 flex items-center justify-center text-blue-500 hover:shadow-blue-500/20"
        >
          <Star className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { setExitX(500); setTimeout(() => { onSwipeRight(profile.id); setExitX(0) }, 300) }}
          className="w-14 h-14 rounded-full bg-brand-gradient shadow-lg shadow-brand/30 flex items-center justify-center text-white"
        >
          <Heart className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onViewProfile(profile.id)}
          className="w-14 h-14 rounded-full bg-white shadow-premium border border-white/50 flex items-center justify-center text-brand-navy/60 hover:shadow-premium"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>
    </motion.div>
  )
}

function GridCard({
  profile,
  onInterest,
  onShortlist,
  onViewProfile,
  isShortlisted,
}: {
  profile: DiscoverProfile
  onInterest: (id: string) => void
  onShortlist: (id: string) => void
  onViewProfile: (id: string) => void
  isShortlisted: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-premium border border-white/50 overflow-hidden group"
    >
      <div className="aspect-[4/3] bg-brand-gradient flex items-center justify-center relative">
        <span className="text-4xl text-white/60 font-bold">{profile.fullName.charAt(0)}</span>
        {profile.verificationBadges?.some((b) => b.verified) && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-premium-verified/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" /> Verified
          </span>
        )}
        {profile.compatibilityScore >= 80 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-premium-gold/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" /> {profile.compatibilityScore}%
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onShortlist(profile.id) }}
          className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
            isShortlisted ? 'bg-brand text-white' : 'bg-white/80 text-brand-navy/40 hover:text-brand'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-white' : ''}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-brand-navy text-base">{profile.fullName}, {profile.age}</h3>
        </div>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-brand-navy/60">
            <MapPin className="w-3 h-3 text-brand/60" /> {profile.city}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-navy/60">
            <Briefcase className="w-3 h-3 text-brand/60" /> {profile.occupation}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-navy/60">
            <GraduationCap className="w-3 h-3 text-brand/60" /> {profile.education}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onInterest(profile.id)}
            className="flex-1 h-9 bg-brand-gradient rounded-xl text-white text-xs font-semibold shadow-lg shadow-brand/25 flex items-center justify-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5" /> Interest
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewProfile(profile.id)}
            className="flex-1 h-9 border border-brand/30 text-brand rounded-xl text-xs font-semibold"
          >
            View
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function StoryViewer({
  profiles,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  profiles: DiscoverProfile[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  const profile = profiles[currentIndex]
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { onNext(); return 0 }
        return p + 2
      })
    }, 100)
    return () => clearInterval(interval)
  }, [currentIndex, onNext])

  if (!profile) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative w-full max-w-md mx-auto aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-brand-navy"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl text-white/10 font-bold">{profile.fullName.charAt(0)}</span>
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex gap-1 mb-4">
          {profiles.slice(0, 5).map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{profile.fullName}, {profile.age}</p>
              <p className="text-white/60 text-xs">{profile.city}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20">
        <p className="text-white/90 text-sm mb-4 leading-relaxed">{profile.aboutMe}</p>
        <div className="flex gap-2">
          <button className="flex-1 h-10 bg-white/20 backdrop-blur-md rounded-xl text-white text-sm font-semibold border border-white/20">
            Send Interest
          </button>
          <button className="px-4 h-10 bg-premium-gold/20 backdrop-blur-md rounded-xl text-premium-gold text-sm font-semibold border border-premium-gold/30">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={onPrev} />
      <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={onNext} />
    </motion.div>
  )
}

function ReelsCard({
  profile,
  onNext,
  onPrev,
  onLike,
}: {
  profile: DiscoverProfile
  onNext: () => void
  onPrev: () => void
  onLike: (id: string) => void
}) {
  const [isMuted, setIsMuted] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative w-full max-w-sm mx-auto aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-brand-navy"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-brand-navy to-brand/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-7xl text-white/10 font-bold">{profile.fullName.charAt(0)}</span>
      </div>

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 z-20 p-2 bg-black/30 backdrop-blur-md rounded-full text-white"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full border-2 border-premium-gold flex items-center justify-center text-white font-bold bg-brand-gradient">
            {profile.fullName.charAt(0)}
          </div>
          <div>
            <h3 className="text-white font-bold">{profile.fullName}, {profile.age}</h3>
            <p className="text-white/60 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {profile.city}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onLike(profile.id)}
            className="ml-auto px-4 py-2 bg-brand-gradient rounded-full text-white text-xs font-semibold shadow-lg"
          >
            Follow
          </motion.button>
        </div>
        <p className="text-white/80 text-sm mt-3 line-clamp-2">{profile.aboutMe}</p>
        <div className="flex items-center gap-2 mt-3 text-white/60 text-xs">
          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {profile.occupation}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {profile.education}</span>
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={onPrev} />
      <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={onNext} />
    </motion.div>
  )
}

export default function DiscoverPage() {
  const {
    currentProfile, profiles, mode, isLoading, hasMore, filters, showFilters,
    fetchProfiles, loadMore, swipeLeft, swipeRight, swipeUp, sendInterest,
    toggleShortlist, setMode, setFilters, applyFilters, toggleFilters,
  } = useDiscovery()
  const { shortlistedIds, isShortlisted } = useShortlist()
  const [storyIndex, setStoryIndex] = useState(0)
  const [reelsIndex, setReelsIndex] = useState(0)

  const handleViewProfile = useCallback((id: string) => {
    window.location.href = `/profile?id=${id}`
  }, [])

  const hasActiveFilters = filters.ageMin > 18 || filters.ageMax < 60 || filters.religion !== '' || filters.city !== '' || filters.education !== '' || filters.occupation !== '' || filters.diet !== '' || filters.maritalStatus !== '' || filters.onlyVerified || filters.onlyWithPhotos

  if (isLoading && profiles.length === 0) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
        <DiscoveryToolbar mode={mode} onModeChange={setMode} onToggleFilters={toggleFilters} hasFilters={hasActiveFilters} />
        <PremiumSkeleton />
      </motion.div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
      <DiscoveryToolbar mode={mode} onModeChange={setMode} onToggleFilters={toggleFilters} hasFilters={hasActiveFilters} />

      <MatchCounter count={profiles.length} />

      <AnimatePresence>
        {showFilters && (
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onApply={() => { applyFilters(); toggleFilters() }}
            onClose={toggleFilters}
          />
        )}
      </AnimatePresence>

      {profiles.length === 0 && !isLoading ? (
        <EmptyState onRefresh={fetchProfiles} />
      ) : mode === 'swipe' && currentProfile ? (
        <SwipeDeck
          profile={currentProfile}
          onSwipeLeft={swipeLeft}
          onSwipeRight={swipeRight}
          onSwipeUp={swipeUp}
          onViewProfile={handleViewProfile}
        />
      ) : mode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {profiles.map((profile) => (
              <GridCard
                key={profile.id}
                profile={profile}
                onInterest={sendInterest}
                onShortlist={toggleShortlist}
                onViewProfile={handleViewProfile}
                isShortlisted={isShortlisted(profile.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : mode === 'story' ? (
        <AnimatePresence mode="wait">
          <StoryViewer
            key={storyIndex}
            profiles={profiles}
            currentIndex={storyIndex}
            onClose={() => setMode('grid')}
            onNext={() => setStoryIndex((i) => Math.min(i + 1, profiles.length - 1))}
            onPrev={() => setStoryIndex((i) => Math.max(i - 1, 0))}
          />
        </AnimatePresence>
      ) : mode === 'reels' ? (
        <AnimatePresence mode="wait">
          <ReelsCard
            key={reelsIndex}
            profile={profiles[reelsIndex]}
            onNext={() => setReelsIndex((i) => Math.min(i + 1, profiles.length - 1))}
            onPrev={() => setReelsIndex((i) => Math.max(i - 1, 0))}
            onLike={sendInterest}
          />
        </AnimatePresence>
      ) : null}

      {(hasMore && profiles.length > 0) && (
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadMore}
            disabled={isLoading}
            className="px-8 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-premium border border-white/50 text-brand-navy font-semibold flex items-center gap-2 hover:bg-white transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isLoading ? 'Loading...' : 'Load More'}
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
