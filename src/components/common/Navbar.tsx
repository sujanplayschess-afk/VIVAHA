'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Menu, X, Phone, UserPlus, LogIn, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { isAuthenticated } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Premium Plans', href: '/subscription' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div className="top-bar hidden md:block relative z-[60]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Phone size={12} />
            <span>Help Line: </span>
            <a href="tel:+919974580125" className="font-semibold">9974580125</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <LogIn size={12} />
              Log In
            </Link>
            <Link href="/register" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <UserPlus size={12} />
              Registration
            </Link>
            <Link href="/register" className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors">
              <FileText size={12} />
              Make Biodata
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white shadow-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-brand-navy">
              Vivaha<span className="text-brand">Setu</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-soft-gray hover:text-brand transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
              </Link>
            ))}
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary text-sm py-2 px-5">
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-soft-gray hover:text-brand transition-colors"
                >
                  Log In
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-5">
                  Register Free
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-brand-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {/* Mobile top info */}
                <div className="flex items-center gap-2 text-xs text-soft-gray pb-2 border-b border-gray-100">
                  <Phone size={12} className="text-brand" />
                  <span>Help Line: </span>
                  <a href="tel:+919974580125" className="font-semibold text-brand-navy">9974580125</a>
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-soft-gray hover:text-brand font-medium py-2 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="my-2" />
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="btn-primary text-sm py-2.5 text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      className="btn-outline text-sm py-2.5 text-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      className="btn-primary text-sm py-2.5 text-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Register Free
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
