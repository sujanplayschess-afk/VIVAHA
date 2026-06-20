'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { X, Heart, Star, RefreshCw, Sparkles } from 'lucide-react'

interface SwipeProfile {
  id: string
  fullName: string
  age: number
  photos: { url: string; isPrimary: boolean }[]
  city: string
  state: string
  education: string
  occupation: string
  compatibilityScore: number
  verificationBadges: { type: string; verified: boolean }[]
}

interface SwipeDeckProps {
  profiles: SwipeProfile[]
  onSwipeLeft: (id: string) => void
  onSwipeRight: (id: string) => void
  onSwipeUp: (id: string) => void
  onRefresh: () => void
  isLoading?: boolean
}

const SwipeCard: React.FC<{
  profile: SwipeProfile
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSwipeUp: () => void
  isTop: boolean
  onNext: () => void
}> = ({ profile, onSwipeLeft, onSwipeRight, onSwipeUp, isTop, onNext }) => {
  const [exitX, setExitX] = useState(0)
  const [exitY, setExitY] = useState(0)
  const [exitRotation, setExitRotation] = useState(0)
  const [dragging, setDragging] = useState(false)

  const primaryPhoto = profile.photos.find(p => p.isPrimary)?.url || profile.photos[0]?.url

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 120
    const xOffset = info.offset.x
    const yOffset = info.offset.y

    if (xOffset < -threshold) {
      setExitX(-500)
      setExitRotation(-20)
      setTimeout(() => { onSwipeLeft(); onNext() }, 200)
    } else if (xOffset > threshold) {
      setExitX(500)
      setExitRotation(20)
      setTimeout(() => { onSwipeRight(); onNext() }, 200)
    } else if (yOffset < -threshold) {
      setExitY(-800)
      setTimeout(() => { onSwipeUp(); onNext() }, 200)
    }
  }

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: dragging ? undefined : exitX,
        y: dragging ? undefined : exitY,
        rotate: dragging ? undefined : exitRotation,
      }}
      exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1.2}
      onDragStart={() => setDragging(true)}
      onDragEnd={(_, info) => {
        setDragging(false)
        handleDragEnd(_, info)
      }}
      whileDrag={{ cursor: 'grabbing' }}
      style={{ zIndex: isTop ? 10 : 1 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
        {primaryPhoto ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${primaryPhoto})` }} />
        ) : (
          <div className="absolute inset-0 bg-brand-gradient" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <AnimatePresence>
          {isTop && dragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 pointer-events-none"
            >
              <motion.div
                className="absolute top-10 right-10 border-4 border-premium-verified rounded-xl px-6 py-3 -rotate-12"
                style={{ backgroundColor: 'rgba(0,200,83,0.2)', backdropFilter: 'blur(8px)' }}
              >
                <Heart size={40} className="text-premium-verified fill-premium-verified" />
              </motion.div>
              <motion.div
                className="absolute top-10 left-10 border-4 border-red-500 rounded-xl px-6 py-3 rotate-12"
                style={{ backgroundColor: 'rgba(255,0,0,0.2)', backdropFilter: 'blur(8px)' }}
              >
                <X size={40} className="text-red-500" />
              </motion.div>
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-brand rounded-xl px-6 py-3"
                style={{ backgroundColor: 'rgba(21,101,192,0.2)', backdropFilter: 'blur(8px)' }}
              >
                <Star size={40} className="text-brand fill-brand" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {profile.fullName}, {profile.age}
              </h3>
              <p className="text-sm text-white/70">{profile.city}, {profile.state}</p>
            </div>
            {profile.compatibilityScore > 0 && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/10">
                <Sparkles size={14} className="text-premium-gold" />
                <span className="text-white text-sm font-bold">{profile.compatibilityScore}%</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {profile.education && (
              <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-xs rounded-full border border-white/10">
                {profile.education}
              </span>
            )}
            {profile.occupation && (
              <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-xs rounded-full border border-white/10">
                {profile.occupation}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const LoadingSkeleton: React.FC = () => (
  <div className="w-full max-w-[380px] aspect-[3/4] mx-auto">
    <div className="w-full h-full rounded-3xl overflow-hidden">
      <div className="w-full h-full bg-gray-50 animate-pulse relative overflow-hidden">
        <div className="shimmer absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="h-6 w-48 bg-white/30 rounded-lg mb-2" />
          <div className="h-4 w-32 bg-white/20 rounded-lg mb-3" />
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-white/20 rounded-full" />
            <div className="h-6 w-28 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

const EmptyState: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full max-w-[380px] aspect-[3/4] mx-auto flex flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-brand/5 to-brand/5 border border-white/10"
  >
    <motion.div
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Sparkles size={48} className="text-brand/40 mb-4" />
    </motion.div>
    <h3 className="text-xl font-bold text-brand-navy mb-2">No More Profiles</h3>
    <p className="text-sm text-brand-navy/60 mb-6 text-center px-8">
      You've reviewed all profiles in your area. Check back later or broaden your search.
    </p>
    <button
      onClick={onRefresh}
      className="px-6 py-3 bg-brand-gradient text-white font-bold rounded-full flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all"
    >
      <RefreshCw size={16} /> Refresh
    </button>
  </motion.div>
)

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  profiles,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onRefresh,
  isLoading = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => prev + 1)
  }, [])

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 3)

  if (isLoading) {
    return (
      <div className="relative w-full max-w-[380px] aspect-[3/4] mx-auto">
        <LoadingSkeleton />
      </div>
    )
  }

  if (currentIndex >= profiles.length) {
    return <EmptyState onRefresh={onRefresh} />
  }

  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="relative w-full max-w-[380px] aspect-[3/4] mx-auto">
        <AnimatePresence mode="popLayout">
          {visibleProfiles.map((profile, index) => {
            const actualIndex = currentIndex + index
            const scale = 1 - index * 0.05
            const translateY = index * 12

            return (
              <motion.div
                key={profile.id}
                className="absolute inset-0"
                initial={false}
                animate={{ scale, y: translateY }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <SwipeCard
                  profile={profile}
                  onSwipeLeft={() => onSwipeLeft(profile.id)}
                  onSwipeRight={() => onSwipeRight(profile.id)}
                  onSwipeUp={() => onSwipeUp(profile.id)}
                  isTop={index === 0}
                  onNext={handleNext}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white shadow-lg border border-white/20 flex items-center justify-center hover:shadow-red-200/50 transition-shadow"
          onClick={() => {
            if (profiles[currentIndex]) {
              onSwipeLeft(profiles[currentIndex].id)
              handleNext()
            }
          }}
        >
          <X size={24} className="text-red-500" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-brand-gradient shadow-lg flex items-center justify-center"
          onClick={() => {
            if (profiles[currentIndex]) {
              onSwipeRight(profiles[currentIndex].id)
              handleNext()
            }
          }}
        >
          <Heart size={24} className="text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white shadow-lg border border-white/20 flex items-center justify-center hover:shadow-blue-200/50 transition-shadow"
          onClick={() => {
            if (profiles[currentIndex]) {
              onSwipeUp(profiles[currentIndex].id)
              handleNext()
            }
          }}
        >
          <Star size={24} className="text-brand" />
        </motion.button>
      </div>
    </div>
  )
}
