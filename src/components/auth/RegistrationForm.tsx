'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Upload, X, Star, Eye, EyeOff,
  User, Users, GraduationCap, Heart,
  Image as ImageIcon, ArrowRight, ArrowLeft, Loader2,
} from 'lucide-react';
import { useRegistrationStore } from '@/stores/registration-store';

const stepVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const steps = [
  { label: 'Basic Details', icon: User },
  { label: 'Community', icon: Users },
  { label: 'Education & Career', icon: GraduationCap },
  { label: 'Family Details', icon: Heart },
  { label: 'Photos', icon: ImageIcon },
];

const RELIGIONS = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'No Religion',
];
const MOTHER_TONGUES = [
  'Hindi', 'English', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
  'Gujarati', 'Punjabi', 'Odia', 'Urdu', 'Assamese', 'Sanskrit',
];
const EDUCATION_LEVELS = [
  'High School', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD', 'CA', 'CS', 'MBA', 'MD', 'Other',
];
const EMPLOYMENT_SECTORS = [
  'Government', 'Private', 'Business', 'Defence', 'Self Employed', 'Not Working',
];
const INCOME_BRACKETS = [
  'Below ₹1 Lakh', '₹1-3 Lakhs', '₹3-5 Lakhs', '₹5-10 Lakhs', '₹10-20 Lakhs', 'Above ₹20 Lakhs',
];
const FAMILY_TYPES = ['Joint', 'Nuclear'];
const FAMILY_STATUSES = ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'];
const FAMILY_VALUES = ['Orthodox', 'Traditional', 'Moderate', 'Liberal'];
const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain'];
const SMOKING_OPTIONS = ['No', 'Yes', 'Occasionally'];
const DRINKING_OPTIONS = ['No', 'Yes', 'Occasionally', 'Socially'];

const validateStep = (step: number, data: any): Record<string, string> => {
  const errors: Record<string, string> = {};
  switch (step) {
    case 1:
      if (!data.firstName) errors.firstName = 'First name is required';
      if (!data.gender) errors.gender = 'Gender is required';
      if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
      if (!data.phone || data.phone.length < 10) errors.phone = 'Valid phone is required';
      if (!data.email) errors.email = 'Email is required';
      if (!data.password || data.password.length < 6) errors.password = 'Password must be at least 6 characters';
      break;
    case 2:
      if (!data.religion) errors.religion = 'Religion is required';
      if (!data.motherTongue) errors.motherTongue = 'Mother tongue is required';
      if (!data.caste) errors.caste = 'Caste is required';
      break;
    case 3:
      if (!data.education) errors.education = 'Education is required';
      if (!data.employmentSector) errors.employmentSector = 'Employment sector is required';
      if (!data.state) errors.state = 'State is required';
      if (!data.city) errors.city = 'City is required';
      break;
    case 4:
      if (!data.familyType) errors.familyType = 'Family type is required';
      if (!data.familyStatus) errors.familyStatus = 'Family status is required';
      if (!data.diet) errors.diet = 'Diet preference is required';
      break;
  }
  return errors;
};

