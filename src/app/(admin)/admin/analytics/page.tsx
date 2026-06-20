'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  Crown,
  Heart,
  TrendingUp,
  MapPin,
  PieChart,
  Loader2,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const summary = data?.summary || {}
  const genderRatio = data?.genderRatio || { male: 0, female: 0 }
  const subscriptionBreakdown = data?.subscriptionBreakdown || []
  const monthlyGrowth = data?.monthlyGrowth || []

  const summaryCards = [
    { title: 'Total Users', value: summary.totalUsers?.toLocaleString() || '0', change: `+${summary.newThisYear || 0} this year`, icon: Users, color: '#1565C0', bg: 'bg-brand/10' },
    { title: 'Active Users', value: summary.activeUsers?.toLocaleString() || '0', change: `${summary.activeUsers ? Math.round(summary.activeUsers / summary.totalUsers * 100) : 0}% of total`, icon: UserCheck, color: '#00C853', bg: 'bg-green-50' },
    { title: 'Premium Conversion', value: `${summary.premiumConversion || 0}%`, change: `${summary.premiumUsers || 0} premium users`, icon: Crown, color: '#FFD700', bg: 'bg-amber-50' },
    { title: 'Verification Rate', value: `${summary.verifiedPercentage || 0}%`, change: `${summary.pendingReports || 0} pending reports`, icon: Heart, color: '#E91E76', bg: 'bg-brand/10' },
  ]

  const maxGrowth = Math.max(...monthlyGrowth.map((m: any) => m.users), 1)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-montserrat text-brand-navy">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform metrics, growth trends, and user insights</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold font-montserrat" style={{ color: card.color }}>{card.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-brand-navy flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand" />
              User Growth (12 Months)
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-brand/70" />
                <span className="text-muted-foreground">Total Users</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-amber-400/70" />
                <span className="text-muted-foreground">Premium</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-56">
            {monthlyGrowth.map((m: any, i: number) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.premium / maxGrowth) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                  className="w-full rounded-t-sm bg-amber-400/70"
                  style={{ minHeight: 2 }}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.users / maxGrowth) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                  className="w-full rounded-t-sm bg-brand/70 hover:bg-brand transition-colors cursor-pointer relative group"
                  style={{ minHeight: 4 }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-navy text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {m.users} users
                  </div>
                </motion.div>
                <span className="text-[10px] text-muted-foreground mt-1">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gender Ratio & Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-6"
        >
          {/* Gender Ratio */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand" />
              Gender Ratio
            </h3>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E8F4FD" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E91E76" strokeWidth="2.5"
                    strokeDasharray={`${genderRatio.female} ${100 - genderRatio.female}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-brand/60" />
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                      Female
                    </span>
                    <span className="font-bold">{genderRatio.female}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${genderRatio.female}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full bg-brand-gradient"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                      Male
                    </span>
                    <span className="font-bold">{genderRatio.male}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${genderRatio.male}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full rounded-full bg-blue-gradient"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Breakdown */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Subscription Breakdown
            </h3>
            <div className="space-y-3">
              {subscriptionBreakdown.map((s: any, i: number) => {
                const colors = ['#E8F4FD', '#F0F0F0', '#FFF8E1', '#F3E5F5']
                const textColors = ['#1565C0', '#666', '#F9A825', '#7B1FA2']
                return (
                  <div key={s.plan}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{s.plan}</span>
                      <span className="font-bold" style={{ color: textColors[i] || '#666' }}>{s.percentage}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                        className="h-full rounded-full transition-all"
                        style={{ backgroundColor: colors[i] || '#eee', border: `1px solid ${textColors[i] || '#666'}20` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
