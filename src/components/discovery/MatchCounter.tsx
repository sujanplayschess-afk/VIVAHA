'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface MatchCounterProps {
  count: number
  label?: string
}

export const MatchCounter: React.FC<MatchCounterProps> = ({ count, label = 'Potential Matches' }) => {
  const [displayCount, setDisplayCount] = React.useState(0)

  React.useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = count / steps
    const interval = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= count) {
        setDisplayCount(count)
        clearInterval(timer)
      } else {
        setDisplayCount(Math.floor(current))
      }
    }, interval)
    return () => clearInterval(timer)
  }, [count])

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 80,
    y: (Math.random() - 0.5) * 80,
    size: 4 + Math.random() * 6,
    delay: Math.random() * 2,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex flex-col items-center py-8"
    >
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, p.x],
            y: [0, p.y],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        >
          <Sparkles size={p.size} className="text-premium-gold" />
        </motion.div>
      ))}

      <div className="relative">
        <motion.span
          key={displayCount}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold brand-gradient-text"
        >
          {displayCount.toLocaleString()}
        </motion.span>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-brand-navy/60 text-sm mt-2 tracking-wide"
      >
        {label}
      </motion.p>

      <motion.div
        className="mt-4 h-1 w-24 rounded-full bg-brand-gradient"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      />
    </motion.div>
  )
}
