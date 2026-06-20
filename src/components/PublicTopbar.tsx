'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, Heart, Menu, X } from 'lucide-react';

export default function PublicTopbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="bg-[#0B1488] text-white/70 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-5">
            <a href="tel:08069578121" className="flex items-center gap-1.5 hover:text-[#C9A227] transition-colors">
              <Phone className="w-3 h-3" />
              08069578121
            </a>
            <a href="mailto:support@vivahasetu.com" className="flex items-center gap-1.5 hover:text-[#C9A227] transition-colors hidden sm:flex">
              <Mail className="w-3 h-3" />
              support@vivahasetu.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-[#C9A227] transition-colors font-medium">Login</Link>
            <span className="opacity-20">|</span>
            <Link href="/register" className="hover:text-[#C9A227] transition-colors font-medium">Register</Link>
          </div>
        </div>
      </div>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-lg bg-white/95 backdrop-blur-md' : 'bg-white'
        }`}
        style={{ borderBottom: scrolled ? 'none' : '1px solid #E5E7EB' }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: -10 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B1488] to-[#0F1DDB] flex items-center justify-center"
            >
              <Heart className="w-5 h-5 text-[#C9A227]" />
            </motion.div>
            <span className="font-display text-xl font-semibold text-[#0B1488]">
              Vivaha<span className="text-[#C9A227]">Setu</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home', href: '/' },
              { label: 'Browse Profiles', href: '/search' },
              { label: 'Success Stories', href: '/success-stories' },
              { label: 'Premium Plans', href: '/subscription' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#6B7280] hover:text-[#0B1488] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-xl border-2 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-all"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1488] hover:shadow-lg hover:shadow-[#C9A227]/25 transition-all"
            >
              Register Free
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5 text-[#0B1488]" /> : <Menu className="w-5 h-5 text-[#0B1488]" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Browse Profiles', href: '/search' },
                { label: 'Success Stories', href: '/success-stories' },
                { label: 'Premium Plans', href: '/subscription' },
              ].map((link) => (
                <Link key={link.label} href={link.href}
                  className="block py-2 text-sm font-medium text-[#6B7280] hover:text-[#0B1488] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-semibold rounded-xl border-2 border-[#C9A227] text-[#C9A227]"
                  onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="flex-1 text-center py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1488]"
                  onClick={() => setMobileOpen(false)}>Register</Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}
