'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, Minus } from 'lucide-react'

interface ScoreField {
  label: string
  userValue: string
  matchValue: string
  isMatch: boolean
  importance: 'high' | 'medium' | 'low'
}

interface ScoreBreakdownProps {
  fields: ScoreField[]
  overallScore: number
}

const fieldIcons: Record<string, string> = {
  Religion: '🕉️',
  Community: '👥',
  Education: '🎓',
  Occupation: '💼',
  Lifestyle: '🌿',
  Diet: '🥗',
  Location: '📍',
  Family: '👨‍👩‍👧‍👦',
  interests: '🎯',
  Personality: '💭',
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ fields, overallScore }) => {
  const matches = fields.filter(f => f.isMatch).length
  const totalImportant = fields.filter(f => f.importance === 'high').length
  const importantMatches = fields.filter(f => f.importance === 'high' && f.isMatch).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-navy">Score Breakdown</h3>
          <div className="text-right">
            <span className="text-2xl font-bold brand-gradient-text">{overallScore}%</span>
            <p className="text-[10px] text-brand-navy/40">Overall Match</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-brand-navy/60">
          <span className="flex items-center gap-1">
            <Check size={12} className="text-premium-verified" /> {matches}/{fields.length} Matched
          </span>
          {totalImportant > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-premium-gold">★</span> {importantMatches}/{totalImportant} Key Matches
            </span>
          )}
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {fields.map((field, i) => {
          const icon = fieldIcons[field.label] || '•'
          const importanceColor = field.importance === 'high' ? 'text-premium-gold' : field.importance === 'medium' ? 'text-brand' : 'text-brand-navy/30'

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm flex-shrink-0">
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-brand-navy">{field.label}</span>
                  {field.importance === 'high' && (
                    <span className={`text-[10px] ${importanceColor}`}>★</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-brand-navy/70 bg-white/10 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                    {field.userValue}
                  </span>
                  <span className="text-brand-navy/20 text-xs">vs</span>
                  <span className="text-xs text-brand-navy/70 bg-white/10 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                    {field.matchValue}
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05, type: 'spring' }}
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  field.isMatch
                    ? 'bg-premium-verified/10 text-premium-verified'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {field.isMatch ? <Check size={16} /> : <X size={16} />}
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
