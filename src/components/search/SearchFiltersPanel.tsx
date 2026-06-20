'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal, RotateCcw, Check, Search, ChevronDown, ChevronUp } from 'lucide-react'

interface SearchFilters {
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
  familyValues: string
  maritalStatus: string
  motherTongue: string
  hasPhoto: boolean
  isVerified: boolean
  isPremium: boolean
}

interface SearchFiltersPanelProps {
  isOpen: boolean
  onClose: () => void
  filters: SearchFilters
  onApply: (filters: SearchFilters) => void
  onReset: () => void
  resultsCount?: number
  activeFilterCount?: number
}

const dietOptions = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain']
const smokingOptions = ['Never', 'Occasionally', 'Regularly']
const drinkingOptions = ['Never', 'Occasionally', 'Regularly']
const maritalOptions = ['Never Married', 'Divorced', 'Widowed', 'Separated']
const familyOptions = ['Traditional', 'Moderate', 'Liberal', 'Progressive']

interface FilterSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-6 text-left"
      >
        <span className="text-sm font-bold text-brand-navy">{title}</span>
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
            <div className="px-6 pb-4 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ChipSelect: React.FC<{
  options: string[]
  value: string
  onChange: (value: string) => void
}> = ({ options, value, onChange }) => (
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

export const SearchFiltersPanel: React.FC<SearchFiltersPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
  resultsCount = 0,
  activeFilterCount = 0,
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onApply(localFilters)
    onClose()
  }

  const handleReset = () => {
    setLocalFilters({
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
      familyValues: '',
      maritalStatus: '',
      motherTongue: '',
      hasPhoto: false,
      isVerified: false,
      isPremium: false,
    })
    onReset()
  }

  const appliedChips: { label: string; onRemove: () => void }[] = []
  if (localFilters.ageRange[0] > 18 || localFilters.ageRange[1] < 60) {
    appliedChips.push({
      label: `Age: ${localFilters.ageRange[0]}-${localFilters.ageRange[1]}`,
      onRemove: () => updateFilter('ageRange', [18, 60]),
    })
  }
  if (localFilters.community) appliedChips.push({ label: localFilters.community, onRemove: () => updateFilter('community', '') })
  if (localFilters.religion) appliedChips.push({ label: localFilters.religion, onRemove: () => updateFilter('religion', '') })
  if (localFilters.education) appliedChips.push({ label: localFilters.education, onRemove: () => updateFilter('education', '') })
  if (localFilters.occupation) appliedChips.push({ label: localFilters.occupation, onRemove: () => updateFilter('occupation', '') })
  if (localFilters.city) appliedChips.push({ label: localFilters.city, onRemove: () => updateFilter('city', '') })
  if (localFilters.diet) appliedChips.push({ label: localFilters.diet, onRemove: () => updateFilter('diet', '') })
  if (localFilters.maritalStatus) appliedChips.push({ label: localFilters.maritalStatus, onRemove: () => updateFilter('maritalStatus', '') })

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
                <h2 className="text-lg font-bold text-brand-navy">Search Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-brand/10 text-brand text-[10px] font-bold rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <X size={16} className="text-brand-navy/60" />
              </button>
            </div>

            {appliedChips.length > 0 && (
              <div className="px-6 py-3 border-b border-white/20 flex flex-wrap gap-2">
                {appliedChips.map((chip, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-brand/5 text-brand text-[11px] font-medium rounded-full flex items-center gap-1.5 border border-brand/20"
                  >
                    {chip.label}
                    <button onClick={chip.onRemove} className="hover:bg-brand/10 rounded-full p-0.5">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <FilterSection title="Basic">
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Age Range</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={18}
                      max={80}
                      value={localFilters.ageRange[0]}
                      onChange={e => updateFilter('ageRange', [parseInt(e.target.value) || 18, localFilters.ageRange[1]])}
                      className="input-field w-full text-sm"
                    />
                    <span className="text-brand-navy/30">to</span>
                    <input
                      type="number"
                      min={18}
                      max={80}
                      value={localFilters.ageRange[1]}
                      onChange={e => updateFilter('ageRange', [localFilters.ageRange[0], parseInt(e.target.value) || 60])}
                      className="input-field w-full text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Height (cm)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={100}
                      max={250}
                      value={localFilters.heightRange[0]}
                      onChange={e => updateFilter('heightRange', [parseInt(e.target.value) || 140, localFilters.heightRange[1]])}
                      className="input-field w-full text-sm"
                    />
                    <span className="text-brand-navy/30">to</span>
                    <input
                      type="number"
                      min={100}
                      max={250}
                      value={localFilters.heightRange[1]}
                      onChange={e => updateFilter('heightRange', [localFilters.heightRange[0], parseInt(e.target.value) || 220])}
                      className="input-field w-full text-sm"
                    />
                  </div>
                </div>
              </FilterSection>

              <FilterSection title="Community & Religion">
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Community</label>
                  <input
                    type="text"
                    placeholder="e.g. Brahmin, Nair..."
                    value={localFilters.community}
                    onChange={e => updateFilter('community', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Sub-Community</label>
                  <input
                    type="text"
                    placeholder="e.g. Iyer, Menon..."
                    value={localFilters.subCommunity}
                    onChange={e => updateFilter('subCommunity', e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Mother Tongue</label>
                  <input
                    type="text"
                    placeholder="e.g. Hindi, Tamil..."
                    value={localFilters.motherTongue}
                    onChange={e => updateFilter('motherTongue', e.target.value)}
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

              <FilterSection title="Education & Career">
                <div>
                  <label className="text-xs text-brand-navy/60 mb-1 block">Education</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MBA, B.Tech..."
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

              <FilterSection title="Location">
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

              <FilterSection title="Lifestyle">
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
                <div>
                  <label className="text-xs text-brand-navy/60 mb-2 block">Family Values</label>
                  <ChipSelect options={familyOptions} value={localFilters.familyValues} onChange={v => updateFilter('familyValues', v)} />
                </div>
              </FilterSection>

              <FilterSection title="Status">
                <div>
                  <label className="text-xs text-brand-navy/60 mb-2 block">Marital Status</label>
                  <ChipSelect options={maritalOptions} value={localFilters.maritalStatus} onChange={v => updateFilter('maritalStatus', v)} />
                </div>
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.hasPhoto}
                      onChange={e => updateFilter('hasPhoto', e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 text-brand accent-brand"
                    />
                    <span className="text-sm text-brand-navy/70">Has Photo</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.isVerified}
                      onChange={e => updateFilter('isVerified', e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 text-brand accent-brand"
                    />
                    <span className="text-sm text-brand-navy/70">Verified Only</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.isPremium}
                      onChange={e => updateFilter('isPremium', e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 text-brand accent-brand"
                    />
                    <span className="text-sm text-brand-navy/70">Premium Members</span>
                  </label>
                </div>
              </FilterSection>
            </div>

            <div className="px-6 py-4 border-t border-white/20 space-y-3">
              {resultsCount > 0 && (
                <div className="text-center text-xs text-brand-navy/50">
                  <span className="font-bold text-brand-navy">{resultsCount}</span> profiles match your criteria
                </div>
              )}
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-full border border-white/30 text-brand-navy/60 text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/50 transition-colors"
                >
                  <RotateCcw size={14} /> Clear All
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleApply}
                  className="flex-1 py-3 rounded-full bg-brand-gradient text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Check size={14} /> Apply
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
