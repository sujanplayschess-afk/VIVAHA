'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { X, Heart, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Send } from 'lucide-react'

interface StoryPhoto {
  url: string
  caption?: string
}

interface StoryProfile {
  id: string
  fullName: string
  age: number
  city: string
  state: string
  photos: StoryPhoto[]
  verificationBadges: { type: string; verified: boolean }[]
}

interface StoryViewerProps {
  profiles: StoryProfile[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  onSendInterest?: (profileId: string) => void
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  profiles,
  initialIndex = 0,
  isOpen,
  onClose,
  onSendInterest,
}) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(initialIndex)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartY = useRef(0)
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, 300], [1, 0])

  const currentProfile = profiles[currentProfileIndex]
  const totalPhotos = currentProfile?.photos.length || 0
  const DURATION = 5

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setProgress(0)
  }, [])

  const startTimer = useCallback(() => {
    resetTimer()
    const interval = 50
    const step = (interval / (DURATION * 1000)) * 100
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + step
        if (next >= 100) {
          goToNextPhoto()
          return 0
        }
        return next
      })
    }, interval)
  }, [currentProfileIndex, currentPhotoIndex, totalPhotos])

  const goToNextPhoto = useCallback(() => {
    if (currentPhotoIndex < totalPhotos - 1) {
      setCurrentPhotoIndex(prev => prev + 1)
    } else if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1)
      setCurrentPhotoIndex(0)
    } else {
      onClose()
    }
  }, [currentPhotoIndex, totalPhotos, currentProfileIndex, profiles.length, onClose])

  const goToPrevPhoto = useCallback(() => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1)
    } else if (currentProfileIndex > 0) {
      setCurrentProfileIndex(prev => prev - 1)
      setCurrentPhotoIndex((profiles[currentProfileIndex - 1]?.photos.length || 1) - 1)
    }
  }, [currentPhotoIndex, currentProfileIndex, profiles])

  useEffect(() => {
    if (isOpen) startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isOpen, currentProfileIndex, currentPhotoIndex, startTimer])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (dy > 100) onClose()
  }

  if (!isOpen || !currentProfile) return null

  const verified = currentProfile.verificationBadges.some(b => b.verified)

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ y, opacity }}
      >
        <div
          className="relative w-full max-w-[420px] h-full max-h-[90vh] aspect-[9/16]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute top-0 left-0 right-0 z-20 px-3 pt-3 flex gap-1.5">
            {currentProfile.photos.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: i < currentPhotoIndex ? '100%' : i === currentPhotoIndex ? '0%' : '0%' }}
                  animate={{ width: i < currentPhotoIndex ? '100%' : i === currentPhotoIndex ? `${progress}%` : '0%' }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            ))}
          </div>

          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          <button
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
            onClick={goToPrevPhoto}
          />

          <button
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
            onClick={goToNextPhoto}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentProfileIndex}-${currentPhotoIndex}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentProfile.photos[currentPhotoIndex]?.url})` }}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {currentProfile.fullName}, {currentProfile.age}
                </h2>
                <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {currentProfile.city}, {currentProfile.state}
                </p>
                {verified && (
                  <span className="inline-flex items-center gap-1 text-premium-verified text-xs mt-1">
                    <ShieldCheck size={12} /> Verified Profile
                  </span>
                )}
              </div>
            </div>

            {currentProfile.photos[currentPhotoIndex]?.caption && (
              <p className="text-white/80 text-sm mt-3">
                {currentProfile.photos[currentPhotoIndex].caption}
              </p>
            )}

            <button
              onClick={() => onSendInterest?.(currentProfile.id)}
              className="mt-4 w-full py-3 bg-brand-gradient text-white font-bold rounded-full flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Send size={16} /> Send Interest
            </button>
          </div>

          <div className="absolute top-12 left-3 z-20">
            <span className="text-white/50 text-xs">
              {currentProfileIndex + 1} of {profiles.length}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
