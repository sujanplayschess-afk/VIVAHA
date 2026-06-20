'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Send } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || json.message || 'Something went wrong');
        return;
      }
      setIsSent(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-light/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Logo variant="full" height={45} />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-premium p-8 sm:p-10 border border-white/50">
          <AnimatePresence mode="wait">
            {isSent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </motion.div>
                <h2 className="text-xl font-bold font-poppins text-brand-navy mb-2">
                  Check Your Email
                </h2>
                <p className="text-brand-navy/60 font-inter text-sm mb-6">
                  We&apos;ve sent a password reset OTP to{' '}
                  <span className="font-medium text-brand-navy">{email}</span>
                </p>
                <Link
                  href="/verify-otp"
                  className="inline-flex items-center gap-2 h-11 px-6 bg-brand-gradient rounded-full text-white font-semibold font-poppins text-sm shadow-lg shadow-brand/25"
                >
                  Enter OTP
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold font-poppins text-brand-navy mb-1">
                    Forgot Password
                  </h1>
                  <p className="text-brand-navy/50 font-inter text-sm">
                    Enter your email and we&apos;ll send you an OTP to reset your password
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-inter"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-brand-navy/70 font-inter mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-navy/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        placeholder="you@example.com"
                        className="input-field w-full pl-10"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="btn-premium w-full h-12 bg-brand-gradient rounded-full text-white font-semibold font-poppins text-base shadow-lg shadow-brand/25 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Back to Login */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6"
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-brand-navy/50 hover:text-brand-navy font-inter transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </motion.div>
    </main>
  );
}
