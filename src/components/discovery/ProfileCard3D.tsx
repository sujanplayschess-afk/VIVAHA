'use client'

import React, { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { MapPin, GraduationCap, Briefcase, Heart, Star, ShieldCheck, Crown, X, Check, ChevronUp, Sparkles } from 'lucide-react'

interface ProfileCard3DProps {
  profile: {
    id: string
    fullName: string
    age: number
    height: number
    photos: { url: string; isPrimary: boolean }[]
    education: string
    occupation: string
    organization: string
    city: string
    state: string
    community: string
    religion: string
    motherTongue: string
    compatibilityScore: number
    isShortlisted: boolean
    interestStatus: string
    verificationBadges: { type: string; verified: boolean }[]
    lifestyle: { diet: string; smoking: string; drinking: string }
    familyValues: string
    aboutMe: string
  }
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onShortlist?: () => void
  style?: React.CSSProperties
}

export const ProfileCard3D: React.FC<ProfileCard3DProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onShortlist,
  style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSuperLiked, setIsSuperLiked] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const xPos = (e.clientX - rect.left) / rect.width - 0.5
    const yPos = (e.clientY - rect.top) / rect.height - 0.5
    x.set(xPos)
    y.set(yPos)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }, [x, y])

  const primaryPhoto = profile.photos.find(p => p.isPrimary)?.url || profile.photos[0]?.url
  const verified = profile.verificationBadges.some(b => b.verified)

  const compatibilityColor = profile.compatibilityScore >= 80 ? '#00C853' : profile.compatibilityScore >= 60 ? '#FFD700' : '#FF6B6B'
  const ringCircumference = 2 * Math.PI * 28

  return (
    <motion.div
      ref={cardRef}
      style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative w-full max-w-[380px] aspect-[3/4] cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        const threshold = 100
        if (info.offset.x < -threshold) onSwipeLeft?.()
        else if (info.offset.x > threshold) onSwipeRight?.()
        else if (info.offset.y < -threshold) onSwipeUp?.()
      }}
    >
      <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ transform: 'translateZ(0)' }}>
        {primaryPhoto ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${primaryPhoto})` }} />
        ) : (
          <div className="absolute inset-0 bg-brand-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex flex-col gap-2">
          {verified && (
            <span className="px-2.5 py-1 bg-premium-verified/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <ShieldCheck size={10} /> VERIFIED
            </span>
          )}
          {profile.interestStatus === 'mutual' && (
            <span className="px-2.5 py-1 bg-brand/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <Heart size={10} /> Mutual Interest
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {profile.verificationBadges.filter(b => b.verified).map((badge, i) => (
            <span key={i} className="w-7 h-7 rounded-full bg-premium-gold/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Crown size={12} className="text-brand-navy" />
            </span>
          ))}
        </div>
      </div>

      <motion.button
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
        style={{ transform: 'translateZ(40px)', backgroundColor: profile.isShortlisted ? 'rgba(233,30,118,0.9)' : 'rgba(255,255,255,0.2)' }}
        whileTap={{ scale: 0.85 }}
        onClick={onShortlist}
      >
        <motion.div
          animate={profile.isShortlisted ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.6, repeat: profile.isShortlisted ? Infinity : 0, repeatDelay: 1 }
        }>
          <Heart size={18} className={profile.isShortlisted ? 'text-white fill-white' : 'text-white'} />
        </motion.div>
      </motion.button>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {profile.fullName}, {profile.age}
            </h3>
            <p className="text-sm text-white/80 flex items-center gap-1.5 mt-1">
              <MapPin size={14} /> {profile.city}, {profile.state}
            </p>
          </div>
          <div className="relative flex items-center justify-center">
            <svg width="60" height="60" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <motion.circle
                cx="32" cy="32" r="28" fill="none"
                stroke={compatibilityColor} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={ringCircumference}
                initial={{ strokeDashoffset: ringCircumference }}
                animate={{ strokeDashoffset: ringCircumference - (ringCircumference * profile.compatibilityScore) / 100 }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                transform="rotate(-90 32 32)"
              />
            </svg>
            <span className="absolute text-sm font-bold text-white">{profile.compatibilityScore}%</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {profile.education && (
            <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1.5 border border-white/10">
              <GraduationCap size={12} /> {profile.education}
            </span>
          )}
          {profile.occupation && (
            <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1.5 border border-white/10">
              <Briefcase size={12} /> {profile.occupation}
            </span>
          )}
        </div>

        {profile.aboutMe && (
          <p className="text-xs text-white/70 line-clamp-2">{profile.aboutMe}</p>
        )}
      </div>

      <AnimatePresence>
        {isLiked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ transform: 'translateZ(50px)' }}
          >
            <div className="bg-premium-verified/90 rounded-full p-6 backdrop-blur-md">
              <Heart size={48} className="text-white fill-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuperLiked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ transform: 'translateZ(50px)' }}
          >
            <div className="bg-brand/90 rounded-full p-6 backdrop-blur-md">
              <Star size={48} className="text-white fill-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 pointer-events-none" style={{ transform: 'translateZ(5px)' }} />
    </motion.div>
  )
}
