'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Mail, IdCard, Camera, Crown, ShieldCheck, X, Check } from 'lucide-react'

interface TrustStep {
  id: string
  label: string
  description: string
  verified: boolean
  icon: React.FC<{ size?: number; className?: string }>
}

interface TrustScoreProps {
  score: number
  steps?: TrustStep[]
}

const defaultSteps: TrustStep[] = [
  { id: 'mobile', label: 'Mobile Number', description: 'Verify your mobile number with OTP', verified: false, icon: Smartphone },
  { id: 'email', label: 'Email Address', description: 'Verify your email address', verified: false, icon: Mail },
  { id: 'id', label: 'Government ID', description: 'Upload a valid government ID', verified: false, icon: IdCard },
  { id: 'face', label: 'Face Verification', description: 'Take a selfie for face matching', verified: false, icon: Camera },
  { id: 'premium', label: 'Premium Membership', description: 'Upgrade to premium for enhanced trust', verified: false, icon: Crown },
]

export const TrustScore: React.FC<TrustScoreProps> = ({ score, steps = defaultSteps }) => {
  const verifiedCount = steps.filter(s => s.verified).length
  const totalSteps = steps.length
  const circumference = 2 * Math.PI * 42
  const scoreColor = score >= 80 ? '#00C853' : score >= 60 ? '#FFD700' : '#FF6B6B'

  const level = score >= 80 ? 'High Trust' : score >= 60 ? 'Medium Trust' : score >= 40 ? 'Basic Trust' : 'Low Trust'
  const levelColor = score >= 80 ? 'text-premium-verified' : score >= 60 ? 'text-premium-gold' : score >= 40 ? 'text-brand' : 'text-brand-navy/50'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(13,27,62,0.06)" strokeWidth="6" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke={scoreColor} strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                transform="rotate(-90 50 50)"
                style={{ filter: `drop-shadow(0 0 8px ${scoreColor}40)` }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <motion.span
                key={score}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-brand-navy"
              >
                {score}
              </motion.span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-navy">Trust Score</h3>
            <p className={`text-sm font-bold ${levelColor}`}>{level}</p>
            <p className="text-xs text-brand-navy/40 mt-1">
              {verifiedCount} of {totalSteps} steps verified
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                step.verified ? 'bg-premium-verified/[0.02]' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                step.verified ? 'bg-premium-verified/10' : 'bg-brand-navy/5'
              }`}>
                <Icon size={18} className={step.verified ? 'text-premium-verified' : 'text-brand-navy/30'} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold ${step.verified ? 'text-brand-navy' : 'text-brand-navy/60'}`}>
                  {step.label}
                </h4>
                <p className="text-xs text-brand-navy/40 mt-0.5">{step.description}</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.verified ? 'bg-premium-verified/10' : 'bg-red-500/5'
                }`}
              >
                {step.verified
                  ? <Check size={14} className="text-premium-verified" />
                  : <X size={14} className="text-red-400" />
                }
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
