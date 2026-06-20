'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Award } from 'lucide-react'

interface TimelineEntry {
  year: string
  title: string
  institution: string
  description: string
  type: 'education' | 'career' | 'achievement'
}

interface ProfileTimelineProps {
  entries: TimelineEntry[]
}

const typeConfig = {
  education: { icon: GraduationCap, color: 'text-brand', bg: 'bg-brand/10', border: 'border-brand/20' },
  career: { icon: Briefcase, color: 'text-brand', bg: 'bg-brand/10', border: 'border-brand/20' },
  achievement: { icon: Award, color: 'text-premium-gold', bg: 'bg-premium-gold/10', border: 'border-premium-gold/20' },
}

export const ProfileTimeline: React.FC<ProfileTimelineProps> = ({ entries }) => {
  if (entries.length === 0) return null

  return (
    <div className="relative pl-10">
      <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand/30 via-brand/30 to-transparent rounded-full" />

      {entries.map((entry, i) => {
        const config = typeConfig[entry.type]
        const Icon = config.icon
        const isLast = i === entries.length - 1

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="relative pb-8 last:pb-0"
          >
            <motion.div
              className={`absolute -left-[25px] w-[18px] h-[18px] rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center z-10`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current" style={{ color: config.color.replace('text-', '') }} />
            </motion.div>

            <motion.div
              className="ml-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-colors"
              whileHover={{ x: 4 }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] text-brand-navy/40 font-medium px-2 py-0.5 bg-white/10 rounded-full">
                      {entry.year}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                      {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-navy">{entry.title}</h4>
                  <p className="text-xs text-brand-navy/60 mt-0.5">{entry.institution}</p>
                  {entry.description && (
                    <p className="text-xs text-brand-navy/50 mt-2 leading-relaxed">{entry.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
