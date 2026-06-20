'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, UserPlus, Users, Check, X, MessageCircle, Clock, Loader2,
  Inbox, Send, Ban, BadgeCheck, Sparkles,
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  age: number
  location: string
  occupation: string
  photo: string | null
  mutualInterests?: number
  isVerified?: boolean
}

const MOCK_RECEIVED: (UserProfile & { status: 'PENDING' | 'ACCEPTED' | 'DECLINED' })[] = [
  { id: 'ir1', name: 'Priya Sharma', age: 26, location: 'Mumbai', occupation: 'Software Engineer', photo: null, status: 'PENDING', isVerified: true },
  { id: 'ir2', name: 'Ananya Gupta', age: 24, location: 'Delhi', occupation: 'Doctor', photo: null, status: 'PENDING', isVerified: true },
  { id: 'ir3', name: 'Neha Singh', age: 27, location: 'Bangalore', occupation: 'Teacher', photo: null, status: 'PENDING', isVerified: false },
]

const MOCK_SENT: (UserProfile & { status: 'PENDING' | 'ACCEPTED' | 'WITHDRAWN' })[] = [
  { id: 'is1', name: 'Rahul Verma', age: 28, location: 'Pune', occupation: 'Banker', photo: null, status: 'PENDING' },
  { id: 'is2', name: 'Aarav Patel', age: 29, location: 'Chennai', occupation: 'Business Owner', photo: null, status: 'ACCEPTED' },
  { id: 'is3', name: 'Vikram Joshi', age: 30, location: 'Hyderabad', occupation: 'Lawyer', photo: null, status: 'WITHDRAWN' },
]

const MOCK_MATCHED: (UserProfile & { matchedAt?: string })[] = [
  { id: 'm1', name: 'Sneha Reddy', age: 25, location: 'Mumbai', occupation: 'Designer', photo: null, mutualInterests: 3, isVerified: true, matchedAt: '2 days ago' },
  { id: 'm2', name: 'Kavita Patel', age: 26, location: 'Ahmedabad', occupation: 'Architect', photo: null, mutualInterests: 5, isVerified: true, matchedAt: '1 week ago' },
]

const Tabs = [
  { id: 'received', label: 'Received', icon: UserPlus },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'matched', label: 'Matched', icon: Heart },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

function EmptyTabState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-md rounded-3xl shadow-premium p-16 text-center border border-white/50"
    >
      <div className="w-16 h-16 mx-auto rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-brand/40" />
      </div>
      <h3 className="text-lg font-bold text-brand-navy mb-2">{title}</h3>
      <p className="text-sm text-brand-navy/50 max-w-xs mx-auto">{description}</p>
    </motion.div>
  )
}

