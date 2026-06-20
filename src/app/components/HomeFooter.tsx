'use client';
import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function HomeFooter() {
  return (
    <footer className="bg-[#0B1488] text-white/70">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <Heart className="w-5 h-5 text-[#C9A227]" />
              </div>
              <span className="font-display text-lg font-semibold text-white">
                Vivaha<span className="text-[#C9A227]">Setu</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/40 max-w-xs">
              The most trusted matrimonial platform for South Indian communities. Connecting families since 2020.
            </p>
          </div>

          <div>
            <h4 className="text-[#C9A227] text-xs font-semibold tracking-widest uppercase mb-5">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/success-stories" className="text-sm text-white/50 hover:text-[#C9A227] transition-colors">Success Stories</Link></li>
              <li><Link href="/subscription" className="text-sm text-white/50 hover:text-[#C9A227] transition-colors">Premium Plans</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#C9A227] text-xs font-semibold tracking-widest uppercase mb-5">About</h4>
            <ul className="space-y-3">
              <li><Link href="/search" className="text-sm text-white/50 hover:text-[#C9A227] transition-colors">Browse Profiles</Link></li>
              <li><Link href="/success-stories" className="text-sm text-white/50 hover:text-[#C9A227] transition-colors">Success Stories</Link></li>
              <li><Link href="/faq" className="text-sm text-white/50 hover:text-[#C9A227] transition-colors">FAQ</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-white/50 hover:text-[#C9A227] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#C9A227] text-xs font-semibold tracking-widest uppercase mb-5">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/faq" className="text-sm text-white/50 hover:text-[#C9A227] transition-colors">Help Centre</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-white/50 hover:text-[#C9A227] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-white/50 hover:text-[#C9A227] transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact-us" className="text-sm text-white/50 hover:text-[#C9A227] transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} VivahaSetu. All rights reserved. | Bengaluru, Karnataka
          </p>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Heart className="w-3 h-3 text-[#C9A227]" />
            <span>Made for South Indian communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
