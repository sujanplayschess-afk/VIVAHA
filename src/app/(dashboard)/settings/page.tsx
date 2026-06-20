'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, User, Shield, Bell, Ban, AlertTriangle, Mail, Phone, Lock,
  Eye, EyeOff, Save, Loader2, Check, X, Trash2, ChevronDown, BadgeCheck,
  Sparkles, Globe, Clock, Moon, Sun,
} from 'lucide-react'
import { useUIStore } from '@/stores/ui-store'

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'theme', label: 'Theme', icon: Sun },
  { id: 'verification', label: 'Verification', icon: BadgeCheck },
  { id: 'blocked', label: 'Blocked Users', icon: Ban },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

const PRIVACY_TOGGLES = [
  { key: 'showPhoto', label: 'Show Photo', description: 'Allow others to see your photos' },
  { key: 'showPhone', label: 'Show Phone', description: 'Display your phone number on profile' },
  { key: 'showEmail', label: 'Show Email', description: 'Display your email address on profile' },
  { key: 'showIncome', label: 'Show Income', description: 'Display your income on profile' },
  { key: 'allowChat', label: 'Allow Chat', description: 'Allow others to send you messages' },
  { key: 'profileDiscovery', label: 'Profile Discovery', description: 'Appear in search results' },
  { key: 'showAge', label: 'Show Age', description: 'Display your age on profile' },
  { key: 'showDistance', label: 'Show Distance', description: 'Display distance from other users' },
  { key: 'onlineStatus', label: 'Online Status', description: 'Show when you are online' },
]

const NOTIFICATION_TOGGLES = [
  { key: 'interestReceived', label: 'Interest Received', description: 'When someone sends you interest' },
  { key: 'interestAccepted', label: 'Interest Accepted', description: 'When your interest is accepted' },
  { key: 'messages', label: 'Messages', description: 'When you receive a new message' },
  { key: 'profileViews', label: 'Profile Views', description: 'When someone views your profile' },
  { key: 'subscription', label: 'Subscription Updates', description: 'Plan expiry and offers' },
  { key: 'system', label: 'System Alerts', description: 'Account and security alerts' },
  { key: 'matchAlerts', label: 'Match Alerts', description: 'When you get a new match' },
  { key: 'dailyDigest', label: 'Daily Digest', description: 'Daily summary of activity' },
]

const BLOCKED_USERS_MOCK = [
  { id: '1', name: 'Rahul Sharma', photo: null, blockedAt: '2026-05-15' },
  { id: '2', name: 'Priya Singh', photo: null, blockedAt: '2026-05-10' },
]

