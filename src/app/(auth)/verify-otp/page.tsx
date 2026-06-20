'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { OtpInput } from '@/components/auth/OtpInput';

const RESEND_COOLDOWN = 60;

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
    setCanResend(true);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || json.message || 'Invalid OTP');
        return;
      }
      router.push('/login');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (!canResend || !email) return;
    setCanResend(false);
    setTimer(RESEND_COOLDOWN);
    setError('');
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      setError('Failed to resend OTP');
    }
  }, [canResend, email]);

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

      {/* OTP Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-premium p-8 sm:p-10 border border-white/50">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
              className="w-16 h-16 mx-auto mb-4 bg-brand/10 rounded-full flex items-center justify-center"
            >
              <ShieldCheck className="w-8 h-8 text-brand" />
            </motion.div>
            <h1 className="text-2xl font-bold font-poppins text-brand-navy mb-1">
              Verify OTP
            </h1>
            <p className="text-brand-navy/50 font-inter text-sm">
              Enter the 6-digit code sent to{' '}
              <span className="font-medium text-brand-navy">
                {email || 'your email'}
              </span>
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-inter text-center"
              >
                {error}
              </motion.div>
            )}

            <OtpInput
              value={otp}
              onChange={(val) => { setOtp(val); setError(''); }}
              error={otp.length > 0 && otp.length < 6 ? 'Enter all 6 digits' : ''}
              disabled={isLoading}
            />

            <motion.button
              type="button"
              onClick={handleVerify}
              disabled={isLoading || otp.length !== 6}
              whileHover={{ scale: isLoading || otp.length !== 6 ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || otp.length !== 6 ? 1 : 0.98 }}
              className="btn-premium w-full h-12 bg-brand-gradient rounded-full text-white font-semibold font-poppins text-base shadow-lg shadow-brand/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </motion.button>

            {/* Timer / Resend */}
            <div className="text-center">
              {!canResend ? (
                <div className="flex items-center justify-center gap-2 text-sm text-brand-navy/50 font-inter">
                  <Clock className="w-4 h-4" />
                  Resend in{' '}
                  <span className="font-mono font-medium text-brand-navy">
                    {String(Math.floor(timer / 60)).padStart(2, '0')}:
                    {String(timer % 60).padStart(2, '0')}
                  </span>
                </div>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleResend}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 text-sm text-brand font-medium font-inter hover:text-brand-dark transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resend OTP
                </motion.button>
              )}
            </div>
          </div>
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

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </main>
    }>
      <OtpForm />
    </Suspense>
  );
}
