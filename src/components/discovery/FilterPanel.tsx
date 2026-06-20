'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronUp, SlidersHorizontal, RotateCcw, Check, Search } from 'lucide-react'

export interface DiscoveryFilters {
  ageRange: [number, number]
  heightRange: [number, number]
  community: string
  subCommunity: string
  education: string
  occupation: string
  organization: string
  country: string
  state: string
  city: string
  religion: string
  caste: string
  diet: string
  smoking: string
  drinking: string
  familyType: string
  maritalStatus: string
}

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  filters: DiscoveryFilters
  onApply: (filters: DiscoveryFilters) => void
  onReset: () => void
}

const defaultFilters: DiscoveryFilters = {
  ageRange: [18, 60],
  heightRange: [140, 220],
  community: '',
  subCommunity: '',
  education: '',
  occupation: '',
  organization: '',
  country: '',
  state: '',
  city: '',
  religion: '',
  caste: '',
  diet: '',
  smoking: '',
  drinking: '',
  familyType: '',
  maritalStatus: '',
}

const dietOptions = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain']
const smokingOptions = ['Never', 'Occasionally', 'Regularly']
const drinkingOptions = ['Never', 'Occasionally', 'Regularly']
const maritalOptions = ['Never Married', 'Divorced', 'Widowed', 'Separated']
const familyOptions = ['Joint', 'Nuclear', 'Living with Parents', 'Alone']

interface SectionProps {
  title: string
  icon: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}

const FilterSection: React.FC<SectionProps> = ({ title, icon, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-6 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-brand-navy/50">{icon}</span>
          <span className="text-sm font-bold text-brand-navy">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-brand-navy/40" /> : <ChevronDown size={16} className="text-brand-navy/40" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const RangeSlider: React.FC<{
  label: string
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  suffix?: string
}> = ({ label, min, max, value, onChange, suffix = '' }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-brand-navy/60">{label}</span>
        <span className="text-xs font-bold text-brand-navy">
          {value[0]}{suffix} - {value[1]}{suffix}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={e => {
            const v = parseInt(e.target.value)
            if (v <= value[1]) onChange([v, value[1]])
          }}
          className="input-field flex-1 h-1.5 appearance-none bg-gray-50 rounded-full accent-brand"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={e => {
            const v = parseInt(e.target.value)
            if (v >= value[0]) onChange([value[0], v])
          }}
          className="input-field flex-1 h-1.5 appearance-none bg-gray-50 rounded-full accent-brand"
        />
      </div>
    </div>
  )
}

const ChipSelect: React.FC<{
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}> = ({ options, value, onChange, placeholder = 'Select' }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(value === opt ? '' : opt)}
        className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all border ${
          value === opt
            ? 'bg-brand text-white border-brand shadow-md'
            : 'bg-white/50 text-brand-navy/60 border-white/30 hover:border-brand/30'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
)

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<DiscoveryFilters>(filters)
  const [searchQuery, setSearchQuery] = useState('')

  const updateFilter = <K extends keyof DiscoveryFilters>(key: K, value: DiscoveryFilters[K]) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onApply(localFilters)
    onClose()
  }

  const handleReset = () => {
    setLocalFilters(defaultFilters)
    onReset()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[101] bg-white/90 backdrop-blur-2xl border-l border-white/20 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/20">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-brand" />
                <h2 className="text-lg font-bold text-brand-navy">Filters</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 flex items-center justify-center"
              >
                <X size={16} className="text-brand-navy/60" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-white/20">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                <input
                  type="text"
                  placeholder="Search filters..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-field w-full pl-9 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <FilterSection title="Basic" icon={<SlidersHorizontal size={14} />}>
                <RangeSlider
                  label="Age Range"
                  min={18}
                  max={80}
                  value={localFilters.ageRange}
                  onChange={v => updateFilter('ageRange', v)}
                  suffix=" yrs"
                />
                <RangeSlider
                  label="Height Range"
                  min={100}
                  max={250}
                  value={localFilters.heightRange}
                  onChange={v => updateFilter('heightRange', v)}
                  suffix=" cm"
                />
              </FilterSection>

              <FilterSection title="Community" icon={<Search size={14} />}>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Community</label>
                  <input
                    type="text"
                    placeholder="e.g. Brahmin, Kshatriya..."
                    value={localFilters.community}
                    onChange={e => updateFilter('community', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Sub-Community</label>
                  <input
                    type="text"
                    placeholder="e.g. Iyer, Nair..."
                    value={localFilters.subCommunity}
                    onChange={e => updateFilter('subCommunity', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Religion</label>
                  <input
                    type="text"
                    placeholder="e.g. Hindu, Muslim..."
                    value={localFilters.religion}
                    onChange={e => updateFilter('religion', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Caste</label>
                  <input
                    type="text"
                    placeholder="e.g. General, OBC..."
                    value={localFilters.caste}
                    onChange={e => updateFilter('caste', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
              </FilterSection>

              <FilterSection title="Education & Career" icon={<Search size={14} />}>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Education</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MBA..."
                    value={localFilters.education}
                    onChange={e => updateFilter('education', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Doctor, Engineer..."
                    value={localFilters.occupation}
                    onChange={e => updateFilter('occupation', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Microsoft..."
                    value={localFilters.organization}
                    onChange={e => updateFilter('organization', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
              </FilterSection>

              <FilterSection title="Location" icon={<Search size={14} />}>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Country</label>
                  <input
                    type="text"
                    placeholder="e.g. India"
                    value={localFilters.country}
                    onChange={e => updateFilter('country', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={localFilters.state}
                    onChange={e => updateFilter('state', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={localFilters.city}
                    onChange={e => updateFilter('city', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
              </FilterSection>

              <FilterSection title="Lifestyle" icon={<Search size={14} />}>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-2 block">Diet</label>
                  <ChipSelect options={dietOptions} value={localFilters.diet} onChange={v => updateFilter('diet', v)} />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-2 block">Smoking</label>
                  <ChipSelect options={smokingOptions} value={localFilters.smoking} onChange={v => updateFilter('smoking', v)} />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-2 block">Drinking</label>
                  <ChipSelect options={drinkingOptions} value={localFilters.drinking} onChange={v => updateFilter('drinking', v)} />
                </div>
              </FilterSection>

              <FilterSection title="Family & Status" icon={<Search size={14} />}>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-2 block">Family Type</label>
                  <ChipSelect options={familyOptions} value={localFilters.familyType} onChange={v => updateFilter('familyType', v)} />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-2 block">Marital Status</label>
                  <ChipSelect options={maritalOptions} value={localFilters.maritalStatus} onChange={v => updateFilter('maritalStatus', v)} />
                </div>
              </FilterSection>
            </div>

            <div className="px-6 py-4 border-t border-white/20 flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                className="flex-1 py-3 rounded-full border border-white/30 text-brand-navy/60 text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/50 transition-colors"
              >
                <RotateCcw size={14} /> Reset
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleApply}
                className="flex-1 py-3 rounded-full bg-brand-gradient text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Check size={14} /> Apply
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
