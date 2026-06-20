'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, SlidersHorizontal, MapPin, Briefcase, GraduationCap, Heart, Users,
  ChevronLeft, ChevronRight, ArrowUpDown, Loader2, Filter, X, BadgeCheck, Star,
  Sparkles, RefreshCw,
} from 'lucide-react'
import { useShortlist } from '@/hooks/useShortlist'

interface ProfileResult {
  id: string
  name: string
  age: number
  gender: string
  location: string
  occupation: string
  education: string
  religion: string
  caste: string
  photo: string | null
  isVerified: boolean
  isPremium: boolean
  compatibilityScore: number
}

const MOCK_RESULTS: ProfileResult[] = Array.from({ length: 24 }, (_, i) => ({
  id: `profile-${i}`,
  name: ['Priya Sharma', 'Rahul Verma', 'Ananya Gupta', 'Aarav Patel', 'Neha Singh', 'Vikram Joshi'][i % 6],
  age: Math.floor(Math.random() * 15) + 22,
  gender: i % 2 === 0 ? 'Female' : 'Male',
  location: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad'][i % 6],
  occupation: ['Software Engineer', 'Doctor', 'Teacher', 'Banker', 'Business Owner', 'Lawyer'][i % 6],
  education: ["Bachelor's", "Master's", 'MBA', 'PhD', 'Diploma'][i % 5],
  religion: ['Hindu', 'Muslim', 'Christian', 'Sikh'][i % 4],
  caste: ['Brahmin', 'Kshatriya', 'Vaishya'][i % 3],
  photo: null,
  isVerified: i % 3 === 0,
  isPremium: i % 4 === 0,
  compatibilityScore: Math.floor(Math.random() * 40) + 60,
}))

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'age_asc', label: 'Age (Low to High)' },
  { value: 'age_desc', label: 'Age (High to Low)' },
  { value: 'compatibility', label: 'Compatibility' },
]

const ITEMS_PER_PAGE = 8

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

