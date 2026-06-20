'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';

interface LoginFormData {
  email: string;
  phone: string;
  password: string;
  rememberMe: boolean;
  csrfToken: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { rememberMe: false, csrfToken: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register('csrfToken')} />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          type="button"
          onClick={() => setLoginMode('email')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            loginMode === 'email'
              ? 'bg-white shadow-sm text-brand'
              : 'text-soft-gray hover:text-brand-navy'
          }`}
        >
          <Mail className="inline w-4 h-4 mr-1.5" />
          Email
        </button>
        <button
          type="button"
          onClick={() => setLoginMode('phone')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            loginMode === 'phone'
              ? 'bg-white shadow-sm text-brand'
              : 'text-soft-gray hover:text-brand-navy'
          }`}
        >
          <Phone className="inline w-4 h-4 mr-1.5" />
          Phone
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loginMode === 'email' ? (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <label className="block text-sm font-medium text-soft-gray mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                placeholder="you@example.com"
                className="input-field pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <label className="block text-sm font-medium text-soft-gray mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
              <input
                {...register('phone', {
                  required: 'Phone is required',
                  pattern: {
                    value: /^\d{10}$/,
                    message: 'Enter a valid 10-digit number',
                  },
                })}
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                className="input-field pl-10"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="block text-sm font-medium text-soft-gray mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            {...register('password', { required: 'Password is required' })}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="input-field pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-soft-gray hover:text-brand-navy transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            {...register('rememberMe')}
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand/30"
          />
          <span className="text-sm text-soft-gray group-hover:text-brand-navy transition-colors">
            Remember me
          </span>
        </label>
        <Link
          href="/forgot-password"
          className="text-sm text-brand font-medium hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="btn-primary w-full h-12 text-base"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <LogIn className="w-5 h-5" />
        )}
        {isLoading ? 'Signing in...' : 'Sign In'}
      </motion.button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-soft-gray">or</span>
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full h-12 border-2 border-gray-200 rounded-full text-brand-navy font-medium flex items-center justify-center gap-3 hover:border-gray-300 hover:shadow-md transition-all"
      >
        <span className="w-5 h-5 flex items-center justify-center font-bold text-lg text-red-500">G</span>
        <span>Continue with <span className="font-semibold">Google</span></span>
      </motion.button>
    </form>
  );
};
