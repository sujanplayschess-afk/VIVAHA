'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  RotateCcw,
  Search,
  Filter,
} from 'lucide-react';

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'No Religion'];
const CASTES = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Other'];
const MOTHER_TONGUES = ['Hindi', 'English', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati', 'Punjabi', 'Odia', 'Urdu'];
const EDUCATION_LEVELS = ['High School', 'Diploma', "Bachelor's", "Master's", 'PhD', 'CA', 'CS', 'MBA', 'MD', 'Other'];
const INCOME_BRACKETS = ['Below ₹1 Lakh', '₹1-3 Lakhs', '₹3-5 Lakhs', '₹5-10 Lakhs', '₹10-20 Lakhs', 'Above ₹20 Lakhs'];
const STATES = ['Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'];
const OCCUPATIONS = ['Engineer', 'Doctor', 'Teacher', 'Software Developer', 'Banker', 'Business Owner', 'Lawyer', 'Civil Servant', 'Architect', 'Other'];

interface FilterValues {
  lookingFor: string;
  ageMin: number;
  ageMax: number;
  religion: string;
  caste: string;
  motherTongue: string;
  education: string;
  occupation: string;
  state: string;
  city: string;
  incomeMin: string;
  incomeMax: string;
}

interface SearchFiltersProps {
  onApply: (filters: FilterValues) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const defaultFilters: FilterValues = {
  lookingFor: '',
  ageMin: 18,
  ageMax: 60,
  religion: '',
  caste: '',
  motherTongue: '',
  education: '',
  occupation: '',
  state: '',
  city: '',
  incomeMin: '',
  incomeMax: '',
};

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onApply, isOpen, onToggle }) => {
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    community: false,
    career: false,
    location: false,
    income: false,
  });

  const updateFilter = (key: keyof FilterValues, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApply(filters);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '' && v !== 18 && v !== 60);

  const SelectField: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, options, onChange, placeholder }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-brand-navy/60 font-inter">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field w-full text-sm h-10"
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <button
        onClick={onToggle}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-12 h-12 bg-brand-gradient text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <Filter size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/30"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        layout
        className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-premium border border-white/50 overflow-hidden ${isOpen ? 'fixed inset-x-4 top-24 bottom-4 z-40 lg:static lg:inset-auto' : ''}`}
      >
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand" />
            <h3 className="font-poppins font-semibold text-brand-navy text-sm">Filters</h3>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-brand-navy/50 hover:text-red-500 transition-colors font-inter"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
            <button onClick={onToggle} className="lg:hidden text-brand-navy/50 hover:text-brand-navy">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100% - 120px)' }}>
          {/* Basic */}
          <div className="bg-gray-50/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('basic')}
              className="w-full flex items-center justify-between p-3 text-sm font-semibold text-brand-navy font-poppins"
            >
              Basic
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.basic ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedSections.basic && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3 space-y-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-brand-navy/60 font-inter mb-1.5">Looking for</label>
                    <div className="flex gap-2">
                      {['Male', 'Female'].map((g) => (
                        <button
                          key={g}
                          onClick={() => updateFilter('lookingFor', filters.lookingFor === g ? '' : g)}
                          className={`flex-1 h-9 rounded-xl text-xs font-medium border-2 transition-all ${
                            filters.lookingFor === g
                              ? 'border-brand bg-brand/5 text-brand'
                              : 'border-gray-200 text-brand-navy/50 hover:border-gray-300'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-navy/60 font-inter mb-1.5">
                      Age Range: {filters.ageMin} - {filters.ageMax}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={18}
                        max={60}
                        value={filters.ageMin}
                        onChange={(e) => {
                          const v = Math.min(Number(e.target.value), filters.ageMax - 1);
                          updateFilter('ageMin', v);
                        }}
                        className="w-full accent-brand"
                      />
                      <input
                        type="range"
                        min={18}
                        max={60}
                        value={filters.ageMax}
                        onChange={(e) => {
                          const v = Math.max(Number(e.target.value), filters.ageMin + 1);
                          updateFilter('ageMax', v);
                        }}
                        className="w-full accent-brand"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Community */}
          <div className="bg-gray-50/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('community')}
              className="w-full flex items-center justify-between p-3 text-sm font-semibold text-brand-navy font-poppins"
            >
              Community
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.community ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedSections.community && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3 space-y-3"
                >
                  <SelectField label="Religion" value={filters.religion} options={RELIGIONS} onChange={(v) => updateFilter('religion', v)} />
                  <SelectField label="Caste" value={filters.caste} options={CASTES} onChange={(v) => updateFilter('caste', v)} />
                  <SelectField label="Mother Tongue" value={filters.motherTongue} options={MOTHER_TONGUES} onChange={(v) => updateFilter('motherTongue', v)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Career */}
          <div className="bg-gray-50/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('career')}
              className="w-full flex items-center justify-between p-3 text-sm font-semibold text-brand-navy font-poppins"
            >
              Career & Education
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.career ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedSections.career && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3 space-y-3"
                >
                  <SelectField label="Education" value={filters.education} options={EDUCATION_LEVELS} onChange={(v) => updateFilter('education', v)} />
                  <SelectField label="Occupation" value={filters.occupation} options={OCCUPATIONS} onChange={(v) => updateFilter('occupation', v)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location */}
          <div className="bg-gray-50/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('location')}
              className="w-full flex items-center justify-between p-3 text-sm font-semibold text-brand-navy font-poppins"
            >
              Location
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.location ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedSections.location && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3 space-y-3"
                >
                  <SelectField label="State" value={filters.state} options={STATES} onChange={(v) => updateFilter('state', v)} />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-brand-navy/60 font-inter">City</label>
                    <input
                      value={filters.city}
                      onChange={(e) => updateFilter('city', e.target.value)}
                      placeholder="Enter city"
                      className="input-field w-full text-sm h-10"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Income */}
          <div className="bg-gray-50/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('income')}
              className="w-full flex items-center justify-between p-3 text-sm font-semibold text-brand-navy font-poppins"
            >
              Income Range
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.income ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedSections.income && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3 space-y-3"
                >
                  <SelectField label="Min Income" value={filters.incomeMin} options={INCOME_BRACKETS} placeholder="No min" onChange={(v) => updateFilter('incomeMin', v)} />
                  <SelectField label="Max Income" value={filters.incomeMax} options={INCOME_BRACKETS} placeholder="No max" onChange={(v) => updateFilter('incomeMax', v)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-4 border-t border-gray-50">
          <motion.button
            onClick={handleApply}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-11 bg-brand-gradient rounded-xl text-white font-semibold font-poppins text-sm shadow-lg shadow-brand/25 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Apply Filters
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};