function SearchFiltersPanel({
  filters,
  onFilterChange,
  onApply,
  onClose,
}: {
  filters: Record<string, any>
  onFilterChange: (key: string, value: any) => void
  onApply: () => void
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-20 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-white/50 z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand" /> Filters
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-50 text-brand-navy/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Age Range</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={filters.ageMin}
                onChange={(e) => onFilterChange('ageMin', Number(e.target.value))}
                className="input-field w-full text-sm"
                placeholder="Min"
              />
              <span className="text-brand-navy/30">-</span>
              <input
                type="number"
                value={filters.ageMax}
                onChange={(e) => onFilterChange('ageMax', Number(e.target.value))}
                className="input-field w-full text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Gender</label>
            <div className="flex gap-2">
              {['MALE', 'FEMALE'].map((g) => (
                <button
                  key={g}
                  onClick={() => onFilterChange('gender', filters.gender === g ? '' : g)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    filters.gender === g
                      ? 'bg-brand-gradient text-white shadow-md'
                      : 'bg-gray-50/50 text-brand-navy/60'
                  }`}
                >
                  {g === 'MALE' ? 'Male' : 'Female'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Religion</label>
            <select
              value={filters.religion}
              onChange={(e) => onFilterChange('religion', e.target.value)}
              className="input-field w-full text-sm"
            >
              <option value="">Any Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
              <option value="Jain">Jain</option>
              <option value="Buddhist">Buddhist</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Caste</label>
            <input
              type="text"
              value={filters.caste}
              onChange={(e) => onFilterChange('caste', e.target.value)}
              className="input-field w-full text-sm"
              placeholder="e.g. Brahmin"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => onFilterChange('city', e.target.value)}
              className="input-field w-full text-sm"
              placeholder="e.g. Mumbai"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Education</label>
            <input
              type="text"
              value={filters.education}
              onChange={(e) => onFilterChange('education', e.target.value)}
              className="input-field w-full text-sm"
              placeholder="e.g. MBA"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Occupation</label>
            <input
              type="text"
              value={filters.occupation}
              onChange={(e) => onFilterChange('occupation', e.target.value)}
              className="input-field w-full text-sm"
              placeholder="e.g. Doctor"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy/70 mb-2 block">Diet</label>
            <select
              value={filters.diet}
              onChange={(e) => onFilterChange('diet', e.target.value)}
              className="input-field w-full text-sm"
            >
              <option value="">Any</option>
              <option value="VEGETARIAN">Vegetarian</option>
              <option value="NON_VEGETARIAN">Non-Vegetarian</option>
              <option value="EGGETARIAN">Eggetarian</option>
              <option value="VEGAN">Vegan</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50">
            <span className="text-sm font-medium text-brand-navy">Verified Only</span>
            <button
              onClick={() => onFilterChange('onlyVerified', !filters.onlyVerified)}
              className={`relative w-12 h-6 rounded-full transition-all ${filters.onlyVerified ? 'bg-brand-gradient' : 'bg-gray-200'}`}
            >
              <motion.div
                animate={{ x: filters.onlyVerified ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onApply}
          className="w-full mt-8 h-12 bg-brand-gradient text-white rounded-2xl font-semibold shadow-lg shadow-brand/25 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" /> Search
        </motion.button>
      </div>
    </motion.div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand rounded-full text-xs font-medium"
    >
      {label}
      <button onClick={onRemove} className="hover:bg-brand/20 rounded-full p-0.5">
        <X className="w-3 h-3" />
      </button>
    </motion.span>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 overflow-hidden">
          <div className="aspect-[4/3] bg-gray-50 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-50 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-50 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-gray-50 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-50 rounded animate-pulse w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SearchPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<ProfileResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, any>>({
    ageMin: 18, ageMax: 60, gender: '', religion: '', caste: '', city: '',
    education: '', occupation: '', diet: '', onlyVerified: false,
  })

  const { isShortlisted, toggleShortlist } = useShortlist()

  const handleApplyFilters = useCallback(async () => {
    setIsSearching(true)
    setHasSearched(true)
    await new Promise((r) => setTimeout(r, 1200))
    setResults(MOCK_RESULTS)
    setCurrentPage(1)
    setIsSearching(false)
  }, [])

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string }[] = []
    if (filters.gender) chips.push({ key: 'gender', label: filters.gender === 'MALE' ? 'Male' : 'Female' })
    if (filters.religion) chips.push({ key: 'religion', label: filters.religion })
    if (filters.caste) chips.push({ key: 'caste', label: `Caste: ${filters.caste}` })
    if (filters.city) chips.push({ key: 'city', label: filters.city })
    if (filters.education) chips.push({ key: 'education', label: `Edu: ${filters.education}` })
    if (filters.occupation) chips.push({ key: 'occupation', label: `Occ: ${filters.occupation}` })
    if (filters.diet) chips.push({ key: 'diet', label: `Diet: ${filters.diet}` })
    if (filters.onlyVerified) chips.push({ key: 'onlyVerified', label: 'Verified' })
    return chips
  }, [filters])

  const removeChip = useCallback((key: string) => {
    const resetValue: Record<string, any> = {
      gender: '', religion: '', caste: '', city: '', education: '',
      occupation: '', diet: '', onlyVerified: false,
    }
    setFilters((prev) => ({ ...prev, [key]: resetValue[key] ?? '' }))
  }, [])

  const sortedResults = useMemo(() => {
    const sorted = [...results]
    switch (sortBy) {
      case 'age_asc': return sorted.sort((a, b) => a.age - b.age)
      case 'age_desc': return sorted.sort((a, b) => b.age - a.age)
      case 'compatibility': return sorted.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      default: return sorted
    }
  }, [results, sortBy])

  const totalPages = Math.ceil(sortedResults.length / ITEMS_PER_PAGE)
  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
            <Search className="w-6 h-6 text-brand" />
            Search Profiles
          </h1>
          <p className="text-brand-navy/50 text-sm mt-1">
            Find your perfect match with advanced filters
          </p>
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-2 h-10 px-4 bg-white/80 backdrop-blur-md rounded-xl border border-white/50 text-brand-navy/60 hover:text-brand shadow-premium text-sm font-medium transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeChips.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-gradient text-white text-[10px] font-bold flex items-center justify-center">
              {activeChips.length}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <SearchFiltersPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onApply={() => { handleApplyFilters(); setFiltersOpen(false) }}
            onClose={() => setFiltersOpen(false)}
          />
        )}
      </AnimatePresence>

      {activeChips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 mb-4"
        >
          <span className="text-xs text-brand-navy/40 font-medium">Active Filters:</span>
          <AnimatePresence>
            {activeChips.map((chip) => (
              <FilterChip key={chip.key} label={chip.label} onRemove={() => removeChip(chip.key)} />
            ))}
          </AnimatePresence>
          <button
            onClick={() => setFilters({ ageMin: 18, ageMax: 60, gender: '', religion: '', caste: '', city: '', education: '', occupation: '', diet: '', onlyVerified: false })}
            className="text-xs text-brand hover:underline ml-1"
          >
            Clear all
          </button>
        </motion.div>
      )}

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-premium p-4 border border-white/50 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-navy/40" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, occupation, location..."
              className="input-field w-full pl-9 h-10 text-sm"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApplyFilters}
            disabled={isSearching}
            className="h-10 px-6 bg-brand-gradient rounded-xl text-white text-sm font-semibold shadow-lg shadow-brand/25 flex items-center gap-2 shrink-0"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isSearching ? 'Searching...' : 'Search'}
          </motion.button>
        </div>
      </div>

      {isSearching ? (
        <LoadingSkeleton />
      ) : !hasSearched ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-premium p-16 text-center border border-white/50"
        >
          <Users className="w-16 h-16 mx-auto text-brand-navy/20 mb-4" />
          <h3 className="text-lg font-bold text-brand-navy mb-2">Find Your Match</h3>
          <p className="text-sm text-brand-navy/50 max-w-md mx-auto">
            Use the filters to narrow down your search and find someone who shares your values, background, and interests.
          </p>
        </motion.div>
      ) : paginatedResults.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-premium p-16 text-center border border-white/50"
        >
          <Search className="w-16 h-16 mx-auto text-brand-navy/20 mb-4" />
          <h3 className="text-lg font-bold text-brand-navy mb-2">No Profiles Found</h3>
          <p className="text-sm text-brand-navy/50 max-w-md mx-auto mb-4">
            Try adjusting your filters or search criteria to find more matches.
          </p>
          <button
            onClick={() => setFilters({ ageMin: 18, ageMax: 60, gender: '', religion: '', caste: '', city: '', education: '', occupation: '', diet: '', onlyVerified: false })}
            className="px-6 py-2.5 bg-brand-gradient text-white rounded-full text-sm font-semibold shadow-lg shadow-brand/25"
          >
            <RefreshCw className="w-4 h-4 inline mr-1.5" /> Reset Filters
          </button>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-brand-navy/60">
              <span className="font-semibold text-brand-navy">{results.length}</span> profiles found
            </p>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-navy/40" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs border-none bg-transparent text-brand-navy/60 focus:outline-none cursor-pointer font-medium"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            <AnimatePresence mode="popLayout">
              {paginatedResults.map((profile) => (
                <motion.div
                  key={profile.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-premium border border-white/50 overflow-hidden group"
                >
                  <div className="aspect-[4/3] bg-brand-gradient flex items-center justify-center relative">
                    <span className="text-4xl text-white/60 font-bold">{profile.name.charAt(0)}</span>
                    {profile.isVerified && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-premium-verified/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                    {profile.isPremium && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-premium-gold/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> Premium
                      </span>
                    )}
                    <button
                      onClick={() => toggleShortlist(profile.id)}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-brand hover:text-white"
                    >
                      <Heart className={`w-4 h-4 ${isShortlisted(profile.id) ? 'fill-brand text-brand' : 'text-brand-navy/40'}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-brand-navy text-base">{profile.name}</h3>
                      {profile.compatibilityScore > 0 && (
                        <span className="text-xs text-premium-gold font-bold">{profile.compatibilityScore}%</span>
                      )}
                    </div>
                    <p className="text-xs text-brand-navy/50">{profile.age} yrs, {profile.gender}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-brand-navy/60">
                        <MapPin className="w-3 h-3 text-brand/60" /> {profile.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-brand-navy/60">
                        <Briefcase className="w-3 h-3 text-brand/60" /> {profile.occupation}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-brand-navy/60">
                        <GraduationCap className="w-3 h-3 text-brand/60" /> {profile.education}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 w-full h-9 bg-brand-gradient rounded-xl text-white text-xs font-semibold shadow-lg shadow-brand/25"
                    >
                      View Profile
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-50 text-brand-navy/50 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-brand-gradient text-white shadow-md'
                      : 'text-brand-navy/60 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-gray-50 text-brand-navy/50 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
