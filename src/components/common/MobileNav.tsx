'use client';

import React from 'react';
import { Home, Search, Heart, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui-store';

export const MobileNav = () => {
  const pathname = usePathname();
  const { isDarkMode } = useUIStore();

  const tabs = [
    { name: 'Home', icon: Home, href: '/dashboard' },
    { name: 'Search', icon: Search, href: '/search' },
    { name: 'Matches', icon: Heart, href: '/matches' },
    { name: 'Messages', icon: MessageCircle, href: '/messages' },
    { name: 'Profile', icon: User, href: '/profile' },
  ];

  const isActiveTab = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 ${
        isDarkMode
          ? 'bg-brand-navy/90 backdrop-blur-xl border-t border-brand/10'
          : 'bg-white/90 backdrop-blur-xl border-t border-gray-200/30'
      }`}
    >
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = isActiveTab(tab.href);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex flex-col items-center gap-1 w-full py-1"
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : isDarkMode
                    ? 'text-white/50'
                    : 'text-soft-gray'
                }`}
              >
                <tab.icon size={22} fill={isActive ? 'currentColor' : 'none'} />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive
                    ? 'text-brand'
                    : isDarkMode
                    ? 'text-white/40'
                    : 'text-soft-gray'
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
