'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CompatibilityRingProps {
  score: number
  label: string
  color?: string
  size?: number
  strokeWidth?: number
}

export const CompatibilityRing: React.FC<CompatibilityRingProps> = ({
  score,
  label,
  color,
  size = 80,
  strokeWidth = 4,
}) => {
  const [displayScore, setDisplayScore] = useState(0)
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  const resolvedColor = color || (
    score >= 80 ? '#00C853' : score >= 60 ? '#FFD700' : '#FF6B6B'
  )

  useEffect(() => {
    const duration = 1000
    const steps = 30
    const increment = score / steps
    const interval = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.round(current))
      }
    }, interval)
    return () => clearInterval(timer)
  }, [score])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(13,27,62,0.06)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={resolvedColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            transform={`rotate(-90 ${center} ${center})`}
            style={{
              filter: `drop-shadow(0 0 6px ${resolvedColor}40)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={displayScore}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold text-brand-navy"
          >
            {displayScore}%
          </motion.span>
        </div>
      </div>
      <span className="text-xs text-brand-navy/60 font-medium">{label}</span>
    </motion.div>
  )
}