const VERIFICATION_STEPS = [
  { id: 'phone', label: 'Phone Number', status: 'verified' as const, icon: Phone },
  { id: 'email', label: 'Email Address', status: 'verified' as const, icon: Mail },
  { id: 'photo', label: 'Photo Verification', status: 'pending' as const, icon: User },
  { id: 'idproof', label: 'ID Proof', status: 'not_started' as const, icon: Shield },
  { id: 'address', label: 'Address Proof', status: 'not_started' as const, icon: Globe },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all ${value ? 'bg-gradient-to-r from-brand to-brand-dark' : 'bg-gray-200 dark:bg-brand-navy/50'}`}
    >
      <motion.div
        animate={{ x: value ? 24 : 2 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </button>
  )
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow p-6 sm:p-8 border border-[var(--color-border-light)] space-y-6">
      <h2 className="text-lg font-bold text-[var(--color-text-primary)] font-serif">{title}</h2>
      {children}
    </motion.div>
  )
}

export default function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useUIStore()
  const [activeTab, setActiveTab] = useState('account')
  const [email, setEmail] = useState('user@example.com')
  const [phone, setPhone] = useState('9876543210')
  const [name, setName] = useState('Rahul Sharma')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
  const [saving, setSaving] = useState('')
  const [privacy, setPrivacy] = useState<Record<string, boolean>>({
    showPhoto: true, showPhone: false, showEmail: false, showIncome: false,
    allowChat: true, profileDiscovery: true, showAge: true, showDistance: true, onlineStatus: true,
  })
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({
    interestReceived: true, interestAccepted: true, messages: true, profileViews: false,
    subscription: true, system: true, matchAlerts: true, dailyDigest: false,
  })
  const [blockedUsers, setBlockedUsers] = useState(BLOCKED_USERS_MOCK)
  const [deactivateConfirm, setDeactivateConfirm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteText, setDeleteText] = useState('')

  const handleSave = async (section: string) => {
    setSaving(section)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving('')
  }

  const handleUnblock = (userId: string) => {
    setBlockedUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const verificationScore = Math.round(
    (VERIFICATION_STEPS.filter((s) => s.status === 'verified').length / VERIFICATION_STEPS.length) * 100,
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2 font-serif">
          <Settings className="w-6 h-6 text-brand" />
          Settings
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-brand to-brand-dark text-brand-navy shadow-md'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border-light)] hover:text-brand'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {activeTab === 'account' && (
                <SettingsCard title="Account Settings">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                        <User className="inline w-4 h-4 mr-1.5 text-brand/60" />
                        Full Name
                      </label>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="input-field w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                        <Mail className="inline w-4 h-4 mr-1.5 text-brand/60" />
                        Email Address
                      </label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                        <Phone className="inline w-4 h-4 mr-1.5 text-brand/60" />
                        Phone Number
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="input-field w-full"
                      />
                    </div>
                  </div>

                  <hr className="border-[var(--color-border-light)]" />

                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2 font-serif">
                      <Lock className="w-4 h-4 text-brand" />
                      Change Password
                    </h3>
                    {[
                      { key: 'current', label: 'Current Password', val: currentPassword, set: setCurrentPassword, show: showPw.current, toggle: () => setShowPw((p) => ({ ...p, current: !p.current })) },
                      { key: 'new', label: 'New Password', val: newPassword, set: setNewPassword, show: showPw.new, toggle: () => setShowPw((p) => ({ ...p, new: !p.new })) },
                      { key: 'confirm', label: 'Confirm New Password', val: confirmPassword, set: setConfirmPassword, show: showPw.confirm, toggle: () => setShowPw((p) => ({ ...p, confirm: !p.confirm })) },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">{field.label}</label>
                        <div className="relative">
                          <input
                            type={field.show ? 'text' : 'password'}
                            value={field.val}
                            onChange={(e) => field.set(e.target.value)}
                            className="input-field w-full pr-10"
                          />
                          <button
                            type="button"
                            onClick={field.toggle}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                          >
                            {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSave('account')}
                    disabled={saving === 'account'}
                    className="h-11 px-6 bg-gradient-to-r from-brand to-brand-dark text-brand-navy rounded-xl font-semibold text-sm shadow-lg shadow-brand/25 flex items-center gap-2"
                  >
                    {saving === 'account' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving === 'account' ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </SettingsCard>
              )}

              {activeTab === 'privacy' && (
                <SettingsCard title="Privacy Settings">
                  <div className="space-y-3">
                    {PRIVACY_TOGGLES.map((toggle) => (
                      <motion.div
                        key={toggle.key}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-border-light)]/50 border border-[var(--color-border-light)]"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{toggle.label}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{toggle.description}</p>
                        </div>
                        <Toggle value={privacy[toggle.key]} onChange={() => setPrivacy((p) => ({ ...p, [toggle.key]: !p[toggle.key] }))} />
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSave('privacy')}
                    disabled={saving === 'privacy'}
                    className="h-11 px-6 bg-gradient-to-r from-brand to-brand-dark text-brand-navy rounded-xl font-semibold text-sm shadow-lg shadow-brand/25 flex items-center gap-2"
                  >
                    {saving === 'privacy' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving === 'privacy' ? 'Saving...' : 'Save Preferences'}
                  </motion.button>
                </SettingsCard>
              )}

              {activeTab === 'notifications' && (
                <SettingsCard title="Notification Preferences">
                  <div className="space-y-3">
                    {NOTIFICATION_TOGGLES.map((toggle) => (
                      <motion.div
                        key={toggle.key}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-border-light)]/50 border border-[var(--color-border-light)]"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{toggle.label}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{toggle.description}</p>
                        </div>
                        <Toggle value={notifPrefs[toggle.key]} onChange={() => setNotifPrefs((p) => ({ ...p, [toggle.key]: !p[toggle.key] }))} />
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSave('notifications')}
                    disabled={saving === 'notifications'}
                    className="h-11 px-6 bg-gradient-to-r from-brand to-brand-dark text-brand-navy rounded-xl font-semibold text-sm shadow-lg shadow-brand/25 flex items-center gap-2"
                  >
                    {saving === 'notifications' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving === 'notifications' ? 'Saving...' : 'Save Preferences'}
                  </motion.button>
                </SettingsCard>
              )}

              {activeTab === 'theme' && (
                <SettingsCard title="Theme Settings">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-border-light)]/50 border border-[var(--color-border-light)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                        {isDarkMode ? <Sun className="w-5 h-5 text-brand" /> : <Moon className="w-5 h-5 text-brand" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">Dark Mode</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {isDarkMode ? 'Dark theme is active' : 'Light theme is active'}
                        </p>
                      </div>
                    </div>
                    <Toggle value={isDarkMode} onChange={toggleDarkMode} />
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--color-border-light)]/50 border border-[var(--color-border-light)]">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Color Scheme</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand border-2 border-white shadow-md" title="Temple Gold" />
                      <div className="w-8 h-8 rounded-full bg-brand-dark border-2 border-white shadow-md" title="Royal Maroon" />
                      <div className="w-8 h-8 rounded-full bg-brand border-2 border-white shadow-md" title="brand" />
                      <div className="w-8 h-8 rounded-full bg-brand border-2 border-white shadow-md" title="brand" />
                      <div className="w-8 h-8 rounded-full bg-brand-dark border-2 border-white shadow-md" title="Antique Gold" />
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-2">VivahaSetu royal color palette</p>
                  </div>
                </SettingsCard>
              )}

              {activeTab === 'verification' && (
                <SettingsCard title="Verification Status">
                  <div className="text-center mb-6">
                    <div className="relative w-24 h-24 mx-auto">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-border-light)" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                          stroke="#00C853" strokeWidth="3" strokeDasharray={`${verificationScore}, 100`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BadgeCheck className="w-8 h-8 text-premium-verified" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mt-3 font-serif">Trust Score: {verificationScore}%</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">Complete all steps to get the verified badge</p>
                  </div>

                  <div className="space-y-3">
                    {VERIFICATION_STEPS.map((step) => {
                      const Icon = step.icon
                      const statusConfig = {
                        verified: { color: 'text-premium-verified bg-green-50 dark:bg-green-900/30', icon: Check },
                        pending: { color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30', icon: Clock },
                        not_started: { color: 'text-gray-400 bg-gray-50 dark:bg-gray-800/50', icon: X },
                      }
                      const cfg = statusConfig[step.status]
                      const StatusIcon = cfg.icon
                      return (
                        <div key={step.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-border-light)]/50 border border-[var(--color-border-light)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-brand" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{step.label}</p>
                              <p className={`text-xs capitalize ${cfg.color.split(' ')[0]}`}>{step.status.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <div className={`w-8 h-8 rounded-xl ${cfg.color} flex items-center justify-center`}>
                            <StatusIcon className="w-4 h-4" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </SettingsCard>
              )}

              {activeTab === 'blocked' && (
                <SettingsCard title="Blocked Users">
                  {blockedUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <Ban className="w-12 h-12 mx-auto text-[var(--color-text-secondary)] mb-3" />
                      <p className="text-[var(--color-text-secondary)] text-sm">No blocked users</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {blockedUsers.map((user) => (
                        <motion.div
                          key={user.id}
                          layout
                          exit={{ opacity: 0, x: 100 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-border-light)]/50 border border-[var(--color-border-light)]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-brand to-brand-dark flex items-center justify-center text-brand-navy text-sm font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{user.name}</p>
                              <p className="text-xs text-[var(--color-text-secondary)]">Blocked {user.blockedAt}</p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUnblock(user.id)}
                            className="px-4 py-2 text-xs font-medium text-brand border border-brand rounded-full hover:bg-brand/5 transition-all"
                          >
                            Unblock
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </SettingsCard>
              )}

              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants} className="bg-[var(--color-bg-card)] backdrop-blur-md rounded-2xl shadow p-6 sm:p-8 border border-[var(--color-border-light)] space-y-6">
                    <h2 className="text-lg font-bold text-red-600 flex items-center gap-2 font-serif">
                      <AlertTriangle className="w-5 h-5" />
                      Danger Zone
                    </h2>

                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">Deactivate Account</h3>
                      <p className="text-xs text-amber-700/70 dark:text-amber-300/70 mb-3">Your profile will be hidden. You can reactivate anytime by logging in.</p>
                      {deactivateConfirm ? (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSave('deactivate')}
                            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold"
                          >
                            {saving === 'deactivate' ? 'Processing...' : 'Confirm Deactivate'}
                          </motion.button>
                          <button onClick={() => setDeactivateConfirm(false)} className="px-4 py-2 text-xs text-[var(--color-text-secondary)]">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeactivateConfirm(true)} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold hover:bg-amber-600 transition-colors">
                          Deactivate Account
                        </button>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                      <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">Delete Account</h3>
                      <p className="text-xs text-red-700/70 dark:text-red-300/70 mb-3">This action is permanent and cannot be undone. All your data will be wiped.</p>
                      {deleteConfirm ? (
                        <div className="space-y-3">
                          <input
                            value={deleteText}
                            onChange={(e) => setDeleteText(e.target.value)}
                            placeholder='Type "DELETE" to confirm'
                            className="input-field w-full text-sm"
                          />
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              disabled={deleteText !== 'DELETE'}
                              onClick={() => handleSave('delete')}
                              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                            >
                              {saving === 'delete' ? 'Deleting...' : 'Permanently Delete'}
                            </motion.button>
                            <button onClick={() => { setDeleteConfirm(false); setDeleteText('') }} className="px-4 py-2 text-xs text-[var(--color-text-secondary)]">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(true)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors">
                          Delete Account
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