const PasswordStrength: React.FC<{ value: string }> = ({ value }) => {
  const getStrength = (pw: string): { label: string; color: string; width: string } => {
    if (!pw) return { label: '', color: '', width: '0%' };
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    if (pw.length < 6) return { label: 'Weak', color: 'bg-red-400', width: '25%' };
    if (score <= 1) return { label: 'Weak', color: 'bg-red-400', width: '25%' };
    if (score === 2) return { label: 'Fair', color: 'bg-orange-400', width: '50%' };
    if (score === 3) return { label: 'Good', color: 'bg-yellow-400', width: '75%' };
    return { label: 'Strong', color: 'bg-green-400', width: '100%' };
  };

  const strength = getStrength(value);
  if (!value) return null;

  return (
    <div className="mt-2">
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${strength.color}`}
          initial={{ width: '0%' }}
          animate={{ width: strength.width }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="text-xs text-brand-navy/50 mt-1 font-inter">{strength.label}</p>
    </div>
  );
};

export const RegistrationForm: React.FC = () => {
  const { step, data, isSubmitting, errors: storeErrors, setStep, updateData, setSubmitting, setErrors } =
    useRegistrationStore();
  const [showPassword, setShowPassword] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const currentErrors = validateStep(step, data);

  const handleNext = () => {
    const errs = validateStep(step, data);
    setErrors(errs);
    if (Object.keys(errs).length === 0 && step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    const errs = validateStep(step, data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          phone: data.phone,
          email: data.email,
          password: data.password,
          religion: data.religion,
          motherTongue: data.motherTongue,
          caste: data.caste,
          education: data.education,
          occupation: data.occupation,
          state: data.state,
          city: data.city,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.fieldErrors || { form: json.error || 'Registration failed' });
        return;
      }
      window.location.href = '/dashboard';
    } catch {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          newPhotos.push(URL.createObjectURL(file));
        }
      });
      updateData({ photos: [...data.photos, ...newPhotos] });
    },
    [data.photos, updateData]
  );

  const removePhoto = (index: number) => {
    const updated = data.photos.filter((_, i) => i !== index);
    updateData({
      photos: updated,
      primaryPhotoIndex: data.primaryPhotoIndex >= updated.length ? 0 : data.primaryPhotoIndex,
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">First Name</label>
                <input
                  value={data.firstName}
                  onChange={(e) => updateData({ firstName: e.target.value })}
                  placeholder="First Name"
                  className={`input-field w-full ${storeErrors.firstName || currentErrors.firstName ? 'border-red-400' : ''}`}
                />
                {(storeErrors.firstName || currentErrors.firstName) && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.firstName || currentErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Last Name</label>
                <input
                  value={data.lastName}
                  onChange={(e) => updateData({ lastName: e.target.value })}
                  placeholder="Last Name"
                  className="input-field w-full"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-2">Gender</label>
              <div className="flex gap-4">
                {(['MALE', 'FEMALE'] as const).map((g) => (
                  <label
                    key={g}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 cursor-pointer transition-all ${
                      data.gender === g
                        ? 'border-brand bg-brand/5 text-brand'
                        : 'border-gray-200 text-brand-navy/50 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={data.gender === g}
                      onChange={() => updateData({ gender: g })}
                      className="sr-only"
                    />
                    {g === 'MALE' ? '♂ Male' : '♀ Female'}
                  </label>
                ))}
              </div>
              {(storeErrors.gender || currentErrors.gender) && (
                <p className="text-red-500 text-xs mt-1">{storeErrors.gender || currentErrors.gender}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => updateData({ dateOfBirth: e.target.value })}
                className={`input-field w-full ${storeErrors.dateOfBirth || currentErrors.dateOfBirth ? 'border-red-400' : ''}`}
              />
              {(storeErrors.dateOfBirth || currentErrors.dateOfBirth) && (
                <p className="text-red-500 text-xs mt-1">{storeErrors.dateOfBirth || currentErrors.dateOfBirth}</p>
              )}
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Phone</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={data.phone}
                  onChange={(e) => updateData({ phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="9876543210"
                  className={`input-field w-full ${storeErrors.phone || currentErrors.phone ? 'border-red-400' : ''}`}
                />
                {(storeErrors.phone || currentErrors.phone) && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.phone || currentErrors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateData({ email: e.target.value })}
                  placeholder="you@example.com"
                  className={`input-field w-full ${storeErrors.email || currentErrors.email ? 'border-red-400' : ''}`}
                />
                {(storeErrors.email || currentErrors.email) && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.email || currentErrors.email}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => updateData({ password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className={`input-field w-full pr-10 ${storeErrors.password || currentErrors.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/40 hover:text-brand-navy/70"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {(storeErrors.password || currentErrors.password) && (
                <p className="text-red-500 text-xs mt-1">{storeErrors.password || currentErrors.password}</p>
              )}
              <PasswordStrength value={data.password} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Religion</label>
              <select
                value={data.religion}
                onChange={(e) => updateData({ religion: e.target.value })}
                className={`input-field w-full ${storeErrors.religion || currentErrors.religion ? 'border-red-400' : ''}`}
              >
                <option value="">Select Religion</option>
                {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {(storeErrors.religion || currentErrors.religion) && (
                <p className="text-red-500 text-xs mt-1">{storeErrors.religion || currentErrors.religion}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Caste</label>
                <input
                  value={data.caste}
                  onChange={(e) => updateData({ caste: e.target.value })}
                  placeholder="Caste"
                  className={`input-field w-full ${storeErrors.caste || currentErrors.caste ? 'border-red-400' : ''}`}
                />
                {(storeErrors.caste || currentErrors.caste) && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.caste || currentErrors.caste}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Sub-Caste (optional)</label>
                <input
                  value={data.subCaste}
                  onChange={(e) => updateData({ subCaste: e.target.value })}
                  placeholder="Sub-caste"
                  className="input-field w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Mother Tongue</label>
              <select
                value={data.motherTongue}
                onChange={(e) => updateData({ motherTongue: e.target.value })}
                className={`input-field w-full ${storeErrors.motherTongue || currentErrors.motherTongue ? 'border-red-400' : ''}`}
              >
                <option value="">Select Mother Tongue</option>
                {MOTHER_TONGUES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {(storeErrors.motherTongue || currentErrors.motherTongue) && (
                <p className="text-red-500 text-xs mt-1">{storeErrors.motherTongue || currentErrors.motherTongue}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Gothra (optional)</label>
              <input
                value={data.gothra}
                onChange={(e) => updateData({ gothra: e.target.value })}
                placeholder="Gothra"
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Languages Known</label>
              <div className="flex flex-wrap gap-2">
                {['Hindi', 'English', 'Other'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      const updated = data.languages.includes(lang)
                        ? data.languages.filter((l) => l !== lang)
                        : [...data.languages, lang];
                      updateData({ languages: updated });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                      data.languages.includes(lang)
                        ? 'bg-brand/10 border-brand text-brand'
                        : 'bg-white border-gray-200 text-brand-navy/60 hover:border-gray-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Education</label>
                <select
                  value={data.education}
                  onChange={(e) => updateData({ education: e.target.value })}
                  className={`input-field w-full ${storeErrors.education || currentErrors.education ? 'border-red-400' : ''}`}
                >
                  <option value="">Select Education</option>
                  {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
                {(storeErrors.education || currentErrors.education) && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.education || currentErrors.education}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">College (optional)</label>
                <input
                  value={data.college}
                  onChange={(e) => updateData({ college: e.target.value })}
                  placeholder="College name"
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Employment Sector</label>
                <select
                  value={data.employmentSector}
                  onChange={(e) => updateData({ employmentSector: e.target.value })}
                  className={`input-field w-full ${storeErrors.employmentSector || currentErrors.employmentSector ? 'border-red-400' : ''}`}
                >
                  <option value="">Select Sector</option>
                  {EMPLOYMENT_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {(storeErrors.employmentSector || currentErrors.employmentSector) && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.employmentSector || currentErrors.employmentSector}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Occupation</label>
                <input
                  value={data.occupation}
                  onChange={(e) => updateData({ occupation: e.target.value })}
                  placeholder="Occupation"
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Organization (optional)</label>
                <input
                  value={data.organization}
                  onChange={(e) => updateData({ organization: e.target.value })}
                  placeholder="Company / Org"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Annual Income</label>
                <select
                  value={data.annualIncome}
                  onChange={(e) => updateData({ annualIncome: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">Select Income</option>
                  {INCOME_BRACKETS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">State</label>
                <select
                  value={data.state}
                  onChange={(e) => updateData({ state: e.target.value })}
                  className={`input-field w-full ${storeErrors.state || currentErrors.state ? 'border-red-400' : ''}`}
                >
                  <option value="">Select State</option>
                  {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {(storeErrors.state || currentErrors.state) && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.state || currentErrors.state}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">City</label>
                <select
                  value={data.city}
                  onChange={(e) => updateData({ city: e.target.value })}
                  className={`input-field w-full ${storeErrors.city || currentErrors.city ? 'border-red-400' : ''}`}
                >
                  <option value="">Select City</option>
                  {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Ahmedabad'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {(storeErrors.city || currentErrors.city) && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.city || currentErrors.city}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Family Type</label>
                <div className="flex gap-2">
                  {FAMILY_TYPES.map((ft) => (
                    <button
                      key={ft}
                      type="button"
                      onClick={() => updateData({ familyType: ft })}
                      className={`flex-1 h-10 rounded-xl text-sm font-medium border-2 transition-all ${
                        data.familyType === ft
                          ? 'border-brand bg-brand/5 text-brand'
                          : 'border-gray-200 text-brand-navy/50 hover:border-gray-300'
                      }`}
                    >
                      {ft}
                    </button>
                  ))}
                </div>
                {(storeErrors.familyType || currentErrors.familyType) && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.familyType || currentErrors.familyType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Status</label>
                <select
                  value={data.familyStatus}
                  onChange={(e) => updateData({ familyStatus: e.target.value })}
                  className={`input-field w-full ${storeErrors.familyStatus || currentErrors.familyStatus ? 'border-red-400' : ''}`}
                >
                  <option value="">Select</option>
                  {FAMILY_STATUSES.map((fs) => <option key={fs} value={fs}>{fs}</option>)}
                </select>
                {(storeErrors.familyStatus || currentErrors.familyStatus) && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.familyStatus || currentErrors.familyStatus}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Values</label>
                <select
                  value={data.familyValues}
                  onChange={(e) => updateData({ familyValues: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">Select</option>
                  {FAMILY_VALUES.map((fv) => <option key={fv} value={fv}>{fv}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Father's Name</label>
                <input
                  value={data.fatherName}
                  onChange={(e) => updateData({ fatherName: e.target.value })}
                  placeholder="Father's name"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Father's Occupation</label>
                <input
                  value={data.fatherOccupation}
                  onChange={(e) => updateData({ fatherOccupation: e.target.value })}
                  placeholder="Occupation"
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Mother's Name</label>
                <input
                  value={data.motherName}
                  onChange={(e) => updateData({ motherName: e.target.value })}
                  placeholder="Mother's name"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Mother's Occupation</label>
                <input
                  value={data.motherOccupation}
                  onChange={(e) => updateData({ motherOccupation: e.target.value })}
                  placeholder="Occupation"
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Brothers</label>
                <input
                  type="number"
                  min={0}
                  value={data.brothers}
                  onChange={(e) => updateData({ brothers: parseInt(e.target.value) || 0 })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">Sisters</label>
                <input
                  type="number"
                  min={0}
                  value={data.sisters}
                  onChange={(e) => updateData({ sisters: parseInt(e.target.value) || 0 })}
                  className="input-field w-full"
                />
              </div>
            </div>

            {/* Lifestyle Toggles */}
            <div className="space-y-3">
              {([
                { label: 'Diet', key: 'diet', options: DIET_OPTIONS },
                { label: 'Smoking', key: 'smoking', options: SMOKING_OPTIONS },
                { label: 'Drinking', key: 'drinking', options: DRINKING_OPTIONS },
              ] as const).map(({ label, key, options }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">{label}</label>
                  <div className="flex flex-wrap gap-2">
                    {options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateData({ [key]: opt } as any)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                          data[key as keyof typeof data] === opt
                            ? 'bg-brand/10 border-brand text-brand'
                            : 'bg-white border-gray-200 text-brand-navy/50 hover:border-gray-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* About Me */}
            <div>
              <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">About Me</label>
              <textarea
                value={data.aboutMe}
                onChange={(e) => updateData({ aboutMe: e.target.value })}
                placeholder="Tell us about yourself, your family, and what you're looking for..."
                rows={4}
                className="input-field w-full resize-none"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-brand bg-brand/5'
                  : 'border-gray-200 hover:border-brand/50 hover:bg-brand-bg'
              }`}
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-brand/60 mb-3" />
              <p className="text-brand-navy font-poppins font-medium mb-1">Drop your photos here</p>
              <p className="text-brand-navy/50 text-sm font-inter">or click to browse</p>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>

            {/* Photo Previews */}
            {data.photos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-brand-navy/70 font-inter mb-3">
                  Uploaded Photos ({data.photos.length})
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {data.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className={`w-full h-24 sm:h-28 object-cover rounded-xl border-2 transition-all ${
                          data.primaryPhotoIndex === index
                            ? 'border-brand shadow-md'
                            : 'border-gray-200'
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                          className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateData({ primaryPhotoIndex: index })}
                        className={`absolute top-1.5 right-1.5 p-1 rounded-full transition-all ${
                          data.primaryPhotoIndex === index
                            ? 'bg-brand text-white'
                            : 'bg-white/80 text-brand-navy/50 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      {data.primaryPhotoIndex === index && (
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Steps Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const isActive = step === i + 1;
            const isComplete = step > i + 1;
            return (
              <div key={s.label} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isComplete
                      ? 'bg-brand-gradient text-white'
                      : isActive
                        ? 'bg-brand-gradient text-white shadow-lg shadow-brand/30'
                        : 'bg-gray-100 text-brand-navy/40'
                  }`}
                >
                  {isComplete ? <Check className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
                </div>
                <span className={`text-xs mt-1 font-inter text-center hidden sm:block ${
                  isActive ? 'text-brand font-medium' : 'text-brand-navy/40'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-gradient rounded-full"
            initial={{ width: `${((step - 1) / 4) * 100}%` }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h3 className="text-xl font-bold font-poppins text-brand-navy mb-1">
              {steps[step - 1].label}
            </h3>
            <p className="text-sm text-brand-navy/50 font-inter mb-6">
              Step {step} of 5
            </p>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <motion.button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            whileHover={{ scale: step === 1 ? 1 : 1.02 }}
            whileTap={{ scale: step === 1 ? 1 : 0.98 }}
            className={`flex items-center gap-2 h-11 px-6 rounded-full font-medium font-inter text-sm transition-all ${
              step === 1
                ? 'text-brand-navy/30 cursor-not-allowed'
                : 'text-brand-navy border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          {step < 5 ? (
            <motion.button
              type="button"
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 h-11 px-6 bg-brand-gradient rounded-full text-white font-semibold font-poppins text-sm shadow-lg shadow-brand/25"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="flex items-center gap-2 h-11 px-8 bg-brand-gradient rounded-full text-white font-semibold font-poppins text-sm shadow-lg shadow-brand/25"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
