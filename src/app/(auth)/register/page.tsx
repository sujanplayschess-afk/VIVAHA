'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Loader2 } from 'lucide-react';
import { RegistrationForm } from '@/components/auth/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen py-12 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1488] via-[#1a1a6e] to-[#0F1DDB]" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 75% 25%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 25% 75%, rgba(201,162,39,0.1) 0%, transparent 40%)',
      }} />
      <div className="absolute top-40 -left-20 w-96 h-96 rounded-full bg-[#C9A227]/5 blur-3xl" />
      <div className="absolute bottom-40 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative max-w-2xl mx-auto">
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
            Create Your Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-sm mt-2"
          >
            Join thousands of families who found their match
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          <RegistrationForm />
        </motion.div>

        <p className="text-center mt-6 text-sm text-white/50">
          Already have an account?{' '}
          <Link href="/login" className="text-[#C9A227] hover:text-[#d4af37] font-semibold transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
