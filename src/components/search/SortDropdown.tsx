'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react'

export type SortOption = 'newest' | 'oldest' | 'compatibility' | 'views' | 'active'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const options: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'compatibility', label: 'Highest Compatibility' },
  { value: 'views', label: 'Most Views' },
  { value: 'active', label: 'Recently Active' },
]

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find(o => o.value === value)?.label || 'Sort'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-sm text-sm font-medium text-brand-navy/70 hover:text-brand-navy transition-colors"
      >
        <ArrowUpDown size={14} />
        <span>{selectedLabel}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-brand-navy/40" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-50"
          >
            <div className="py-1">
              {options.map(option => {
                const isSelected = value === option.value
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? 'text-brand font-bold bg-brand/5'
                        : 'text-brand-navy/70 hover:bg-brand-bg/50 hover:text-brand-navy'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      >
                        <Check size={14} className="text-brand" />
                      </motion.span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
