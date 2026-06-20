'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, Heart, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || json.message || 'Invalid credentials');
        return;
      }
      setAuth(json.data.user, json.data.accessToken);
      router.push(callbackUrl);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1488] via-[#1a1a6e] to-[#0F1DDB]" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 30%, rgba(201,162,39,0.1) 0%, transparent 40%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
      }} />
      <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-[#C9A227]/5 blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all"
            >
              <Heart className="w-6 h-6 text-[#C9A227]" />
            </motion.div>
            <span className="font-display text-2xl font-semibold text-white">
              Vivaha<span className="text-[#C9A227]">Setu</span>
            </span>
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-3xl font-bold text-white"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-sm mt-2"
          >
            Sign in to continue your journey
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 bg-red-500/15 border border-red-500/25 text-red-300 px-4 py-3 rounded-xl text-sm mb-6"
            >
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="text-red-300 text-xs font-bold">!</span>
              </div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#C9A227] transition-colors" />
                <input
                  type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" required
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A227]/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#C9A227] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password" required
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A227]/50 focus:bg-white/10 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#C9A227]" />
                <span className="group-hover:text-white/70 transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-[#C9A227] hover:text-[#d4af37] font-medium transition-colors">
                Forgot Password?
              </Link>
            </div>

            <motion.button
              type="submit" disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1488] font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#C9A227]/25 transition-all disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-white/40 bg-transparent">or continue with</span>
            </div>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium text-sm flex items-center justify-center gap-3 hover:bg-white/10 hover:text-white transition-all mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </motion.button>

          <p className="text-center text-sm text-white/50">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#C9A227] hover:text-[#d4af37] font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </motion.div>

        <p className="text-center mt-8 text-xs text-white/30">
          &copy; {new Date().getFullYear()} VivahaSetu. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1488] via-[#1a1a6e] to-[#0F1DDB]">
        <Loader2 className="w-6 h-6 animate-spin text-white/50" />
      </div>
    }>
      <LoginFormInner />
    </Suspense>
  );
}
