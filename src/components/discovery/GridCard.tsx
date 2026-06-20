'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, GraduationCap, ShieldCheck, Sparkles, Eye } from 'lucide-react'

interface GridCardProfile {
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
}

interface GridCardProps {
  profile: GridCardProfile
  onViewProfile?: (id: string) => void
  delay?: number
}

export const GridCard: React.FC<GridCardProps> = ({ profile, onViewProfile, delay = 0 }) => {
  const primaryPhoto = profile.photos.find(p => p.isPrimary)?.url || profile.photos[0]?.url
  const compatibilityColor = profile.compatibilityScore >= 80 ? '#00C853' : profile.compatibilityScore >= 60 ? '#FFD700' : '#FF6B6B'
  const ringCircumference = 2 * Math.PI * 14

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer card-premium"
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => onViewProfile?.(profile.id)}
    >
      <div className="absolute inset-0">
        {primaryPhoto ? (
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${primaryPhoto})` }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className="absolute inset-0 bg-brand-gradient" />
        )}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        />
      </div>

      <motion.div
        className="absolute top-3 left-3 z-10 flex flex-col gap-1.5"
        initial={false}
        whileHover={{ x: 2 }}
      >
        {profile.isVerified && (
          <span className="px-2 py-0.5 bg-premium-verified/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg">
            <ShieldCheck size={8} /> VERIFIED
          </span>
        )}
        {profile.education && (
          <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium rounded-full flex items-center gap-1 border border-white/10">
            <GraduationCap size={8} /> {profile.education.length > 15 ? profile.education.slice(0, 15) + '...' : profile.education}
          </span>
        )}
      </motion.div>

      <div className="absolute top-3 right-3 z-10">
        <svg width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="14" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <circle
            cx="18" cy="18" r="14" fill="none"
            stroke={compatibilityColor} strokeWidth="2" strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringCircumference - (ringCircumference * profile.compatibilityScore) / 100}
            transform="rotate(-90 18 18)"
          />
          <text x="18" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
            {profile.compatibilityScore}%
          </text>
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h4 className="text-white font-bold text-base leading-tight">
          {profile.fullName}, {profile.age}
        </h4>
        <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
          <MapPin size={10} /> {profile.city}
        </p>
        {profile.occupation && (
          <p className="text-white/60 text-[10px] mt-1 truncate">{profile.occupation}</p>
        )}
      </div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center z-20"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full flex items-center gap-2 border border-white/20"
          initial={{ y: 10 }}
          whileHover={{ y: 0 }}
        >
          <Eye size={14} className="text-white" />
          <span className="text-white text-xs font-bold">View Profile</span>
        </motion.div>
      </motion.div>

      {profile.isPremium && (
        <div className="absolute top-3 left-3 -translate-x-1 -translate-y-1">
          <Sparkles size={14} className="text-premium-gold drop-shadow-lg" />
        </div>
      )}
    </motion.div>
  )
}
