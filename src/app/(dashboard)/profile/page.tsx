'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  MapPin, BadgeCheck, Crown, Pencil, Calendar, User, Hash, Briefcase,
  GraduationCap, Heart, BookOpen, Music, Globe, Star, Sparkles, Shield,
  ChevronRight, Camera, HeartHandshake, Brain,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

function TabBar({ tabs, active, onChange }: {
  tabs: { id: string; label: string; icon: React.ElementType }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-gradient-to-r from-brand to-brand-dark text-brand-navy shadow-md'
                : 'bg-[var(--color-bg-card)] backdrop-blur-md text-[var(--color-text-secondary)] hover:text-brand border border-[var(--color-border-light)]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const size = 200
  const center = size / 2
  const radius = 80
  const levels = [20, 40, 60, 80, 100]
  const entries = Object.entries(scores)
  const angleStep = (Math.PI * 2) / entries.length

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2
    const r = (value / 100) * radius
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) }
  }

  const polygon = entries.map(([_, v], i) => {
    const p = getPoint(i, v)
    return `${p.x},${p.y}`
  }).join(' ')

  return (
    <svg width={size} height={size} className="mx-auto">
      {levels.map((level) => {
        const pts = entries.map((_, i) => {
          const p = getPoint(i, level)
          return `${p.x},${p.y}`
        }).join(' ')
        return (
          <polygon key={level} points={pts} fill="none" stroke="rgba(201,162,39,0.1)" strokeWidth={1} />
        )
      })}
      {entries.map((_, i) => {
        const start = getPoint(i, 0)
        const end = getPoint(i, 100)
        return <line key={i} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="rgba(201,162,39,0.1)" strokeWidth={1} />
      })}
      <polygon points={polygon} fill="rgba(201,162,39,0.15)" stroke="#C9A227" strokeWidth={2} />
      {entries.map(([key, value], i) => {
        const p = getPoint(i, value)
        return (
          <g key={key}>
            <circle cx={p.x} cy={p.y} r={4} fill="#C9A227" />
            <text x={getPoint(i, 120).x} y={getPoint(i, 120).y} textAnchor="middle" fontSize={10} fill="var(--color-text-primary)" className="font-medium">
              {key}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function PhotoLightbox({ photos, onClose }: { photos: { id: string; url: string }[]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-[var(--color-bg-card)] rounded-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="aspect-square rounded-2xl bg-gradient-to-br from-brand-dark to-brand-navy flex items-center justify-center text-white/40 text-2xl font-bold">
              {photo.url.charAt(0)}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [activeSection, setActiveSection] = useState('about')
  const [showLightbox, setShowLightbox] = useState(false)
  const initials = user?.email?.[0]?.toUpperCase() || 'U'
  const profileId = user?.profileId || 'VH000000'

  const sections = [
    { id: 'about', label: 'About', icon: User },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'timeline', label: 'Timeline', icon: BookOpen },
    { id: 'interests', label: 'Interests', icon: Heart },
    { id: 'preferences', label: 'Preferences', icon: HeartHandshake },
    { id: 'compatibility', label: 'Compatibility', icon: Brain },
  ]

  const mockPhotos = [
    { id: 'p1', url: 'photo1' },
    { id: 'p2', url: 'photo2' },
    { id: 'p3', url: 'photo3' },
    { id: 'p4', url: 'photo4' },
    { id: 'p5', url: 'photo5' },
    { id: 'p6', url: 'photo6' },
  ]

  const compatibilityScores = {
    Lifestyle: 85,
    Education: 90,
    Career: 75,
    Values: 80,
    Interests: 70,
    Personality: 88,
  }

  const timeline = [
    { year: '2013-2017', title: 'B.Tech in Computer Science', subtitle: 'IIT Bombay', icon: GraduationCap },
    { year: '2017-2019', title: 'Software Engineer', subtitle: 'Tech Corp', icon: Briefcase },
    { year: '2019-2021', title: 'MBA', subtitle: 'IIM Ahmedabad', icon: GraduationCap },
    { year: '2021-Present', title: 'Senior Product Manager', subtitle: 'Google', icon: Briefcase },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-3xl shadow-premium border border-[var(--color-border-light)] overflow-hidden"
      >
        <div className="h-48 bg-gradient-to-r from-brand-dark via-brand-navy to-brand-navy relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-premium-verified/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
            <span className="px-3 py-1 bg-brand text-brand-navy text-[10px] font-bold rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" /> Premium
            </span>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 gap-4">
            <div className="w-32 h-32 rounded-2xl border-4 border-[var(--color-bg-card)] bg-gradient-to-br from-brand to-brand-dark shadow-lg flex items-center justify-center shrink-0">
              <span className="text-5xl font-bold text-brand-navy">{initials}</span>
            </div>
            <div className="flex-1 pt-4 sm:pt-0 sm:pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-serif">
                  {user?.email?.split('@')[0] || 'User'} <span className="text-lg font-normal text-[var(--color-text-secondary)]">, 28</span>
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-brand/60" /> Mumbai, India</span>
                <span className="flex items-center gap-1"><Hash className="w-4 h-4 text-brand/60" /> {profileId}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-brand/60" /> Software Engineer</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4 text-brand/60" /> IIT Bombay</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2.5 bg-[var(--color-border-light)] rounded-full overflow-hidden max-w-xs">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-brand to-brand-dark rounded-full relative"
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-brand" />
                  </motion.div>
                </div>
                <span className="text-xs font-bold text-brand">65% Complete</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/profile/edit')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-brand-dark text-brand-navy rounded-full font-bold shadow-lg shadow-brand/25 hover:scale-105 transition-all shrink-0"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </motion.div>

      <TabBar tabs={sections} active={activeSection} onChange={setActiveSection} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -20 }}
        >
          {activeSection === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={sectionVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 font-serif">About Me</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  I am a software professional working in Mumbai. Love traveling, cooking, and reading books. Looking for a life partner who shares similar values and interests.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Diet', value: 'Vegetarian' },
                    { label: 'Smoking', value: 'No' },
                    { label: 'Drinking', value: 'Occasionally' },
                    { label: 'Language', value: 'Hindi, English' },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-[var(--color-border-light)]/50">
                      <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={sectionVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 font-serif">Basic Details</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Height', value: '5\'10"' },
                    { label: 'Weight', value: '75 kg' },
                    { label: 'Body Type', value: 'Average' },
                    { label: 'Complexion', value: 'Wheatish' },
                    { label: 'Marital Status', value: 'Never Married' },
                    { label: 'Blood Group', value: 'O+' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">{item.label}</span>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={sectionVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 font-serif">Family Background</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Family Type', value: 'Nuclear' },
                    { label: 'Family Status', value: 'Upper Middle Class' },
                    { label: 'Family Values', value: 'Moderate' },
                    { label: 'Father', value: 'Businessman' },
                    { label: 'Mother', value: 'Homemaker' },
                    { label: 'Siblings', value: '1 younger brother' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">{item.label}</span>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={sectionVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 font-serif">Education & Career</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Education', value: 'B.Tech in CSE' },
                    { label: 'College', value: 'IIT Bombay' },
                    { label: 'Employed In', value: 'Private Sector' },
                    { label: 'Occupation', value: 'Software Engineer' },
                    { label: 'Organization', value: 'Google' },
                    { label: 'Annual Income', value: 'INR 25-30 LPA' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">{item.label}</span>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeSection === 'gallery' && (
            <motion.div variants={sectionVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] font-serif">Photo Gallery</h3>
                <button
                  onClick={() => setShowLightbox(true)}
                  className="text-sm text-brand font-semibold flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {mockPhotos.slice(0, 4).map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-2xl bg-gradient-to-br from-brand-dark to-brand-navy flex items-center justify-center text-white/40 text-xl font-bold cursor-pointer hover:scale-105 transition-all"
                  >
                    {photo.url.charAt(0)}
                  </div>
                ))}
                <div className="aspect-square rounded-2xl bg-[var(--color-border-light)] flex items-center justify-center cursor-pointer hover:bg-brand/10 transition-all border-2 border-dashed border-brand/30">
                  <Camera className="w-6 h-6 text-brand/40" />
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'timeline' && (
            <motion.div variants={sectionVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-6 font-serif">My Journey</h3>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-brand/20" />
                <div className="space-y-8">
                  {timeline.map((item, i) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.year}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative pl-14"
                      >
                        <div className="absolute left-3 top-0 w-5 h-5 rounded-full bg-gradient-to-r from-brand to-brand-dark flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full text-brand-navy" />
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-brand" />
                          </div>
                          <div>
                            <p className="text-xs text-brand font-semibold">{item.year}</p>
                            <h4 className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5">{item.title}</h4>
                            <p className="text-xs text-[var(--color-text-secondary)]">{item.subtitle}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'interests' && (
            <motion.div variants={sectionVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 font-serif">Interests & Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {['Traveling', 'Cooking', 'Reading', 'Yoga', 'Photography', 'Music', 'Badminton', 'Swimming', 'Movies', 'Trekking'].map((interest) => (
                  <span
                    key={interest}
                    className="px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mt-8 mb-4 font-serif">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { lang: 'Hindi', level: 'Native' },
                  { lang: 'English', level: 'Fluent' },
                  { lang: 'Marathi', level: 'Native' },
                ].map((l) => (
                  <div key={l.lang} className="px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {l.lang} <span className="text-brand/60 font-normal">({l.level})</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'preferences' && (
            <motion.div variants={sectionVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-6 font-serif">Partner Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Calendar, label: 'Age Range', value: '25 - 32' },
                  { icon: User, label: 'Height Range', value: '5\'2" - 5\'8"' },
                  { icon: GraduationCap, label: 'Education', value: 'Graduate / PG' },
                  { icon: Briefcase, label: 'Occupation', value: 'Working Professional' },
                  { icon: MapPin, label: 'Location', value: 'Any metro city' },
                  { icon: Heart, label: 'Diet Preference', value: 'Vegetarian preferred' },
                ].map((pref) => {
                  const Icon = pref.icon
                  return (
                    <div key={pref.label} className="p-4 rounded-2xl bg-[var(--color-border-light)]/50 border border-[var(--color-border-light)]">
                      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-brand" />
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">{pref.label}</p>
                      <p className="text-sm font-bold text-[var(--color-text-primary)] mt-1">{pref.value}</p>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeSection === 'compatibility' && (
            <motion.div variants={sectionVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow-premium border border-[var(--color-border-light)] p-6">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-6 text-center font-serif">Compatibility Profile</h3>
              <RadarChart scores={compatibilityScores} />
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(compatibilityScores).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-xl bg-[var(--color-border-light)]/50 text-center">
                    <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">{key}</p>
                    <p className="text-lg font-bold text-[var(--color-text-primary)] mt-0.5">{value}%</p>
                    <div className="w-full h-1.5 bg-[var(--color-border-light)] rounded-full mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        className="h-full bg-gradient-to-r from-brand to-brand-dark rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {showLightbox && (
        <PhotoLightbox photos={mockPhotos} onClose={() => setShowLightbox(false)} />
      )}

      <div className="h-8" />
    </motion.div>
  )
}
