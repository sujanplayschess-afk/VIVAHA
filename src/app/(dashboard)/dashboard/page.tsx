'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Eye, Heart, MessageCircle, Bookmark, Crown, ArrowRight, Sparkles, Users,
  Bell, Star, BadgeCheck, MapPin, Briefcase, GraduationCap, Clock, Zap,
  TrendingUp, ChevronRight, RefreshCw,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let start = 0
    const duration = 1500
    const step = Math.ceil(value / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])

  return <span ref={ref}>{count}{suffix}</span>
}

function StatCard({
  icon: Icon,
  iconBg,
  count,
  label,
  trend,
  delay = 0,
}: {
  icon: React.ElementType
  iconBg: string
  count: number
  label: string
  trend: { value: number; isUp: boolean }
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${
          trend.isUp ? 'text-green-500' : 'text-red-400'
        }`}>
          <TrendingUp className={`w-3.5 h-3.5 ${!trend.isUp ? 'rotate-180' : ''}`} />
          {trend.value}%
        </span>
      </div>
      <h3 className="text-2xl font-bold text-[var(--color-text-primary)] font-serif">
        <AnimatedCounter value={count} />
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{label}</p>
    </motion.div>
  )
}

function MatchSuggestionCard({
  name, age, location, education, occupation, isPremium, isVerified, photoInitials, delay = 0,
}: {
  name: string
  age: number
  location: string
  education: string
  occupation: string
  isPremium?: boolean
  isVerified?: boolean
  photoInitials: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="min-w-[240px] bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] overflow-hidden shrink-0"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-brand-dark to-brand-navy flex items-center justify-center relative">
        <span className="text-3xl text-white/40 font-bold">{photoInitials}</span>
        <div className="absolute top-2 left-2 flex gap-1">
          {isVerified && (
            <span className="px-2 py-0.5 bg-premium-verified/90 text-white text-[8px] font-bold rounded-full flex items-center gap-0.5">
              <BadgeCheck className="w-2.5 h-2.5" /> Verified
            </span>
          )}
          {isPremium && (
            <span className="px-2 py-0.5 bg-brand text-brand-navy text-[8px] font-bold rounded-full flex items-center gap-0.5">
              <Crown className="w-2.5 h-2.5" /> Premium
            </span>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-[var(--color-text-primary)] text-sm font-serif">{name}, {age}</h4>
          <Sparkles className="w-3.5 h-3.5 text-brand" />
        </div>
        <div className="mt-1.5 space-y-0.5">
          <p className="flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)]">
            <MapPin className="w-2.5 h-2.5 text-brand/60" /> {location}
          </p>
          <p className="flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)]">
            <Briefcase className="w-2.5 h-2.5 text-brand/60" /> {occupation}
          </p>
          <p className="flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)]">
            <GraduationCap className="w-2.5 h-2.5 text-brand/60" /> {education}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-3 w-full h-8 bg-gradient-to-r from-brand to-brand-dark text-brand-navy rounded-xl text-[10px] font-semibold shadow-lg shadow-brand/25"
        >
          View Profile
        </motion.button>
      </div>
    </motion.div>
  )
}

function ActivityItem({
  icon: Icon, text, time, color,
}: {
  icon: React.ElementType
  text: string
  time: string
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand/5 transition-all"
    >
      <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--color-text-primary)]">{text}</p>
        <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" /> {time}
        </p>
      </div>
    </motion.div>
  )
}

function QuickAction({ icon: Icon, label, onClick, gradient }: {
  icon: React.ElementType
  label: string
  onClick: () => void
  gradient: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-2xl text-white ${gradient} shadow-lg`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-left flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-[10px] text-white/70">Get started now</p>
      </div>
      <ChevronRight className="w-5 h-5 text-white/60" />
    </motion.button>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const isPremium = user?.subscription === 'premium' || user?.role === 'PREMIUM_USER'
  const firstName = user?.email?.split('@')[0] || 'User'

  const stats = [
    { icon: Eye, iconBg: 'bg-gradient-to-br from-brand to-brand-dark', count: 128, label: 'Profile Views', trend: { value: 12, isUp: true } },
    { icon: Heart, iconBg: 'bg-gradient-to-br from-brand to-brand-dark', count: 47, label: 'Interests Received', trend: { value: 8, isUp: true } },
    { icon: MessageCircle, iconBg: 'bg-gradient-to-br from-brand to-brand-dark', count: 23, label: 'Messages', trend: { value: 5, isUp: true } },
    { icon: Bookmark, iconBg: 'bg-gradient-to-br from-brand-dark to-brand-dark', count: 156, label: 'Shortlists', trend: { value: 3, isUp: false } },
  ]

  const matchSuggestions = [
    { name: 'Priya', age: 26, location: 'Mumbai, India', religionCaste: 'Hindu, Brahmin', education: 'MBA, Finance', occupation: 'Investment Banker', isPremium: true, isVerified: true, photoInitials: 'PS' },
    { name: 'Ananya', age: 24, location: 'Delhi, India', religionCaste: 'Hindu, Kshatriya', education: 'B.Tech, CS', occupation: 'Software Engineer', isVerified: true, photoInitials: 'AK' },
    { name: 'Neha', age: 27, location: 'Bangalore, India', religionCaste: 'Hindu, Vaishya', education: 'MBBS', occupation: 'Doctor', isPremium: true, isVerified: true, photoInitials: 'NS' },
    { name: 'Riya', age: 25, location: 'Pune, India', religionCaste: 'Hindu, Kayastha', education: 'BA, Design', occupation: 'UI/UX Designer', isVerified: false, photoInitials: 'RG' },
  ]

  const activities = [
    { icon: Eye, text: 'Rahul Verma viewed your profile', time: '5 min ago', color: 'bg-brand' },
    { icon: Heart, text: 'New interest received from Priya Sharma', time: '15 min ago', color: 'bg-brand' },
    { icon: MessageCircle, text: 'You have a new message from Sneha', time: '1 hour ago', color: 'bg-brand' },
    { icon: Users, text: '3 new profiles matched your criteria', time: '2 hours ago', color: 'bg-brand-dark' },
    { icon: Star, text: 'Your profile was featured in searches', time: '3 hours ago', color: 'bg-brand-dark' },
  ]

  const incompleteSections = [
    { label: 'Education & Career', path: '/profile/edit?tab=education' },
    { label: 'Family Background', path: '/profile/edit?tab=family' },
    { label: 'Photos', path: '/profile/edit?tab=photos' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] font-serif"
          >
            Welcome back, <span className="brand-gradient-text">{firstName}</span>!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[var(--color-text-secondary)] mt-1"
          >
            Here&apos;s your matchmaking overview today.
          </motion.p>
        </div>
        {!isPremium && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => router.push('/subscription')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-brand-dark text-brand-navy rounded-full font-bold shadow-lg shadow-brand/25 hover:scale-105 transition-all"
          >
            <Crown className="w-4 h-4" /> Upgrade to Premium <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={0.1 * i} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2 font-serif">
                <Sparkles className="w-5 h-5 text-brand" /> Match Suggestions
              </h2>
              <button onClick={() => router.push('/matches')} className="text-sm font-semibold text-brand hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {matchSuggestions.map((match, i) => (
                <MatchSuggestionCard key={match.name} {...match} delay={0.5 + i * 0.1} />
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2 font-serif">
                <Zap className="w-5 h-5 text-brand" /> Recent Activity
              </h3>
              <button className="text-xs text-[var(--color-text-secondary)] hover:text-brand flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <div className="space-y-1">
              <AnimatePresence>
                {activities.map((activity, i) => (
                  <ActivityItem key={i} {...activity} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6"
          >
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 font-serif">Profile Completion</h3>
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-border-light)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                  stroke="url(#dashGrad)" strokeWidth="3" strokeDasharray="65, 100" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-brand">65%</span>
            </div>
            <svg width="0" height="0">
              <defs>
                <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C9A227" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>
            </svg>
            <div className="space-y-2">
              {incompleteSections.map((section) => (
                <button
                  key={section.label}
                  onClick={() => router.push(section.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--color-border-light)]/50 hover:bg-brand/5 transition-all text-left"
                >
                  <span className="text-xs text-[var(--color-text-secondary)]">{section.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Quick Actions</h3>
            <QuickAction
              icon={Sparkles}
              label="Discover Matches"
              onClick={() => router.push('/discover')}
              gradient="bg-gradient-to-r from-brand to-brand-dark"
            />
            <QuickAction
              icon={MessageCircle}
              label="Open Messages"
              onClick={() => router.push('/messages')}
              gradient="bg-gradient-to-r from-brand to-brand-dark"
            />
            <QuickAction
              icon={Heart}
              label="Edit Profile"
              onClick={() => router.push('/profile/edit')}
              gradient="bg-gradient-to-r from-brand-dark to-brand-navy"
            />
          </motion.div>

          {!isPremium && (
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-brand-dark via-brand-navy to-brand-navy rounded-2xl p-6 text-white shadow-xl"
            >
              <Crown className="w-8 h-8 text-brand mb-3" />
              <h3 className="text-xl font-bold mb-2 font-serif">Go Premium</h3>
              <p className="text-sm text-white/80 mb-4">Get unlimited access to all features, see who liked you, and more!</p>
              <button
                onClick={() => router.push('/subscription')}
                className="w-full py-3 bg-brand text-brand-navy font-bold rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Upgrade Now <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
