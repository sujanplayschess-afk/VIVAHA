'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Music, Palette, Camera, BookOpen, Code,
  Globe, Dumbbell, UtensilsCrossed, Plane,
  Gamepad2, Headphones, Mic,
} from 'lucide-react'

interface InterestTag {
  id: string
  name: string
  category: string
  icon: string
  description?: string
}

interface InterestTagsProps {
  tags: InterestTag[]
  onTagClick?: (tag: InterestTag) => void
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Music, Palette, Camera, BookOpen, Code,
  Globe, Dumbbell, UtensilsCrossed, Plane,
  Gamepad2, Headphones, Mic,
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  Arts: { bg: 'bg-brand/10', border: 'border-brand/20', text: 'text-brand' },
  Sports: { bg: 'bg-brand/10', border: 'border-brand/20', text: 'text-brand' },
  Music: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500' },
  Travel: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500' },
  Food: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500' },
  Technology: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-500' },
}

export const InterestTags: React.FC<InterestTagsProps> = ({ tags, onTagClick }) => {
  if (tags.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {tags.map((tag, i) => {
        const Icon = iconMap[tag.icon] || Music
        const colors = categoryColors[tag.category] || categoryColors.Arts

        return (
          <motion.button
            key={tag.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTagClick?.(tag)}
            className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl ${colors.bg} border ${colors.border} hover:shadow-lg transition-all cursor-pointer`}
          >
            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <Icon size={24} className={colors.text} />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-brand-navy block">{tag.name}</span>
              <span className="text-[10px] text-brand-navy/40 mt-0.5 block">{tag.category}</span>
            </div>
            {tag.description && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-white/90 backdrop-blur-xl text-brand-navy text-[10px] px-3 py-1.5 rounded-xl shadow-lg border border-white/20 whitespace-nowrap">
                  {tag.description}
                </div>
              </div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
