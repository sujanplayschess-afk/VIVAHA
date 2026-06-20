'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

interface CompatibilityRadarProps {
  scores: {
    overall: number
    lifestyle: number
    education: number
    career: number
    familyValues: number
    interests: number
    personality: number
  }
  size?: number
}

const LABELS: { key: keyof CompatibilityRadarProps['scores']; label: string }[] = [
  { key: 'overall', label: '' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'education', label: 'Education' },
  { key: 'career', label: 'Career' },
  { key: 'familyValues', label: 'Family' },
  { key: 'interests', label: 'Interests' },
  { key: 'personality', label: 'Personality' },
]

export const CompatibilityRadar: React.FC<CompatibilityRadarProps> = ({
  scores,
  size = 280,
}) => {
  const center = size / 2
  const radius = (size - 60) / 2
  const levels = 5

  const points = useMemo(() => {
    const categories = LABELS.filter(l => l.key !== 'overall')
    const angleStep = (2 * Math.PI) / categories.length
    const startAngle = -Math.PI / 2

    return categories.map((cat, i) => {
      const angle = startAngle + i * angleStep
      const score = (scores[cat.key] || 0) / 100
      const x = center + radius * score * Math.cos(angle)
      const y = center + radius * score * Math.sin(angle)
      return { ...cat, x, y, angle, score }
    })
  }, [scores, center, radius])

  const gridPoints = useMemo(() => {
    return Array.from({ length: levels }, (_, level) => {
      const r = (radius * (level + 1)) / levels
      return points.map(p => ({
        x: center + r * Math.cos(p.angle),
        y: center + r * Math.sin(p.angle),
      }))
    })
  }, [points, center, radius, levels])

  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex items-center justify-center"
      style={{ minHeight: size + 48 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {gridPoints.map((level, li) => (
          <polygon
            key={li}
            points={level.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {points.map((p, i) => {
          const next = points[(i + 1) % points.length]
          return (
            <line
              key={`radial-${i}`}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          )
        })}

        <motion.path
          d={polygonPath}
          fill="url(#radarGradient)"
          fillOpacity={0.4}
          stroke="url(#radarStrokeGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {points.map((p, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#E91E76"
            stroke="white"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.1, type: 'spring' }}
          />
        ))}

        {points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.x}
            y={p.y + (p.y > center ? 18 : -12)}
            textAnchor="middle"
            fill="rgba(13,27,62,0.6)"
            fontSize="10"
            fontWeight="500"
          >
            {p.label}
          </text>
        ))}

        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E91E76" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#42A5F5" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="radarStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E91E76" />
            <stop offset="100%" stopColor="#42A5F5" />
          </linearGradient>
        </defs>

        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>

      <motion.div
        className="absolute"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        <div className="text-center">
          <span className="text-3xl font-bold brand-gradient-text">{scores.overall}</span>
          <span className="text-brand-navy/40 text-xs block mt-0.5">Overall</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
