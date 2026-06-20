'use client';

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Success Stories', href: '/success-stories' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Use', href: '/terms' },
    ],
  };

  return (
    <footer className="bg-royal-gradient pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-serif font-bold text-white">
                Vivahasetu<span className="text-brand">.com</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Vivahasetu.com is the world&apos;s most trusted matrimony service. We
              believe in bridging hearts and building families through meaningful
              connections.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-brand mb-6">Company</h4>
            <ul className="flex flex-col gap-4">
              {links.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-brand text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-brand mb-6">Support</h4>
            <ul className="flex flex-col gap-4">
              {links.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-brand text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-brand mb-6">Get in Touch</h4>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 text-sm text-white/60">
                <MapPin className="text-brand shrink-0 mt-0.5" size={18} />
                <span>123, Matrimony Plaza, Bangalore, 560001</span>
              </div>
              <div className="flex gap-3 text-sm text-white/60">
                <Mail className="text-brand shrink-0 mt-0.5" size={18} />
                <span>contact@vivahasetu.com</span>
              </div>
              <div className="flex gap-3 text-sm text-white/60">
                <Phone className="text-brand shrink-0 mt-0.5" size={18} />
                <span>+91 800-VIVAHA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-brand/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-xs">
            &copy; {currentYear} Vivahasetu.com. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="/privacy-policy"
              className="text-white/40 hover:text-brand text-xs transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-white/40 hover:text-brand text-xs transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
