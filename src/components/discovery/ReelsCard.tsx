'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Star, Share2, User, MapPin, Music, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react'

interface ReelsProfile {
  id: string
  fullName: string
  age: number
  photos: { url: string; isPrimary: boolean }[]
  city: string
  state: string
  education: string
  occupation: string
  aboutMe: string
  verificationBadges: { type: string; verified: boolean }[]
}

interface ReelsCardProps {
  profile: ReelsProfile
  isActive: boolean
  onLike: () => void
  onShortlist: () => void
  onViewProfile: () => void
}

export const ReelsCard: React.FC<ReelsCardProps> = ({
  profile,
  isActive,
  onLike,
  onShortlist,
  onViewProfile,
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showMusicNote, setShowMusicNote] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setShowMusicNote(prev => !prev)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isActive])

  const primaryPhoto = profile.photos.find(p => p.isPrimary)?.url || profile.photos[0]?.url
  const verified = profile.verificationBadges.some(b => b.verified)

  const handleLike = () => {
    setIsLiked(true)
    onLike()
    setTimeout(() => setIsLiked(false), 500)
  }

  const buttonItems = [
    { icon: Heart, label: 'Like', color: 'text-white', onClick: handleLike },
    { icon: Star, label: 'Shortlist', color: 'text-white', onClick: onShortlist },
    { icon: Share2, label: 'Share', color: 'text-white', onClick: () => {} },
    { icon: User, label: 'Profile', color: 'text-white', onClick: onViewProfile },
  ]

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${primaryPhoto})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

      <div className="absolute right-4 bottom-24 z-10 flex flex-col items-center gap-6">
        {buttonItems.map((item, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.85 }}
            onClick={item.onClick}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <item.icon
                size={22}
                className={item.label === 'Like' && isLiked ? 'text-brand fill-brand heart-pulse' : item.color}
              />
            </div>
            <span className="text-white/70 text-[10px]">{item.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="absolute bottom-6 left-4 right-20 z-10">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold text-white">
            {profile.fullName}, {profile.age}
          </h3>
          {verified && <ShieldCheck size={16} className="text-premium-verified" />}
        </div>
        <p className="text-sm text-white/80 flex items-center gap-1">
          <MapPin size={14} /> {profile.city}, {profile.state}
        </p>

        <p className="text-sm text-white/70 mt-2 line-clamp-2">{profile.aboutMe}</p>

        <div className="flex items-center gap-1 mt-3">
          <Music size={12} className="text-white/50" />
          <span className="text-white/50 text-xs">Suno AI • Meri Jaan</span>
        </div>
      </div>

      <AnimatePresence>
        {showMusicNote && (
          <motion.div
            key="music-note"
            className="absolute left-8 bottom-48 z-10"
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: -40, rotate: 20 }}
            exit={{ opacity: 0, y: -80, rotate: 40 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            <Music size={18} className="text-premium-gold" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 right-4 z-10">
        <span className="px-2 py-0.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-[10px] border border-white/10">
          Reels
        </span>
      </div>
    </div>
  )
}
