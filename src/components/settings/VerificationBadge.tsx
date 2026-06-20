'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, ShieldQuestion, Crown, Smartphone, Mail, IdCard, Camera, Check, X } from 'lucide-react'

interface VerificationBadgeProps {
  type: string
  label: string
  verified: boolean
  description?: string
  icon?: React.FC<{ size?: number; className?: string }>
  size?: 'sm' | 'md' | 'lg'
}

const typeIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  mobile: Smartphone,
  email: Mail,
  id: IdCard,
  face: Camera,
  premium: Crown,
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  label,
  verified,
  description,
  icon: CustomIcon,
  size = 'md',
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const Icon = CustomIcon || typeIcons[type] || ShieldQuestion

  const sizeClasses = {
    sm: { container: 'px-2 py-0.5 text-[10px]', icon: 10, gap: 'gap-1' },
    md: { container: 'px-3 py-1 text-xs', icon: 14, gap: 'gap-1.5' },
    lg: { container: 'px-4 py-1.5 text-sm', icon: 18, gap: 'gap-2' },
  }

  const config = sizeClasses[size]

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center ${config.gap} ${config.container} rounded-full font-bold border transition-all ${
          verified
            ? 'bg-premium-gold/15 border-premium-gold/30 text-premium-gold shadow-sm'
            : 'bg-white/20 border-white/20 text-brand-navy/40'
        }`}
      >
        <Icon size={config.icon} className={verified ? 'text-premium-gold' : 'text-brand-navy/30'} />
        <span>{label}</span>
        {verified ? (
          <Check size={config.icon - 2} className="text-premium-verified" />
        ) : null}
      </motion.div>

      <AnimatePresence>
        {showTooltip && description && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white/90 backdrop-blur-2xl rounded-xl border border-white/20 shadow-xl z-50 whitespace-nowrap"
          >
            <p className="text-xs text-brand-navy font-medium">{label}</p>
            <p className="text-[10px] text-brand-navy/60 mt-0.5">{description}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white/90 border-r border-b border-white/20 rotate-45 -mt-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
