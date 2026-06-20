'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin, ShieldCheck, Crown, Heart, BookmarkPlus, MessageCircle, Sparkles } from 'lucide-react'

interface PremiumHeroProps {
  profile: {
    fullName: string
    age: number
    city: string
    state: string
    coverPhoto: string
    profilePhoto: string
    verificationBadges: { type: string; verified: boolean }[]
    compatibilityScore: number
    isPremium: boolean
    introduction: string
  }
  onSendInterest?: () => void
  onShortlist?: () => void
  onMessage?: () => void
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({
  profile,
  onSendInterest,
  onShortlist,
  onMessage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const coverY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const coverScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const profileY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const profileScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const verified = profile.verificationBadges.some(b => b.verified)
  const ringCircumference = 2 * Math.PI * 22

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ y: coverY, scale: coverScale }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.coverPhoto})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6"
        style={{ opacity }}
      >
        <motion.div
          className="relative mb-6"
          style={{ y: profileY, scale: profileScale }}
        >
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.profilePhoto})` }}
            />
          </div>

          <div className="absolute -bottom-1 -right-1">
            <svg width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="22" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <motion.circle
                cx="25" cy="25" r="22" fill="none"
                stroke="#00C853" strokeWidth="2" strokeLinecap="round"
                strokeDasharray={ringCircumference}
                initial={{ strokeDashoffset: ringCircumference }}
                animate={{ strokeDashoffset: ringCircumference - (ringCircumference * profile.compatibilityScore) / 100 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                transform="rotate(-90 25 25)"
              />
              <text x="25" y="28" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                {profile.compatibilityScore}%
              </text>
            </svg>
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {profile.fullName}, {profile.age}
        </motion.h1>

        <motion.p
          className="text-white/70 flex items-center gap-1.5 mt-2 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <MapPin size={14} /> {profile.city}, {profile.state}
        </motion.p>

        <motion.div
          className="flex items-center gap-2 mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {verified && (
            <span className="px-3 py-1 bg-premium-verified/20 backdrop-blur-sm text-premium-verified text-xs font-bold rounded-full flex items-center gap-1 border border-premium-verified/30">
              <ShieldCheck size={12} /> Verified
            </span>
          )}
          {profile.isPremium && (
            <span className="px-3 py-1 bg-premium-gold/20 backdrop-blur-sm text-premium-gold text-xs font-bold rounded-full flex items-center gap-1 border border-premium-gold/30">
              <Crown size={12} /> Premium
            </span>
          )}
        </motion.div>

        {profile.introduction && (
          <motion.p
            className="text-white/60 text-sm text-center mt-4 max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            "{profile.introduction}"
          </motion.p>
        )}

        <motion.div
          className="flex items-center gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSendInterest}
            className="px-6 py-3 bg-brand-gradient text-white font-bold rounded-full flex items-center gap-2 shadow-xl"
          >
            <Heart size={18} /> Send Interest
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShortlist}
            className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center"
          >
            <BookmarkPlus size={20} className="text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMessage}
            className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center"
          >
            <MessageCircle size={20} className="text-white" />
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-6 left-6"
        style={{ opacity }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  )
}