function ProfileCard({ user, actions, statusBadge }: {
  user: UserProfile
  actions?: React.ReactNode
  statusBadge?: React.ReactNode
}) {
  return (
    <motion.div
      variants={itemVariants}
      layout
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-premium border border-white/50 p-4 flex items-center gap-4 group"
    >
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center text-white text-lg font-bold">
          {user.name.charAt(0)}
        </div>
        {user.isVerified && (
          <BadgeCheck className="absolute -top-1 -right-1 w-5 h-5 text-premium-verified bg-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-brand-navy text-sm">{user.name}</h3>
          {statusBadge}
        </div>
        <p className="text-xs text-brand-navy/50">{user.age} yrs, {user.location}</p>
        <p className="text-xs text-brand-navy/60">{user.occupation}</p>
        {user.mutualInterests && (
          <p className="text-xs text-brand font-medium mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {user.mutualInterests} mutual interest{user.mutualInterests > 1 ? 's' : ''}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </motion.div>
  )
}

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState('received')
  const [received, setReceived] = useState(MOCK_RECEIVED)
  const [sent, setSent] = useState(MOCK_SENT)
  const [matched, setMatched] = useState(MOCK_MATCHED)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleAccept = useCallback(async (id: string) => {
    setProcessingId(id)
    await new Promise((r) => setTimeout(r, 800))
    const user = received.find((r) => r.id === id)
    if (user) {
      setReceived((prev) => prev.filter((r) => r.id !== id))
      setMatched((prev) => [...prev, {
        id: user.id, name: user.name, age: user.age, location: user.location,
        occupation: user.occupation, photo: user.photo, mutualInterests: 1, isVerified: user.isVerified,
      }])
    }
    setProcessingId(null)
  }, [received])

  const handleDecline = useCallback(async (id: string) => {
    setProcessingId(id)
    await new Promise((r) => setTimeout(r, 500))
    setReceived((prev) => prev.filter((r) => r.id !== id))
    setProcessingId(null)
  }, [])

  const handleWithdraw = useCallback(async (id: string) => {
    setProcessingId(id)
    await new Promise((r) => setTimeout(r, 600))
    setSent((prev) => prev.map((s) => s.id === id ? { ...s, status: 'WITHDRAWN' as const } : s))
    setProcessingId(null)
  }, [])

  const counts = {
    received: received.length,
    sent: sent.length,
    matched: matched.length,
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
          <Heart className="w-6 h-6 text-brand" />
          Matches
        </h1>
        <p className="text-brand-navy/50 text-sm mt-1">Manage your interests and connections</p>
      </div>

      <div className="flex gap-1 bg-white/80 backdrop-blur-md rounded-2xl shadow-premium p-1.5 border border-white/50 mb-6">
        {Tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-brand-gradient text-white shadow-md' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-50 text-brand-navy/50'
              }`}>
                {counts[tab.id as keyof typeof counts]}
              </span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          {activeTab === 'received' && (
            received.length === 0 ? (
              <EmptyTabState
                icon={Inbox}
                title="No New Interests"
                description="When someone sends you interest, it will appear here."
              />
            ) : (
              received.map((user) => (
                <ProfileCard
                  key={user.id}
                  user={user}
                  actions={
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAccept(user.id)}
                        disabled={processingId === user.id}
                        className="w-9 h-9 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                      >
                        {processingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDecline(user.id)}
                        disabled={processingId === user.id}
                        className="w-9 h-9 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                      >
                        {processingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                      </motion.button>
                    </>
                  }
                />
              ))
            )
          )}

          {activeTab === 'sent' && (
            sent.length === 0 ? (
              <EmptyTabState
                icon={Send}
                title="No Interests Sent"
                description="Start exploring profiles and send interests to connect."
              />
            ) : (
              sent.map((user) => (
                <ProfileCard
                  key={user.id}
                  user={user}
                  statusBadge={
                    user.status === 'ACCEPTED' ? (
                      <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Accepted
                      </span>
                    ) : user.status === 'WITHDRAWN' ? (
                      <span className="text-[10px] text-red-400 bg-red-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Ban className="w-3 h-3" /> Withdrawn
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )
                  }
                  actions={
                    user.status === 'PENDING' ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleWithdraw(user.id)}
                        disabled={processingId === user.id}
                        className="h-8 px-3 border border-red-300 text-red-400 rounded-xl text-[10px] font-medium hover:bg-red-50 transition-all"
                      >
                        {processingId === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Withdraw'}
                      </motion.button>
                    ) : null
                  }
                />
              ))
            )
          )}

          {activeTab === 'matched' && (
            matched.length === 0 ? (
              <EmptyTabState
                icon={Heart}
                title="No Matches Yet"
                description="When both sides accept interest, you'll be matched!"
              />
            ) : (
              matched.map((user) => (
                <ProfileCard
                  key={user.id}
                  user={user}
                  statusBadge={
                    <span className="text-[10px] text-brand bg-brand/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Matched
                    </span>
                  }
                  actions={
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="h-9 px-4 bg-brand-gradient rounded-xl text-white text-xs font-semibold shadow-lg shadow-brand/25 flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Message
                    </motion.button>
                  }
                />
              ))
            )
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
