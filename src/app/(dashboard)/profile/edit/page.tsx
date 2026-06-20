'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import {
  Save, Loader2, ChevronDown, Eye, EyeOff, User, BookOpen, Briefcase,
  Heart, Shield, Camera, Upload, GripVertical, X, CheckCircle, Circle,
} from 'lucide-react'

type Tab = 'basic' | 'community' | 'education' | 'family' | 'lifestyle' | 'photos'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'basic', label: 'Basic Info', icon: User },
  { id: 'community', label: 'Community', icon: Shield },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'family', label: 'Family', icon: Heart },
  { id: 'lifestyle', label: 'Lifestyle', icon: Briefcase },
  { id: 'photos', label: 'Photos', icon: Camera },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const TOTAL_SECTIONS = 6

const COMPLETION_WEIGHTS: Record<string, number> = {
  name: 5, gender: 3, dob: 3, height: 2, religion: 5, caste: 3, education: 5,
  occupation: 5, organization: 3, annualIncome: 3, aboutMe: 5, diet: 3,
  partnerExpectation: 5, familyType: 3, aboutFamily: 3, languages: 3,
}

function CompletionScore({ form }: { form: Record<string, any> }) {
  const score = useMemo(() => {
    let earned = 0
    let total = 0
    for (const [key, weight] of Object.entries(COMPLETION_WEIGHTS)) {
      total += weight
      const val = form[key]
      if (typeof val === 'string' && val.trim().length > 0) earned += weight
      if (typeof val === 'boolean' && val) earned += weight
    }
    return Math.round((earned / total) * 100)
  }, [form])

  const getColor = () => {
    if (score >= 80) return 'text-premium-verified'
    if (score >= 50) return 'text-premium-gold'
    return 'text-brand'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow border border-white/50 p-6 mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-brand-navy">Profile Completion</h3>
          <p className="text-sm text-brand-navy/50 mt-1">Complete your profile to get better matches</p>
        </div>
        <div className="text-center">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f0f0f0" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                stroke="url(#grad)" strokeWidth="3" strokeDasharray={`${score}, 100`} />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${getColor()}`}>
              {score}%
            </span>
          </div>
          <svg width="0" height="0">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E91E76" />
                <stop offset="100%" stopColor="#1565C0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: TOTAL_SECTIONS }).map((_, i) => {
          const filled = i < Math.floor((score / 100) * TOTAL_SECTIONS)
          return (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${filled ? 'bg-brand-gradient' : 'bg-gray-50'}`} />
          )
        })}
      </div>
    </motion.div>
  )
}

export default function ProfileEditPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as Tab | null
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || 'basic')
  const [saving, setSaving] = useState(false)
  const [showIncome, setShowIncome] = useState(false)
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set())

  const [form, setForm] = useState({
    name: 'Rahul Sharma', gender: 'MALE', dob: '1995-06-15', height: '5\'10"', weight: '75',
    bodyType: 'AVERAGE', complexion: 'WHEATISH',
    religion: 'Hindu', caste: 'Brahmin', subCaste: 'Gaur', gothra: 'Bhardwaj',
    star: 'Uttara Phalguni', rashi: 'Simha', dosham: 'NO',
    languages: 'Hindi, English, Marathi',
    education: 'B.Tech in Computer Science', college: 'IIT Bombay', employedIn: 'PRIVATE',
    occupation: 'Software Engineer', organization: 'Google', annualIncome: '2500000', incomePrivate: false,
    familyType: 'NUCLEAR', familyStatus: 'UPPER_MIDDLE_CLASS', familyValues: 'MODERATE',
    father: 'Businessman', mother: 'Homemaker', siblings: '1 younger brother (Engineer)',
    aboutFamily: 'We are a close-knit family from Mumbai.',
    diet: 'VEGETARIAN', smoking: 'NO', drinking: 'OCCASIONALLY',
    aboutMe: 'I am a software professional working in Mumbai. Love traveling, cooking, and reading books.',
    partnerExpectation: 'Looking for a kind, educated and family-oriented person.',
  })

  const [photos, setPhotos] = useState<{ id: string; url: string; isPrimary: boolean }[]>([])

  const updateField = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSavedSections((prev) => new Set(prev).add(activeTab))
    setSaving(false)
  }

  const addPhoto = () => {
    const newPhoto = { id: `photo-${Date.now()}`, url: 'new', isPrimary: photos.length === 0 }
    setPhotos((prev) => [...prev, newPhoto])
  }

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const setPrimary = (id: string) => {
    setPhotos((prev) => prev.map((p) => ({ ...p, isPrimary: p.id === id })))
  }

  const renderSelect = (label: string, key: string, options: { value: string; label: string }[], required?: boolean) => (
    <div>
      <label className="block text-sm font-semibold text-brand-navy/70 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          value={form[key as keyof typeof form] as string}
          onChange={(e) => updateField(key, e.target.value)}
          className="input-field w-full appearance-none cursor-pointer"
        >
          <option value="">Select {label}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/40 pointer-events-none" />
      </div>
    </div>
  )

  const renderInput = (label: string, key: string, type = 'text', required?: boolean) => (
    <div>
      <label className="block text-sm font-semibold text-brand-navy/70 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={form[key as keyof typeof form] as string}
        onChange={(e) => updateField(key, e.target.value)}
        className="input-field w-full"
      />
    </div>
  )

  const renderTextarea = (label: string, key: string) => (
    <div>
      <label className="block text-sm font-semibold text-brand-navy/70 mb-1.5">{label}</label>
      <textarea
        value={form[key as keyof typeof form] as string}
        onChange={(e) => updateField(key, e.target.value)}
        rows={3}
        className="input-field w-full resize-none pt-3"
      />
    </div>
  )

  const renderSection = (title: string, children: React.ReactNode) => (
    <motion.div variants={sectionVariants} className="bg-white/80 backdrop-blur-md rounded-2xl shadow border border-white/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-brand-navy">{title}</h3>
          {savedSections.has(activeTab) && (
            <span className="text-[10px] text-premium-verified bg-green-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Saved
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-gradient text-white rounded-full font-bold shadow-lg shadow-brand/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save'}
        </motion.button>
      </div>
      <div className="space-y-5">{children}</div>
    </motion.div>
  )

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-3xl mx-auto pb-8">
      <motion.div variants={sectionVariants} className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Edit Profile</h1>
        <p className="text-brand-navy/60 text-sm mt-1">Complete your profile to get better matches.</p>
      </motion.div>

      <CompletionScore form={form} />

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-gradient text-white shadow-md'
                  : 'bg-white/80 backdrop-blur-md text-brand-navy/60 hover:text-brand border border-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {savedSections.has(tab.id) && <CheckCircle className="w-3 h-3 text-premium-verified" />}
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
        >
          {activeTab === 'basic' && renderSection('Basic Information',
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderInput('Full Name', 'name', 'text', true)}
              {renderSelect('Gender', 'gender', [
                { value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' },
              ], true)}
              {renderInput('Date of Birth', 'dob', 'date', true)}
              {renderInput('Height', 'height')}
              {renderInput('Weight (kg)', 'weight', 'number')}
              {renderSelect('Body Type', 'bodyType', [
                { value: 'SLIM', label: 'Slim' }, { value: 'AVERAGE', label: 'Average' },
                { value: 'ATHLETIC', label: 'Athletic' }, { value: 'HEAVY', label: 'Heavy' },
              ])}
              {renderSelect('Complexion', 'complexion', [
                { value: 'VERY_FAIR', label: 'Very Fair' }, { value: 'FAIR', label: 'Fair' },
                { value: 'WHEATISH', label: 'Wheatish' }, { value: 'DARK', label: 'Dark' },
              ])}
            </div>
          )}

          {activeTab === 'community' && renderSection('Community Details',
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderSelect('Religion', 'religion', [
                { value: 'Hindu', label: 'Hindu' }, { value: 'Muslim', label: 'Muslim' },
                { value: 'Christian', label: 'Christian' }, { value: 'Sikh', label: 'Sikh' },
                { value: 'Jain', label: 'Jain' }, { value: 'Buddhist', label: 'Buddhist' },
              ], true)}
              {renderInput('Caste', 'caste')}
              {renderInput('Sub Caste', 'subCaste')}
              {renderInput('Gothra', 'gothra')}
              {renderInput('Star (Nakshatra)', 'star')}
              {renderInput('Rashi', 'rashi')}
              {renderSelect('Dosham', 'dosham', [
                { value: 'YES', label: 'Yes' }, { value: 'NO', label: 'No' },
                { value: 'DONT_KNOW', label: "Don't Know" },
              ])}
              {renderInput('Languages', 'languages')}
            </div>
          )}

          {activeTab === 'education' && renderSection('Education & Career',
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderInput('Highest Education', 'education', 'text', true)}
              {renderInput('College / University', 'college')}
              {renderSelect('Employed In', 'employedIn', [
                { value: 'GOVERNMENT', label: 'Government' }, { value: 'PRIVATE', label: 'Private' },
                { value: 'BUSINESS', label: 'Business' }, { value: 'DEFENCE', label: 'Defence' },
                { value: 'SELF_EMPLOYED', label: 'Self Employed' }, { value: 'NOT_WORKING', label: 'Not Working' },
              ], true)}
              {renderInput('Occupation', 'occupation', 'text', true)}
              {renderInput('Organization', 'organization')}
              <div>
                <label className="block text-sm font-semibold text-brand-navy/70 mb-1.5">Annual Income</label>
                <div className="relative">
                  <input
                    type={showIncome ? 'text' : 'password'}
                    value={form.annualIncome}
                    onChange={(e) => updateField('annualIncome', e.target.value)}
                    className="input-field w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowIncome(!showIncome)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/40 hover:text-brand transition-colors"
                  >
                    {showIncome ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.incomePrivate}
                    onChange={(e) => updateField('incomePrivate', e.target.checked)}
                    className="rounded border-gray-50 text-brand focus:ring-brand"
                  />
                  <span className="text-xs text-brand-navy/50">Hide income from other users</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'family' && renderSection('Family Background',
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderSelect('Family Type', 'familyType', [
                { value: 'JOINT', label: 'Joint' }, { value: 'NUCLEAR', label: 'Nuclear' },
              ])}
              {renderSelect('Family Status', 'familyStatus', [
                { value: 'MIDDLE_CLASS', label: 'Middle Class' },
                { value: 'UPPER_MIDDLE_CLASS', label: 'Upper Middle Class' },
                { value: 'RICH', label: 'Rich' }, { value: 'AFFLUENT', label: 'Affluent' },
              ])}
              {renderSelect('Family Values', 'familyValues', [
                { value: 'ORTHODOX', label: 'Orthodox' }, { value: 'TRADITIONAL', label: 'Traditional' },
                { value: 'MODERATE', label: 'Moderate' }, { value: 'LIBERAL', label: 'Liberal' },
              ])}
              {renderInput("Father's Occupation", 'father')}
              {renderInput("Mother's Occupation", 'mother')}
              {renderInput('Siblings', 'siblings')}
              <div className="sm:col-span-2">{renderTextarea('About Family', 'aboutFamily')}</div>
            </div>
          )}

          {activeTab === 'lifestyle' && renderSection('Lifestyle & Preferences',
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderSelect('Diet', 'diet', [
                { value: 'VEGETARIAN', label: 'Vegetarian' }, { value: 'NON_VEGETARIAN', label: 'Non-Vegetarian' },
                { value: 'EGGETARIAN', label: 'Eggetarian' }, { value: 'VEGAN', label: 'Vegan' },
                { value: 'JAIN', label: 'Jain' },
              ])}
              {renderSelect('Smoking', 'smoking', [
                { value: 'NO', label: 'No' }, { value: 'YES', label: 'Yes' },
                { value: 'OCCASIONALLY', label: 'Occasionally' },
              ])}
              {renderSelect('Drinking', 'drinking', [
                { value: 'NO', label: 'No' }, { value: 'YES', label: 'Yes' },
                { value: 'OCCASIONALLY', label: 'Occasionally' }, { value: 'SOCIALLY', label: 'Socially' },
              ])}
              <div className="sm:col-span-2">{renderTextarea('About Me', 'aboutMe')}</div>
              <div className="sm:col-span-2">{renderTextarea('Partner Expectations', 'partnerExpectation')}</div>
            </div>
          )}

          {activeTab === 'photos' && (
            <motion.div variants={sectionVariants} className="bg-white/80 backdrop-blur-md rounded-2xl shadow border border-white/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-brand-navy">Photos</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-gradient text-white rounded-full font-bold shadow-lg shadow-brand/25 hover:scale-105 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </motion.button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-2xl bg-brand-gradient flex items-center justify-center group"
                  >
                    <span className="text-3xl text-white/40 font-bold">{photo.url.charAt(0)}</span>
                    {photo.isPrimary && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-premium-gold text-white text-[10px] font-bold rounded-full">
                        Primary
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-3">
                      <button
                        onClick={() => setPrimary(photo.id)}
                        className="p-2 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-all"
                        title="Set as primary"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="p-2 bg-red-500/80 rounded-xl text-white hover:bg-red-500 transition-all"
                        title="Remove"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="absolute top-2 right-2 p-1 cursor-grab text-white/40 hover:text-white">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addPhoto}
                  className="aspect-square rounded-2xl border-2 border-dashed border-brand/30 bg-brand/5 flex flex-col items-center justify-center gap-2 text-brand/60 hover:bg-brand/10 hover:text-brand transition-all"
                >
                  <Upload className="w-8 h-8" />
                  <span className="text-xs font-semibold">Add Photo</span>
                </motion.button>
              </div>

              <p className="text-xs text-brand-navy/40 mt-4 text-center">
                Drag to reorder. First photo will be your profile picture.
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {saving && (
        <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-brand border-t-transparent animate-spin" />
            <p className="text-lg font-semibold text-brand-navy">Saving your profile...</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
