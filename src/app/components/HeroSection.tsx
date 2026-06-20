'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Shield, Users } from 'lucide-react';

export default function HeroSection() {
  const [heroBg, setHeroBg] = useState('');
  const [heroH1, setHeroH1] = useState('Where Two Families');
  const [heroH1Gold, setHeroH1Gold] = useState('Unite in Sacred Bond');
  const [heroP, setHeroP] = useState('A trusted matrimonial platform for South Indian communities — built on values, verified with care.');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          if (res.data.heroImage) setHeroBg(res.data.heroImage);
          if (res.data.heroTitle) {
            const parts = res.data.heroTitle.split('Perfect Match');
            if (parts.length > 1) {
              setHeroH1(parts[0].trim() || 'Where Two Families');
              setHeroH1Gold('Perfect Match');
            } else {
              setHeroH1(res.data.heroTitle);
            }
          }
          if (res.data.heroSubtitle) setHeroP(res.data.heroSubtitle);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden hero-gradient min-h-[85vh] flex items-center">
      {heroBg && (
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F3D]/90 via-[#0B1488]/70 to-transparent" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(201,162,39,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)',
      }} />
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[#C9A227]/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-[#C9A227]" />
              <span className="text-[#C9A227] text-xs font-semibold tracking-[0.2em] uppercase">Trusted Since 2020</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {heroH1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] to-[#d4af37]">{heroH1Gold}</span>
            </h1>

            <p className="text-lg text-white/70 leading-relaxed max-w-xl mb-8">
              {heroP}
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-10">
              {[
                { num: '50,000+', label: 'Verified Profiles', icon: Users },
                { num: '8,200+', label: 'Happy Marriages', icon: Heart },
                { num: '47+', label: 'Communities', icon: Shield },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{stat.num}</div>
                    <div className="text-white/50 text-xs">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1488] font-bold text-sm hover:shadow-xl hover:shadow-[#C9A227]/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Register Free
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/5 transition-all"
              >
                Browse Profiles
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl max-w-md ml-auto">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-8 h-px bg-[#C9A227]/50" />
                  <span className="text-[#C9A227] text-xs font-semibold tracking-[0.15em] uppercase">Free Registration</span>
                  <div className="w-8 h-px bg-[#C9A227]/50" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-white">Find Your Life Partner</h2>
              </div>

              <QuickRegisterForm />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center lg:hidden z-10 px-4">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1488] font-bold text-sm shadow-xl"
        >
          Register Free — Find Your Match
        </Link>
      </div>
    </section>
  );
}

function QuickRegisterForm() {
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [form, setForm] = useState({ firstName: '', lastName: '', mobile: '', email: '' });

  return (
    <div className="space-y-3.5">
      <div className="flex gap-2">
        {(['Male', 'Female'] as const).map((g) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              gender === g
                ? 'bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1488]'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {g === 'Male' ? '♂' : '♀'} {g}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input type="text" placeholder="First Name" value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A227]/50 transition-all"
        />
        <input type="text" placeholder="Last Name" value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A227]/50 transition-all"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex items-center px-3 h-10 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm font-semibold shrink-0"
        >+91</div>
        <input type="text" placeholder="Mobile Number" value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A227]/50 transition-all"
        />
      </div>

      <input type="email" placeholder="Email Address" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A227]/50 transition-all"
      />

      <div className="flex items-start gap-2.5">
        <input type="checkbox" id="terms-hero" className="mt-0.5 w-4 h-4 rounded accent-[#C9A227]" />
        <label htmlFor="terms-hero" className="text-xs text-white/50 leading-relaxed">
          I agree to the{' '}
          <span className="text-[#C9A227] font-semibold cursor-pointer hover:text-[#d4af37] transition-colors">Terms & Conditions</span>
        </label>
      </div>

      <Link
        href="/register"
        className="block w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1488] font-bold text-sm hover:shadow-lg hover:shadow-[#C9A227]/20 transition-all"
      >
        Register Now — It&apos;s Free
      </Link>

      <p className="text-center text-xs text-white/50">
        Already a member?{' '}
        <Link href="/login" className="text-[#C9A227] font-semibold hover:text-[#d4af37] transition-colors">Sign In</Link>
      </p>
    </div>
  );
}
