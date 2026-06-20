'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Sparkles, Handshake, ArrowRight } from 'lucide-react';

const steps = [
  { step: '01', icon: FileText, title: 'Create Your Profile', desc: 'Register with your community details, education, family background, and partner preferences. Our guided process ensures completeness.' },
  { step: '02', icon: ShieldCheck, title: 'Get Verified', desc: 'Our team verifies your identity and profile details. Verified profiles receive 3x more interest responses from families.' },
  { step: '03', icon: Sparkles, title: 'Discover Matches', desc: 'AI-powered matching considers community, gothra, education, values, and family expectations to surface the most compatible profiles.' },
  { step: '04', icon: Handshake, title: 'Connect & Decide', desc: 'Send and receive interests. Families connect directly. The decision remains entirely with you and your family.' },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F5F7FC]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#C9A227]" />
            <span className="text-[#C9A227] text-xs font-semibold tracking-[0.2em] uppercase">The VivahaSetu Process</span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#C9A227]" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0B1488] mb-4">
            How It Works
          </h2>
          <p className="text-[#6B7280] text-base max-w-xl mx-auto leading-relaxed">
            A simple, dignified, family-centred process that respects your values and time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#C9A227] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B1488] to-[#0F1DDB] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <s.icon className="w-8 h-8 text-[#C9A227]" />
                </div>
                <div className="text-[#C9A227] text-xs font-bold tracking-[0.15em] mb-3">{s.step}</div>
                <h3 className="font-display text-xl font-bold text-[#0B1488] mb-3">{s.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-[#C9A227]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
